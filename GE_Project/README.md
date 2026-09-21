# Automatic Work Table

A web-based work scheduling and authentication system built with Node.js, Express, and SQLite.

## Features

- User registration and authentication with bcrypt password hashing
- Session-based authentication with secure cookies
- SQLite database with WAL mode for concurrent access
- Responsive UI with dark mode support
- Docker containerization with multi-stage builds

## Getting Started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose (optional)
- Visual Studio Code (recommended)

### Local Development

1. Clone the repository
   ```bash
   git clone <repo-url>
   cd automatic-work-table
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the server
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

### Docker Deployment

```bash
# Build and run with Docker Compose
docker compose up --build -d

# View logs
docker compose logs -f app

# Stop containers
docker compose down
```

## Code Formatting

### Auto-Formatting

Prettier is configured for automatic code formatting:

- **On Save (VS Code)**: Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode). Code will format automatically on save.

- **Manual Format**:
  ```bash
  npm run format
  ```

- **Check Formatting**:
  ```bash
  npm run format:check
  ```

- **Git Pre-Commit Hook**: Code is automatically formatted before commits (requires Git Bash on Windows).

### Configuration

Formatting rules are defined in `.prettierrc`:
- 2-space indentation
- Single quotes for strings
- Semicolons at end of statements
- Max line width: 100 characters
- Trailing commas (ES5)

EditorConfig (`.editorconfig`) ensures consistency across different IDEs.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Production variables**:
- `NODE_ENV=production`
- `SESSION_SECRET=<strong-random-secret>`
- `PORT=3000`

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/me` - Get current user profile
- `POST /api/logout` - Logout user

## Project Structure

```
.
├── server.js           # Express server & API routes
├── index.html          # Login/register page
├── profile.html        # User profile page
├── projectV3TEST.html  # Main application
├── style.css           # Shared styles
├── Dockerfile          # Production image definition
├── docker-compose.yml  # Docker Compose configuration
├── .prettierrc          # Prettier formatting rules
└── .env.example        # Environment variables template
```

## Database

SQLite database located at `./data/users.db` with:
- WAL mode enabled for better concurrency
- Automatic schema creation on first run
- Schema migrations for existing databases

## Security

- Passwords hashed with bcrypt (12 rounds)
- Session cookies httpOnly and secure in production
- CSRF protection via session regeneration
- Input validation on all endpoints
- Environment-based secret management

## Development

### Testing

```bash
npm test
```

### Linting & Formatting

```bash
npm run format:check  # Check formatting
npm run format        # Auto-format code
```

## License

MIT
