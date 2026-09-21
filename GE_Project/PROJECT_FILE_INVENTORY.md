# Project File Inventory

Complete list of all project files with descriptions, status, and purposes.

## Application Files

### Backend
| File | Status | Purpose | Size |
|------|--------|---------|------|
| `server.js` | ✅ Production Ready | Express backend, API endpoints, authentication, settings | ~8KB |
| `package.json` | ✅ Updated | Dependencies, scripts, metadata | ~837B |
| `package-lock.json` | ✅ Current | Locked dependency versions | ~47KB |

### Frontend - Pages
| File | Status | Purpose | Type |
|------|--------|---------|------|
| `index.html` | ✅ Optimized | Login/Register page with responsive design | HTML |
| `profile.html` | ✅ Optimized | User profile display with dark mode | HTML |
| `settings.html` | ✅ New | User settings management (skills, projects, language) | HTML |
| `projectV3TEST.html` | ✅ Active | Main application interface | HTML |
| `projectV3TEST_backup.html` | 📦 Backup | Previous version (keep for reference) | HTML |
| `style.css` | ✅ Optimized | Shared styling, transitions, focus states | CSS |

### Static Assets
| File | Status | Purpose | Type |
|------|--------|---------|------|
| `office_background.jpg` | ✅ Active | Login page background image | Image |
| `note.txt` | 📄 Notes | Project notes/scratch | Text |

## Configuration Files

### Docker & Deployment
| File | Status | Purpose |
|------|--------|---------|
| `Dockerfile` | ✅ Multi-stage Build | Production container image (22MB) |
| `docker-compose.yml` | ✅ Updated | Service orchestration, volumes, networks |
| `.dockerignore` | ✅ Optimized | Build context exclusions |

### Development & Tools
| File | Status | Purpose |
|------|--------|---------|
| `.prettierrc` | ✅ Active | Code formatting rules (2-space, 100 char lines) |
| `.editorconfig` | ✅ Active | IDE-agnostic formatting standards |
| `.gitignore` | ✅ Comprehensive | Git exclusions (node_modules, .env, data, logs) |
| `.env.example` | ✅ Template | Environment variables template |
| `.git/hooks/pre-commit` | ✅ Active | Auto-format code before commits |

### VS Code
| File | Status | Purpose |
|------|--------|---------|
| `.vscode/settings.json` | ✅ Configured | Format on save, exclusions, defaults |
| `.vscode/extensions.json` | ✅ Recommended | Prettier, ESLint, EditorConfig extensions |

## Documentation Files

| File | Status | Purpose | Lines |
|------|--------|---------|-------|
| `README.md` | ✅ Complete | Project overview, setup, API docs | ~140 |
| `DEPLOYMENT.md` | ✅ Complete | Deployment guide, rollback, troubleshooting | ~280 |
| `FORMATTING.md` | ✅ Complete | Code formatting quick reference | ~90 |
| `PROJECT_FILE_INVENTORY.md` | ✅ This File | Complete file listing and descriptions | This |

## Deployment Scripts

| File | Status | Platform | Purpose |
|------|--------|----------|---------|
| `deploy.sh` | ✅ Active | Linux/Mac | Auto-deploy with backups and health checks |
| `deploy.bat` | ✅ Active | Windows | Auto-deploy with backups and health checks |

## Database Files (Generated at Runtime)

| File | Status | Purpose |
|------|--------|---------|
| `data/users.db` | 🔄 Runtime | SQLite user database (WAL mode) |
| `data/users.db-shm` | 🔄 Runtime | Shared memory file (WAL) |
| `data/users.db-wal` | 🔄 Runtime | Write-ahead log file |

## Directory Structure

```
.
├── README.md                    # Main documentation
├── DEPLOYMENT.md                # Deployment guide
├── FORMATTING.md                # Code formatting guide
├── PROJECT_FILE_INVENTORY.md    # This file
│
├── server.js                    # Backend API server
├── package.json                 # Dependencies & scripts
├── package-lock.json            # Locked versions
│
├── index.html                   # Login/Register page
├── profile.html                 # User profile page
├── settings.html                # Settings page
├── projectV3TEST.html           # Main application
├── projectV3TEST_backup.html    # Backup
├── style.css                    # Shared styles
├── office_background.jpg        # Background image
│
├── Dockerfile                   # Container definition
├── docker-compose.yml           # Service orchestration
├── .dockerignore                # Docker build exclusions
│
├── .prettierrc                  # Prettier config
├── .editorconfig                # Editor config
├── .gitignore                   # Git exclusions
├── .env.example                 # Environment template
│
├── .git/
│   └── hooks/
│       └── pre-commit           # Auto-format hook
│
├── .vscode/
│   ├── settings.json            # VS Code settings
│   └── extensions.json          # Recommended extensions
│
├── deploy.sh                    # Linux/Mac deploy script
├── deploy.bat                   # Windows deploy script
│
├── backups/
│   └── YYYYMMDD_HHMMSS/        # Auto-created backups
│
├── data/                        # Runtime database
│   ├── users.db                 # Main database
│   ├── users.db-shm             # WAL shared memory
│   └── users.db-wal             # Write-ahead log
│
└── node_modules/                # Dependencies (gitignored)
```

