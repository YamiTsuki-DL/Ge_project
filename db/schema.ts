import { sql } from 'drizzle-orm';
import { index, integer, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial().primaryKey(),
    username: text().notNull(),
    passwordHash: text('password_hash').notNull(),
    fullName: text('full_name').notNull(),
    studentId: text('student_id').notNull().default(''),
    major: text().notNull().default(''),
    skills: text().notNull().default(''),
    projects: text().notNull().default(''),
    language: text().notNull().default('en'),
    role: text().notNull().default('user'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Usernames are compared case-insensitively, matching the previous
    // SQLite `COLLATE NOCASE` behaviour.
    uniqueIndex('users_username_lower_idx').on(sql`lower(${table.username})`),
  ]
);

export const sessions = pgTable(
  'sessions',
  {
    id: text().primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => [index('sessions_user_id_idx').on(table.userId)]
);
