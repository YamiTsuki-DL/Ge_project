# Production Checklist

Complete checklist before deploying to production.

## Pre-Deployment (1-2 hours before)

### Code & Files
- [ ] All files formatted with Prettier
  ```bash
  npm run format:check
  ```
- [ ] No uncommitted changes
  ```bash
  git status
  ```
- [ ] Recent code reviewed
- [ ] No debug console.log() statements left
- [ ] All error handling implemented
- [ ] Input validation on all endpoints

### Security
- [ ] `SESSION_SECRET` set to 32+ character random string
  ```bash
  openssl rand -base64 32
  ```
- [ ] `.env` file created and not in git
  ```bash
  cp .env.example .env
  ```
- [ ] Sensitive data not hardcoded in files
- [ ] SQL injection prevention (parameterized queries) ✅
- [ ] XSS protection (HTML escaping) ✅
- [ ] CSRF tokens if form submissions exist ✅
- [ ] Rate limiting considered
- [ ] HTTPS configured (via reverse proxy)

### Environment
- [ ] `NODE_ENV=production` set in `.env`
- [ ] `PORT` set correctly
- [ ] `LOG_LEVEL=warn` or `error`
- [ ] Database path writable
- [ ] Backups automated scheduled

### Docker
- [ ] Dockerfile builds successfully without errors
- [ ] Docker image size reasonable (~22MB)
- [ ] Health checks configured ✅
- [ ] Resource limits set in docker-compose.yml
- [ ] Volumes mounted correctly for production (data only)
- [ ] Networks properly isolated

## 30 Minutes Before Deployment

### Testing
- [ ] Local development test passed
  ```bash
  docker compose up --build -d
  docker logs work-table-app
  ```
- [ ] Registration endpoint working
- [ ] Login endpoint working
- [ ] Profile loading correctly
- [ ] Settings update working
- [ ] Logout functioning
- [ ] No console errors in browser
- [ ] Responsive on mobile

### Backups
- [ ] Current database backed up
  ```bash
  docker compose cp app:/app/data/users.db ./backups/users.db.pre-deploy
  ```
- [ ] Git repository backed up / pushed to remote
- [ ] Configuration files backed up

### Notifications
- [ ] Team notified of deployment
- [ ] Scheduled maintenance window announced
- [ ] Support aware of potential downtime
- [ ] Rollback plan communicated

## During Deployment

### Execution
- [ ] Run deployment script
  ```bash
  # Linux/Mac
  ./deploy.sh production
  
  # Windows
  deploy.bat production
  ```
- [ ] Monitor deployment logs
- [ ] Wait for health checks to pass
- [ ] Verify no errors in logs

### Immediate Testing (First 5 minutes)
- [ ] Container running: `docker ps`
- [ ] Health check passing
- [ ] App accessible at correct URL
- [ ] Homepage loading
- [ ] Login page displays
- [ ] No 404/500 errors
- [ ] Database initialized

### Functional Testing (5-15 minutes)
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Profile page loads with user data
- [ ] Can update settings (skills, projects, language)
- [ ] Can logout successfully
- [ ] Sessions persist correctly
- [ ] Error messages display properly

### Integration Testing (15-30 minutes)
- [ ] API endpoints responding < 500ms
- [ ] Database queries completing
- [ ] No memory leaks (monitor docker stats)
- [ ] File uploads working (if applicable)
- [ ] Email notifications sending (if applicable)
- [ ] External service calls succeeding (if applicable)

## Post-Deployment Monitoring

### First Hour
- [ ] Monitor logs for errors
  ```bash
  docker logs -f work-table-app
  ```
- [ ] Check application metrics
  ```bash
  docker stats work-table-app
  ```
- [ ] Monitor user activity
- [ ] Be ready to rollback if critical issues
- [ ] Have terminal ready for quick fixes

### Performance
- [ ] Response time acceptable (< 1 second)
- [ ] CPU usage reasonable (< 50%)
- [ ] Memory usage stable (no growth)
- [ ] Database queries optimized
- [ ] No connection pool exhaustion

### User Reports
- [ ] No critical errors reported
- [ ] No unusual 500 errors
- [ ] No authentication failures
- [ ] No data loss reported
- [ ] Performance acceptable for users

## If Issues Occur

### Minor Issues (Easily Fixed)
1. Check logs
   ```bash
   docker logs work-table-app -n 100
   ```
2. Fix code
3. Rebuild and restart
   ```bash
   docker compose up --build -d
   ```

### Critical Issues (Immediate Rollback)
1. Stop current deployment
   ```bash
   docker compose down
   ```
2. Restore previous database backup
   ```bash
   docker compose cp ./backups/users.db.pre-deploy app:/app/data/users.db
   ```
3. Checkout previous git commit
4. Redeploy previous version
5. Notify team
6. Post-mortem analysis

### Database Issues
```bash
# Check database integrity
docker compose exec app sqlite3 /app/data/users.db ".integrity_check"

# Backup current database
docker compose cp app:/app/data/users.db ./backups/users.db.issue

# Restore from backup
docker compose cp ./backups/users.db.pre-deploy app:/app/data/users.db
docker compose restart app
```

## Post-Deployment (After Stabilization)

### Documentation
- [ ] Update deployment log with timestamp
- [ ] Document any issues encountered
- [ ] Update runbooks if procedures changed
- [ ] Archive deployment artifacts

### Monitoring
- [ ] Setup continuous monitoring
- [ ] Configure alerting for errors
- [ ] Setup log aggregation (optional)
- [ ] Monitor database growth

### Maintenance
- [ ] Schedule regular backups
- [ ] Update monitoring dashboards
- [ ] Review performance metrics daily for 1 week
- [ ] Plan next maintenance window

## Automated Checks

### Run before final deployment
```bash
# Format check
npm run format:check

# Git status
git status

# Docker build test
docker build -t work-table-app:test .

# Docker compose test
docker compose config

# Health check
curl http://localhost:3000/health 2>/dev/null || echo "Server not responding"
```

## Rollback Procedure

If deployment fails or critical issues found:

```bash
# 1. Stop current version
docker compose down

# 2. Restore database from backup
docker compose cp ./backups/users.db.pre-deploy app:/app/data/users.db

# 3. Checkout previous git commit
git log --oneline -5
git checkout <previous-commit-hash>

# 4. Rebuild and start
docker compose up --build -d

# 5. Verify running
docker logs work-table-app

# 6. Notify team
```

**Time to rollback: ~2 minutes**

## Contact Information

In case of emergency:
- Backend Dev: [Contact]
- DevOps: [Contact]
- Manager: [Contact]
- Support: [Contact]

## Sign-Off

- [ ] QA Approved
- [ ] Security Reviewed
- [ ] DevOps Approved
- [ ] Product Owner Notified

**Deployment Date:** ___________

**Deployed By:** ___________

**Notes:** ___________

---

**Next Deployment Check:** 7 days after this deployment

Typical issues to watch for:
- Memory leaks
- Slow queries
- Connection pool exhaustion
- Disk space issues
- Log file growth
- Database lock contention