## File Status Legend

- ✅ Production Ready — Tested and deployed
- 🔄 Runtime Generated — Created during execution
- 📦 Backup — Previous version kept for reference
- 📝 Updated — Recently modified
- 📄 Notes — Documentation/scratch files

## API Endpoints

All endpoints implemented in `server.js`:

### Authentication
- `POST /api/register` — Register new user
- `POST /api/login` — Login user
- `GET /api/me` — Get current user (requires auth)
- `POST /api/logout` — Logout user (requires auth)

### Settings
- `PUT /api/settings` — Update user settings (requires auth)
  - Fields: fullName, studentId, major, skills, projects, language

## Technologies Used

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 22+ |
| **Framework** | Express.js | 4.21+ |
| **Authentication** | bcryptjs | 2.4+ |
| **Database** | SQLite3 | better-sqlite3 11+ |
| **Sessions** | express-session | 1.18+ |
| **Formatting** | Prettier | 3.1+ |
| **Container** | Docker | Latest |
| **Orchestration** | Docker Compose | 3.8+ |

## Key Features by File

### server.js
- RESTful API endpoints
- Session-based authentication
- Input validation & sanitization
- Error handling & logging
- Database schema management
- Graceful shutdown

### index.html
- Login/Register form
- Form toggle UI
- Password visibility toggle
- Accessibility (aria labels)
- Error message display

### profile.html
- User info display
- Stats dashboard
- Dark mode support
- Responsive design
- Profile navigation

### settings.html
- Editable profile fields
- Skills management
- Projects list
- Language selection
- Form validation
- Save/Reset functionality

### style.css
- Critical rendering path
- Responsive mobile design
- Hover/focus states
- Error styling
- CSS containment for performance

### Dockerfile
- Multi-stage build (builder + production)
- Alpine base (22MB image)
- Layer caching optimization
- Health checks included
- Non-root execution

### docker-compose.yml
- Service definition
- Volume mounts (dev) & persistent (prod)
- Network configuration
- Health checks
- Environment variables
- Resource limits (commented)

## File Size Summary

| Category | Size | Files |
|----------|------|-------|
| **Backend** | ~8KB | server.js |
| **Frontend HTML** | ~32KB | 4 HTML files |
| **Styling** | ~4KB | style.css |
| **Config** | ~3KB | Multiple config files |
| **Documentation** | ~10KB | 4 markdown files |
| **Dependencies** | ~120MB | node_modules (runtime) |
| **Container Image** | ~22MB | Final Docker image |

## Deployment Checklist

- [ ] All files committed to git
- [ ] `.env` file created (not in git)
- [ ] `SESSION_SECRET` set to strong value
- [ ] Docker image built successfully
- [ ] Containers start and pass health checks
- [ ] Database initialized
- [ ] APIs responding correctly
- [ ] Frontend pages loading
- [ ] Authentication working
- [ ] Settings save/load working

## Recent Changes

### Latest Updates
- ✅ Added settings.html with comprehensive settings form
- ✅ Updated server.js with `/api/settings` endpoint
- ✅ Auto-formatting with Prettier added
- ✅ Deployment scripts created (deploy.sh, deploy.bat)
- ✅ Comprehensive documentation added
- ✅ Docker optimization completed

## Next Steps

Optional enhancements:
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add user avatar upload
- [ ] Database backups automation
- [ ] Monitoring/alerting setup
- [ ] Load testing
- [ ] Rate limiting on APIs
- [ ] HTTPS/SSL setup
- [ ] CDN for static assets
- [ ] Caching layer (Redis)

## Support & Maintenance

- See `README.md` for setup and local development
- See `DEPLOYMENT.md` for production deployment
- See `FORMATTING.md` for code style guidelines
- Check logs: `docker logs work-table-app`
- Backup database regularly
