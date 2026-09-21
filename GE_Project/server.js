const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

// Environment validation
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET || 'development-only-session-secret';
const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production' && sessionSecret === 'development-only-session-secret') {
  throw new Error('SESSION_SECRET must be set in production environment.');
}

// Initialize Express app
const app = express();

// Security middleware
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Session configuration
app.use(
  session({
    name: 'worktable.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: nodeEnv === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Static files
app.use(
  express.static(__dirname, {
    maxAge: '1d',
    etag: false,
  })
);

// Match the clean browser routes used by the Netlify deployment.
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'profile.html')));
app.get('/settings', (req, res) => res.sendFile(path.join(__dirname, 'settings.html')));

// Database initialization
const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });
const database = new Database(path.join(dataDir, 'users.db'));

// Enable WAL mode for better concurrency
database.pragma('journal_mode = WAL');
database.pragma('synchronous = NORMAL');

// Initialize or migrate database schema
function initializeDatabase() {
  const usersTable = database
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'")
    .get();

  if (!usersTable) {
    database.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        student_id TEXT NOT NULL DEFAULT '',
        major TEXT NOT NULL DEFAULT '',
        skills TEXT NOT NULL DEFAULT '',
        projects TEXT NOT NULL DEFAULT '',
        language TEXT NOT NULL DEFAULT 'en',
        role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_username ON users(username COLLATE NOCASE);
      CREATE INDEX idx_created_at ON users(created_at);
    `);
  } else {
    const columns = database
      .prepare('PRAGMA table_info(users)')
      .all()
      .map((col) => col.name);
    const requiredColumns = {
      skills: "TEXT NOT NULL DEFAULT ''",
      projects: "TEXT NOT NULL DEFAULT ''",
      language: "TEXT NOT NULL DEFAULT 'en'",
      role: "TEXT NOT NULL DEFAULT 'user'",
    };

    for (const [name, definition] of Object.entries(requiredColumns)) {
      if (!columns.includes(name)) {
        database.exec(`ALTER TABLE users ADD COLUMN ${name} ${definition}`);
      }
    }

    database.prepare("UPDATE users SET role = 'admin' WHERE username = 'Administer'").run();
  }
}

initializeDatabase();

// Utility functions
function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    fullName: user.full_name,
    studentId: user.student_id,
    major: user.major,
    skills: user.skills,
    projects: user.projects,
    language: user.language,
    role: user.role || 'user',
    createdAt: user.created_at,
  };
}

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required. Please log in first.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    const user = database.prepare('SELECT role FROM users WHERE id = ?').get(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator access required.' });
    }
    next();
  });
}

// Input validation
function validateUsername(username) {
  return /^[a-zA-Z0-9_.-]{3,32}$/.test(String(username || '').trim());
}

function validatePassword(password) {
  return String(password || '').length >= 8;
}

// Routes: Authentication
app.post('/api/register', (req, res) => {
  try {
    const {
      username,
      password,
      passwordConfirmation,
      fullName,
      studentId = '',
      major = '',
    } = req.body;
    const normalizedUsername = String(username || '').trim();
    const normalizedFullName = String(fullName || '').trim();

    // Validation
    if (!normalizedUsername || !normalizedFullName) {
      return res.status(400).json({ error: 'Username and full name are required.' });
    }
    if (!validateUsername(normalizedUsername)) {
      return res
        .status(400)
        .json({ error: 'Username must be 3-32 characters using only letters, numbers, -, . or _' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }
    if (password !== passwordConfirmation) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const passwordHash = bcrypt.hashSync(password, 12);
    const result = database
      .prepare(
        `
      INSERT INTO users (username, password_hash, full_name, student_id, major, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `
      )
      .run(
        normalizedUsername,
        passwordHash,
        normalizedFullName,
        String(studentId).trim(),
        String(major).trim(),
        normalizedUsername.toLowerCase() === 'administer' ? 'admin' : 'user'
      );

    res.status(201).json({ registered: true, userId: result.lastInsertRowid });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username already in use.' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = database.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    req.session.regenerate((error) => {
      if (error) {
        console.error('Session regeneration error:', error);
        return res.status(500).json({ error: 'Session creation failed.' });
      }
      req.session.userId = user.id;
      res.json({ user: publicUser(user) });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.get('/api/me', requireAuth, (req, res) => {
  try {
    const user = database.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'User not found.' });
    }
    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ error: 'Failed to fetch user data.' });
  }
});

function updateProfileSettings(req, res) {
  try {
    const currentUser = database
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(req.session.userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const body = req.body || {};
    const validLanguages = ['en', 'th', 'es', 'fr', 'de'];
    const language = validLanguages.includes(body.language) ? body.language : currentUser.language;
    const fullName = String(body.fullName ?? '').trim();
    const studentId = String(body.studentId ?? '').trim();
    const major = String(body.major ?? '').trim();
    const skills = String(body.skills ?? '').trim();
    const projects = String(body.projects ?? '').trim();

    // Validate full name if provided
    if (fullName && fullName.length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters.' });
    }

    database
      .prepare(
        `
        UPDATE users
        SET full_name = ?, student_id = ?, major = ?, skills = ?, projects = ?, language = ?
        WHERE id = ?
      `
      )
      .run(fullName, studentId, major, skills, projects, language, req.session.userId);

    const updatedUser = database
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(req.session.userId);
    res.json({ user: publicUser(updatedUser) });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to save settings.' });
  }
}

// Keep the current endpoint and legacy endpoint names working.
app.put(['/api/settings', '/api/profile'], requireAuth, updateProfileSettings);

app.post('/api/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: 'Logout failed.' });
    }
    res.clearCookie('worktable.sid');
    res.json({ ok: true });
  });

});

// 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Not Found: ${req.method} ${req.path}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// Graceful shutdown
const server = app.listen(port, () => {
  console.log(`🚀 Automatic Work Table running at http://localhost:${port}`);
  console.log(`📦 Environment: ${nodeEnv}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    database.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    database.close();
    process.exit(0);
  });
});
