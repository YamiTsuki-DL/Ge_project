# 🚀 Complete Server Sync Guide

Quick reference for syncing all files to your production/staging server.

## 📋 Quick Start

### For Linux/Mac Users
```bash
# Make script executable
chmod +x sync-to-server.sh

# Run sync
./sync-to-server.sh deploy@your-server.com /app

# Or with defaults
./sync-to-server.sh
```

### For Windows Users
```cmd
# Run sync
sync-to-server.bat deploy@your-server.com /app

# Or with defaults
sync-to-server.bat
```

## 📊 What Gets Synced (27 Files)

### Application
✅ server.js (backend API)
✅ index.html (login/register)
✅ profile.html (user profile)
✅ settings.html (settings page)
✅ projectV3TEST.html (main app)
✅ style.css (styling)

### Docker
✅ Dockerfile (container image)
✅ docker-compose.yml (orchestration)
✅ .dockerignore (build excludes)

### Config
✅ .prettierrc (code formatting)
✅ .editorconfig (editor standards)
✅ .gitignore (git excludes)
✅ .env.example (environment template)
✅ package.json (dependencies)
✅ package-lock.json (locked versions)

### Documentation
✅ README.md
✅ DEPLOYMENT.md
✅ PRODUCTION_CHECKLIST.md
✅ FORMATTING.md
✅ PROJECT_FILE_INVENTORY.md
✅ SYNC_STATUS.md
✅ UPDATE_CHECKLIST.md

### Scripts
✅ deploy.sh / deploy.bat (local deploy)
✅ sync-to-server.sh / sync-to-server.bat (server sync)

### Plus: Git hooks, VS Code config, and more

## 🎯 Pre-Sync Checklist (5 minutes)

- [ ] All files formatted locally
  ```bash
  npm run format:check
  ```

- [ ] Container running and healthy
  ```bash
  docker ps | grep work-table-app
  docker logs work-table-app | tail -5
  ```

- [ ] SSH access verified
  ```bash
  ssh user@server "echo OK"
  ```

- [ ] Backup created
  ```bash
  mkdir -p backups/$(date +%Y%m%d_%H%M%S)
  ```

## ⚡ One-Command Deploy

### Option 1: Full Automated (Recommended)
```bash
# Linux/Mac
./sync-to-server.sh deploy@myserver.com /app

# Windows
sync-to-server.bat deploy@myserver.com /app
```

This will:
1. ✅ Create backup on server
2. ✅ Sync all 27 files
3. ✅ Auto-format files
4. ✅ Build Docker image
5. ✅ Restart containers
6. ✅ Verify health
7. ✅ Show status

### Option 2: Git Push Deploy
```bash
git add .
git commit -m "Deploy: Update all files"
git push production main
```

### Option 3: Manual with Deploy Script
```bash
# Just sync to server
./sync-to-server.sh

# Then manually on server
ssh user@server
cd /app
docker compose down
docker compose up --build -d
docker logs work-table-app
```

## 📍 Server Information Needed

```
User: deploy              (SSH username)
Host: myserver.com        (Server IP or domain)
Path: /app               (Application path on server)
Port: 3000               (Application port)
```

## ✅ Post-Sync Verification (5 minutes)

### Check Container
```bash
ssh user@server "docker ps | grep work-table-app"
```

### Check Logs
```bash
ssh user@server "docker logs work-table-app -n 10"
```

### Test API
```bash
curl http://your-server:3000/api/me
```

### Browser Test
- Visit: http://your-server:3000
- Try: Register → Login → Profile → Settings

## 🔄 Sync Timing

| Step | Time |
|------|------|
| Backup on server | 1 min |
| File transfer | 1-2 min |
| Auto-format | 30 sec |
| Docker build | 30-60 sec |
| Container start | 5-10 sec |
| Health check | 5-10 sec |
| **Total** | **~5-10 min** |

## 🆘 Troubleshooting

### "SSH: Permission denied"
```bash
# Check SSH key
ssh-keygen -l -f ~/.ssh/id_rsa.pub

# Add key to server
ssh-copy-id user@server

# Test
ssh user@server "echo OK"
```

### "Port 22 refused"
```bash
# Check server IP
ping server.com

# Try different port
ssh -p 2222 user@server

# Check in script
./sync-to-server.sh user@server:2222 /app
```

### "Docker: command not found on server"
```bash
# Install Docker on server
ssh user@server "sudo apt-get install docker.io docker-compose"

# Verify
ssh user@server "docker --version"
```

