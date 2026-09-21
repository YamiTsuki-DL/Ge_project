import type { Config, Context } from '@netlify/functions';
import bcrypt from 'bcryptjs';
import { and, eq, gt, sql } from 'drizzle-orm';

import { db } from '../../db/index.js';
import { sessions, users } from '../../db/schema.js';

const SESSION_COOKIE = 'worktable.sid';
const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 64 * 1024;

type User = typeof users.$inferSelect;

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function publicUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    studentId: user.studentId,
    major: user.major,
    skills: user.skills,
    projects: user.projects,
    language: user.language,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function body(req: Request): Promise<Record<string, unknown>> {
  const text = await req.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    throw new RangeError('Request body is too large.');
  }
  if (!text) return {};
  const value = JSON.parse(text);
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('A JSON object is required.');
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, maxLength: number) {
  return String(value ?? '').trim().slice(0, maxLength);
}

async function authenticatedUser(context: Context) {
  const sessionId = context.cookies.get(SESSION_COOKIE);
  if (!sessionId) return null;

  const [result] = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!result) context.cookies.delete(SESSION_COOKIE);
  return result?.user ?? null;
}

function setSessionCookie(context: Context, id: string) {
  context.cookies.set({
    name: SESSION_COOKIE,
    value: id,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: Math.floor(SESSION_LIFETIME_MS / 1000),
  });
}

async function register(req: Request) {
  const input = await body(req);
  const username = text(input.username, 32);
  const fullName = text(input.fullName, 120);
  const password = String(input.password ?? '');

  if (!username || !fullName) return json({ error: 'Username and full name are required.' }, 400);
  if (!/^[a-zA-Z0-9_.-]{3,32}$/.test(username)) {
    return json(
      { error: 'Username must be 3-32 characters using only letters, numbers, -, . or _' },
      400,
    );
  }
  if (password.length < 8 || password.length > 128) {
    return json({ error: 'Password must be between 8 and 128 characters.' }, 400);
  }
  if (password !== input.passwordConfirmation) return json({ error: 'Passwords do not match.' }, 400);

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({
      username,
      passwordHash,
      fullName,
      studentId: text(input.studentId, 80),
      major: text(input.major, 120),
      // Public registration must never grant elevated privileges based on a name.
      role: 'user',
    })
    .returning({ id: users.id });

  return json({ registered: true, userId: user.id }, 201);
}

async function login(req: Request, context: Context) {
  const input = await body(req);
  const username = text(input.username, 32);
  const password = String(input.password ?? '');
  if (!username || !password) return json({ error: 'Username and password are required.' }, 400);

  const [user] = await db
    .select()
    .from(users)
    .where(sql`lower(${users.username}) = lower(${username})`)
    .limit(1);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return json({ error: 'Invalid username or password.' }, 401);
  }

  const previousSession = context.cookies.get(SESSION_COOKIE);
  if (previousSession) await db.delete(sessions).where(eq(sessions.id, previousSession));

  const sessionId = crypto.randomUUID();
  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + SESSION_LIFETIME_MS),
  });
  setSessionCookie(context, sessionId);
  return json({ user: publicUser(user) });
}

async function me(context: Context) {
  const user = await authenticatedUser(context);
  return user
    ? json({ user: publicUser(user) })
    : json({ error: 'Authentication required. Please log in first.' }, 401);
}

async function updateSettings(req: Request, context: Context) {
  const user = await authenticatedUser(context);
  if (!user) return json({ error: 'Authentication required. Please log in first.' }, 401);

  const input = await body(req);
  const fullName = text(input.fullName, 120);
  if (fullName.length < 2) return json({ error: 'Full name must be at least 2 characters.' }, 400);
  const language = ['en', 'th', 'es', 'fr', 'de'].includes(String(input.language))
    ? String(input.language)
    : user.language;

  const [updated] = await db
    .update(users)
    .set({
      fullName,
      studentId: text(input.studentId, 80),
      major: text(input.major, 120),
      skills: text(input.skills, 2000),
      projects: text(input.projects, 4000),
      language,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .returning();

  return json({ user: publicUser(updated) });
}

async function logout(context: Context) {
  const sessionId = context.cookies.get(SESSION_COOKIE);
  if (sessionId) await db.delete(sessions).where(eq(sessions.id, sessionId));
  context.cookies.delete(SESSION_COOKIE);
  return json({ ok: true });
}

export default async function handler(req: Request, context: Context) {
  try {
    const path = new URL(req.url).pathname.replace(/\/+$/, '');
    if (req.method === 'POST' && path === '/api/register') return await register(req);
    if (req.method === 'POST' && path === '/api/login') return await login(req, context);
    if (req.method === 'GET' && path === '/api/me') return await me(context);
    if (req.method === 'PUT' && ['/api/settings', '/api/profile', '/profile'].includes(path)) {
      return await updateSettings(req, context);
    }
    if (req.method === 'POST' && path === '/api/logout') return await logout(context);
    return json({ error: `Not Found: ${req.method} ${path}` }, 404);
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof TypeError) {
      return json({ error: 'The request body must be valid JSON.' }, 400);
    }
    if (error instanceof RangeError) return json({ error: error.message }, 413);
    if (typeof error === 'object' && error && 'code' in error && error.code === '23505') {
      return json({ error: 'Username already in use.' }, 409);
    }
    console.error('API request failed', error);
    return json({ error: 'The server could not complete the request. Please try again.' }, 500);
  }
}

export const config: Config = {
  path: ['/api/*', '/profile'],
};
