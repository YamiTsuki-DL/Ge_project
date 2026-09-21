# Master Server Update Checklist

Complete step-by-step checklist for updating all files to the server.

## 🎯 Pre-Update Phase (15 minutes)

### Local Verification
- [ ] Verify all files present locally
  ```bash
  ls -la | grep -E "server.js|index.html|Dockerfile|README"
  ```

- [ ] Check file count (should be 27)
  ```bash
  find . -type f -not -path './node_modules/*' -not -path './.git/*' | wc -l
  ```

- [ ] Verify no uncommitted changes
  ```bash
  git status
  ```

- [ ] Latest Prettier format applied
  ```bash
  npm run format:check
  ```

### Local Testing
- [ ] Container running locally
  ```bash
  docker ps | grep work-table-app
  ```

- [ ] No errors in logs
  ```bash
  docker logs work-table-app | tail -20
  ```

- [ ] Health check passing
  ```bash
  curl -s http://localhost:3000/api/me
  ```

- [ ] Test registration endpoint
  ```bash
  curl -X POST http://localhost:3000/api/register \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"password123","fullName":"Test User"}'
  ```

### Backup Creation
- [ ] Create local backup
  ```bash
  mkdir -p ./backups/pre-update-$(date +%Y%m%d_%H%M%S)
  cp -r server.js *.html *.css *.json *.yml package-lock.json ./backups/pre-update-*/
  ```

- [ ] Backup size reasonable
  ```bash
  du -sh ./backups/pre-update-*
  ```

- [ ] Database backed up (if production)
  ```bash
  docker compose cp app:/app/data/users.db ./backups/users.db.backup
  ```

### Server Connectivity
- [ ] Server reachable
  ```bash
  ping -c 3 [server-ip]
  ```

- [ ] SSH access working
  ```bash
  ssh [user@server] "echo 'SSH OK'"
  ```

- [ ] Sufficient disk space
  ```bash
  ssh [user@server] "df -h | head -2"
  ```

- [ ] Docker installed on server
  ```bash
  ssh [user@server] "docker --version"
  ```

## 🚀 Update Phase (10 minutes)

### Choose Update Method

#### Method 1: Using Sync Script (Recommended)
```bash
# Linux/Mac
chmod +x sync-to-server.sh
./sync-to-server.sh [user@server] [/app]

# Windows
sync-to-server.bat [user@server] [/app]
```

- [ ] Sync script started
- [ ] File transfer in progress
- [ ] No SSH errors
- [ ] All files transferred
- [ ] Backup created on server
- [ ] Files auto-formatted on server
- [ ] Docker rebuilding
- [ ] Health check waiting

#### Method 2: Manual Git Push (For Git-based deployments)
```bash
# Add all changes
git add .

# Commit
git commit -m "Update: All production files $(date +%Y%m%d_%H%M%S)"

# Push to server
git push production main
```

- [ ] All files staged
- [ ] Commit message clear
- [ ] Git push successful
- [ ] No merge conflicts
- [ ] Server webhook triggered (if configured)

#### Method 3: Manual SCP (For direct SSH)
```bash
# Create script from sync-to-server.sh and run manually
for file in server.js *.html *.css *.json *.yml package*.json *.md; do
  scp "$file" [user@server]:/app/
done
```

- [ ] Each file copied successfully
- [ ] Checksums verified (optional)
- [ ] No transfer errors

### Server-Side Updates
- [ ] SSH into server
  ```bash
  ssh [user@server]
  cd /app
  ```

- [ ] Navigate to app directory
  ```bash
  pwd  # Should be /app
  ls -la  # Should see all files
  ```

- [ ] Verify file permissions
  ```bash
  ls -la *.js *.html | head -5
  ```

- [ ] Copy .env if needed
  ```bash
  [ ! -f .env ] && cp .env.example .env
  ```

- [ ] Update .env with production values
  ```bash
  nano .env
  # Set: NODE_ENV=production
  # Set: SESSION_SECRET=<strong-secret>
  ```

- [ ] Auto-format files
  ```bash
  npx prettier --write . --ignore-unknown
  ```

- [ ] Build Docker image
  ```bash
  docker build -t work-table-app:latest .
  ```

- [ ] Verify build successful
  ```bash
  docker images | grep work-table-app
  ```

- [ ] Stop old containers
  ```bash
  docker compose down
  ```

- [ ] Start new containers
  ```bash
  docker compose up --build -d
  ```

- [ ] Wait for health check (5-10 seconds)
  ```bash
  sleep 5
  docker ps | grep work-table-app
  ```

## ✅ Post-Update Phase (10 minutes)

### Verification

- [ ] Container running
  ```bash
  docker ps | grep work-table-app
  ```

- [ ] No startup errors
  ```bash
  docker logs work-table-app
  ```

- [ ] Health check passing
  ```bash
  docker inspect work-table-app --format='{{.State.Health.Status}}'
  ```

- [ ] Port 3000 listening
  ```bash
  netstat -tuln | grep 3000
  ```

- [ ] Website accessible
  ```bash
  curl -s http://localhost:3000 | head -10
  ```

### API Testing

- [ ] Login page loads
  ```bash
  curl -s http://localhost:3000 | grep -i "login"
  ```

- [ ] API /me endpoint working
  ```bash
  curl -s http://localhost:3000/api/me
  ```

