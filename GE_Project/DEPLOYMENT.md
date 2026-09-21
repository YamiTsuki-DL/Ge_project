# Deployment Guide

Complete guide for deploying the Automatic Work Table application to production or staging environments.

## Quick Deployment

### Linux/Mac
```bash
chmod +x deploy.sh
./deploy.sh production
```

### Windows
```cmd
deploy.bat production
```

## What Gets Deployed

All edited files are automatically included:

### Application Files
- `server.js` — Express backend with authentication & settings APIs
- `index.html` — Login/registration page
- `profile.html` — User profile display page
- `settings.html` — User settings management page
- `projectV3TEST.html` — Main application interface
- `style.css` — Shared CSS styling

### Configuration Files
- `Dockerfile` — Production-ready container image (multi-stage build)
- `docker-compose.yml` — Service orchestration with volumes & health checks
- `.dockerignore` — Optimized build context
- `.env.example` — Environment variables template
- `.prettierrc` — Code formatting rules
- `.editorconfig` — IDE-agnostic formatting
- `.gitignore` — Git exclusions

### Documentation
- `README.md` — Project overview & setup instructions
- `FORMATTING.md` — Code formatting guidelines
- `DEPLOYMENT.md` — This file

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Update `.env` file with production secrets
  ```bash
  cp .env.example .env
  ```
  
- [ ] Set `SESSION_SECRET` to a strong random value
  ```bash
  # Generate with: openssl rand -base64 32
  SESSION_SECRET=your-strong-secret-here
  ```

- [ ] Set `NODE_ENV=production`

- [ ] Update `CORS_ORIGIN` if needed

- [ ] Test locally first
  ```bash
  docker compose up --build
  ```

- [ ] Run format check
  ```bash
  npm run format:check
  ```

- [ ] Review git status
  ```bash
  git status
  ```

## Deployment Environments

### Development
```bash
./deploy.sh development
NODE_ENV=development
```
- Full logging enabled
- No authentication for local testing
- Hot reload with file volumes

### Staging
```bash
./deploy.sh staging
NODE_ENV=development
```
- Production-like setup
- Real authentication
- Smaller resource limits

### Production
```bash
./deploy.sh production
NODE_ENV=production
```
- Minimal logging
- Strict security headers
- Maximum performance tuning
- Resource limits enforced

## Manual Deployment Steps

If you prefer to deploy manually:

1. **Build the image**
   ```bash
   docker build -t work-table-app:latest .
   ```

2. **Start containers**
   ```bash
   docker compose up --build -d
   ```

3. **Verify health**
   ```bash
   docker ps -a
   docker logs work-table-app
   ```

4. **Access application**
   - Local: http://localhost:3000
   - Remote: http://your-server-ip:3000

## Docker Compose Commands

### View logs
```bash
docker compose logs -f app           # Follow logs in real-time
docker compose logs app -n 50         # Last 50 lines
```

### Stop services
```bash
docker compose stop                   # Stop all services
docker compose down                   # Stop and remove containers
docker compose down -v                # Stop and remove volumes
```

### Rebuild
```bash
docker compose up --build -d          # Rebuild and start
docker compose build --no-cache       # Force rebuild without cache
```

### Database operations
```bash
docker compose exec app ls -la data/  # View database files
docker compose cp app:/app/data/. ./data/  # Backup database
```

## Rollback

The deployment script automatically creates backups:

```bash
ls -la backups/                       # List all backups
# Restore from a backup
cp -r backups/20240915_140230/* .
docker compose up --build -d
```

## File Volumes (Development Only)

Development setup includes live file mounts:

```yaml
volumes:
  - ./server.js:/app/server.js       # Changes reflect immediately
  - ./index.html:/app/index.html
  - ./profile.html:/app/profile.html
  - ./settings.html:/app/settings.html
  - ./style.css:/app/style.css
  - work-table-data:/app/data        # Persistent database
```

**Note:** Remove these in production for better performance.

## Environment Variables

Create `.env` file:

```bash
NODE_ENV=production
PORT=3000
SESSION_SECRET=<strong-random-secret>
LOG_LEVEL=warn
DATABASE_PATH=./data/users.db
```

### Available Variables
- `NODE_ENV` — Environment mode (development/production)
- `PORT` — Server port (default: 3000)
- `SESSION_SECRET` — Signing secret for session cookies (required in production)
- `LOG_LEVEL` — Logging verbosity (error/warn/info/debug)
- `DATABASE_PATH` — SQLite database location

## Database Management

### Backup Database
```bash
docker compose cp app:/app/data/users.db ./backups/users.db.backup
```

### Restore Database
```bash
docker compose cp ./backups/users.db.backup app:/app/data/users.db
docker compose restart app
```

### Reset Database (⚠️ Destructive)
```bash
docker compose exec app rm /app/data/users.db
docker compose restart app
```

## Monitoring

### Health Check Status
```bash
docker inspect work-table-app --format='{{.State.Health.Status}}'
```

### Resource Usage
```bash
docker stats work-table-app
```

### Performance Testing
```bash
# Install Apache Bench
# Test endpoint response time
ab -n 100 -c 10 http://localhost:3000/api/me
```

## Troubleshooting

### Container won't start
```bash
docker logs work-table-app
# Check for: port conflicts, file volume errors, database lock
```

### Port already in use
```bash
# Change port in docker-compose.yml or .env
docker compose down
docker compose up --build -d
```

### Database locked
```bash
docker compose restart app
# Or clear WAL files
docker compose exec app rm /app/data/users.db-shm /app/data/users.db-wal
```

### Authentication failing
```bash
# Verify SESSION_SECRET is set
docker compose exec app env | grep SESSION_SECRET
# If not set, add to .env and restart
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and deploy
        run: |
          docker build -t work-table-app:latest .
          docker compose up --build -d
      - name: Health check
        run: |
          sleep 5
          docker logs work-table-app
```

## Performance Tuning

### Optimize for production (uncomment in docker-compose.yml):
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

### Database optimization
```bash
# Enable WAL mode (already configured)
# PRAGMA journal_mode = WAL;
# PRAGMA synchronous = NORMAL;
```

## Security Checklist

- [ ] `SESSION_SECRET` is a strong random string (32+ chars)
- [ ] `NODE_ENV=production` in production
- [ ] HTTPS enabled (via reverse proxy like Nginx)
- [ ] Database backups automated
- [ ] Log rotation configured
- [ ] Firewall rules restrict access
- [ ] Container runs as non-root (via dumb-init)
- [ ] Sensitive files in .gitignore
- [ ] Regular security updates for Node.js/packages

## Support

For issues or questions:
1. Check logs: `docker logs work-table-app`
2. Review FORMATTING.md for code style issues
3. See README.md for project overview
4. Check this file for deployment troubleshooting