### "Disk space insufficient"
```bash
# Check space on server
ssh user@server "df -h"

# Clean up old images
ssh user@server "docker system prune -a"
```

### "Container won't start"
```bash
# Check logs
ssh user@server "docker logs work-table-app"

# Check errors
ssh user@server "docker compose config"

# Rebuild without cache
ssh user@server "docker compose build --no-cache && docker compose up -d"
```

## 📋 Files Included & Their Purpose

| File | Size | Purpose |
|------|------|---------|
| server.js | 8KB | Backend with auth & settings |
| index.html | 8.5KB | Login/register page |
| profile.html | 9.1KB | User profile |
| settings.html | 13.4KB | Settings form |
| style.css | 4KB | Shared CSS |
| Dockerfile | 539B | Container definition |
| docker-compose.yml | 1.1KB | Service config |
| .env.example | 485B | Environment template |
| package.json | 837B | Dependencies |
| Plus 9 docs & configs | ~50KB | Full documentation |

## 🎯 Success Indicators

After sync completes, you should see:

```
✅ 27 files synced
✅ Auto-formatted
✅ Docker image built (22MB)
✅ Container running
✅ Health check passing
✅ No errors in logs
✅ APIs responding
```

## 🔐 Security Notes

- [ ] `.env` file created with strong `SESSION_SECRET`
- [ ] `NODE_ENV=production` set
- [ ] `.env` added to `.gitignore`
- [ ] No hardcoded secrets in files
- [ ] HTTPS configured (via reverse proxy)
- [ ] Database backed up before sync

## 📚 Documentation Reference

After sync, refer to:

- **Getting Started**: README.md
- **Deployment Help**: DEPLOYMENT.md
- **Pre-Deploy Checklist**: PRODUCTION_CHECKLIST.md
- **Code Style**: FORMATTING.md
- **All Files List**: PROJECT_FILE_INVENTORY.md
- **Sync Status**: SYNC_STATUS.md
- **Step-by-Step Update**: UPDATE_CHECKLIST.md

## 🚨 Emergency Rollback

If something goes wrong:

```bash
# On server
ssh user@server "cd /app && docker compose down"

# Restore from backup (auto-created)
ssh user@server "cd /app && cp -r backups/YYYYMMDD_HHMMSS/* ."

# Restart
ssh user@server "cd /app && docker compose up --build -d"

# Verify
ssh user@server "docker logs work-table-app"
```

**Time to rollback: ~2 minutes**

## 💡 Pro Tips

1. **Always backup first**
   ```bash
   docker compose cp app:/app/data/users.db ./backups/users.db.pre-sync
   ```

2. **Test locally before syncing**
   ```bash
   docker compose up -d
   # Test thoroughly
   docker compose down
   # Then sync to server
   ```

3. **Watch logs during sync**
   ```bash
   ssh user@server "docker logs -f work-table-app" &
   ./sync-to-server.sh user@server /app
   ```

4. **Use named backups**
   ```bash
   # Backup names with dates are auto-created
   ssh user@server "ls -la /app/backups/"
   ```

5. **Document your server**
   ```bash
   # Keep notes on what was synced and when
   echo "Synced at $(date)" >> /app/sync.log
   ```

## ✅ Complete Sync Workflow

```bash
# 1. Local preparation (5 min)
npm run format:check        # Verify formatting
docker compose up -d        # Start local test
docker logs work-table-app  # Check for errors
docker compose down         # Stop local

# 2. Create backup (1 min)
mkdir -p backups/pre-sync
docker compose cp app:/app/data/users.db backups/pre-sync/

# 3. Run sync (5-10 min)
chmod +x sync-to-server.sh
./sync-to-server.sh deploy@server.com /app

# 4. Verify (5 min)
ssh user@server "docker ps | grep work-table-app"
ssh user@server "docker logs work-table-app"
curl http://server:3000/api/me

# 5. Document
echo "Synced successfully at $(date)" >> deployment.log

# ✅ Done!
```

---

**Need Help?**
- Check: UPDATE_CHECKLIST.md (step-by-step)
- Read: DEPLOYMENT.md (comprehensive guide)
- See: PRODUCTION_CHECKLIST.md (before going live)

**Status**: ✅ Ready to sync
**Files**: 27 complete
**Size**: 22MB image
**Time**: ~10 minutes to complete