- [ ] Registration endpoint working
  ```bash
  curl -X POST http://localhost:3000/api/register \
    -H "Content-Type: application/json" \
    -d '{"username":"test123","password":"password123","fullName":"Test User"}'
  ```

- [ ] Settings endpoint working
  ```bash
  # First login, then test settings
  curl -X PUT http://localhost:3000/api/settings \
    -H "Content-Type: application/json" \
    -b "worktable.sid=[session-cookie]" \
    -d '{"skills":"Docker, Node.js"}'
  ```

### Performance Check

- [ ] Response time acceptable (< 500ms)
  ```bash
  time curl -s http://localhost:3000 > /dev/null
  ```

- [ ] Database queries fast
  ```bash
  docker compose exec app sqlite3 /app/data/users.db "SELECT COUNT(*) FROM users;"
  ```

- [ ] CPU usage reasonable (< 50%)
  ```bash
  docker stats work-table-app --no-stream
  ```

- [ ] Memory usage stable (< 256MB)
  ```bash
  docker stats work-table-app --no-stream
  ```

### File Verification

- [ ] All files present on server
  ```bash
  ls -la /app/ | grep -E "server.js|Dockerfile|README"
  ```

- [ ] Files have correct permissions
  ```bash
  ls -la /app/*.js
  ```

- [ ] Configuration files in place
  ```bash
  ls -la /app/.{env.example,dockerignore,prettierrc,editorconfig,gitignore}
  ```

- [ ] Documentation present
  ```bash
  ls -la /app/*.md
  ```

## 📊 Issue Resolution

### If Container Won't Start

1. Check logs
   ```bash
   docker logs work-table-app -n 50
   ```

2. Check for port conflicts
   ```bash
   lsof -i :3000
   docker ps -a | grep 3000
   ```

3. Rebuild without cache
   ```bash
   docker compose build --no-cache
   docker compose up -d
   ```

4. Check volume permissions
   ```bash
   ls -la /app/data/
   docker compose exec app ls -la /app/data/
   ```

5. If still failing, rollback
   ```bash
   docker compose down
   docker compose pull  # Get previous image
   docker compose up -d
   ```

### If Database Won't Initialize

1. Check database file
   ```bash
   docker compose exec app ls -la /app/data/users.db
   ```

2. Check database integrity
   ```bash
   docker compose exec app sqlite3 /app/data/users.db ".integrity_check"
   ```

3. Restore from backup
   ```bash
   docker compose cp ./backups/users.db.backup app:/app/data/users.db
   docker compose restart app
   ```

4. Reset database (⚠️ loses data)
   ```bash
   docker compose exec app rm /app/data/users.db*
   docker compose restart app
   ```

### If API Endpoints Return Errors

1. Check server logs
   ```bash
   docker logs work-table-app | tail -50
   ```

2. Verify environment variables
   ```bash
   docker compose exec app env | grep -E "NODE_ENV|SESSION_SECRET"
   ```

3. Check database connection
   ```bash
   docker compose exec app sqlite3 /app/data/users.db "SELECT COUNT(*) FROM users;"
   ```

4. Restart service
   ```bash
   docker compose restart app
   sleep 5
   docker logs work-table-app
   ```

## 📋 Rollback Procedure

If critical issues found:

1. Stop current version
   ```bash
   docker compose down
   ```

2. Restore backup files
   ```bash
   rm -rf /app/server.js /app/*.html /app/*.css
   cp /app/backups/[timestamp]/* /app/
   ```

3. Restore database (if needed)
   ```bash
   docker compose cp /app/backups/users.db.backup app:/app/data/users.db
   ```

4. Rebuild with previous code
   ```bash
   git checkout HEAD~1  # Go back one commit
   docker compose build --no-cache
   docker compose up -d
   ```

5. Verify rolled back
   ```bash
   docker logs work-table-app
   docker ps | grep work-table-app
   ```

6. Document incident
   ```bash
   echo "Rollback due to [reason] at $(date)" >> /app/deployment.log
   ```

## 📝 Documentation

- [ ] Update deployment log
  ```bash
  echo "Deployment: $(date) - All files updated" >> deployment.log
  ```

- [ ] Document any issues
  - Issue: ___________
  - Resolution: ___________
  - Time: ___________

- [ ] Update team
  - [ ] Slack notification sent
  - [ ] Email sent to team
  - [ ] Status page updated

## ✅ Sign-Off

| Role | Name | Date | Time |
|------|------|------|------|
| Deployed By | _______ | _______ | _______ |
| Verified By | _______ | _______ | _______ |
| Approved By | _______ | _______ | _______ |

## 📞 Emergency Contacts

- DevOps Lead: ____________
- Backend Lead: ____________
- On-Call: ____________

## 🎉 Success Criteria

All must be true:
- [ ] Container running and healthy
- [ ] All files present and correct permissions
- [ ] Database initialized and healthy
- [ ] APIs responding correctly
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Backup verified
- [ ] Documentation updated

---

**Update Status**: [ ] Pending | [ ] In Progress | [ ] Complete | [ ] Rolled Back

**Total Time Estimated**: 35 minutes
**Total Time Actual**: _______

**Notes**:
_________________________________________________________________________________
_________________________________________________________________________________
