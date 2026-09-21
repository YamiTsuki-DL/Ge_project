# 🚀 QUICK REFERENCE - Server Update

**Status**: ✅ ALL 35 FILES READY FOR DEPLOYMENT

## One-Liner Deploy Commands

### Linux/Mac
```bash
chmod +x sync-to-server.sh && ./sync-to-server.sh deploy@server.com /app
```

### Windows
```cmd
sync-to-server.bat deploy@server.com /app
```

## What Gets Updated

✅ **6** Application files (HTML, CSS, JS)
✅ **3** Docker files (Dockerfile, docker-compose.yml)
✅ **8** Configuration files (.prettierrc, .env.example, etc)
✅ **10** Documentation files (guides, checklists)
✅ **4** Deployment scripts (deploy.sh/bat, sync.sh/bat)
✅ **2** Special files (i18n.js, backup)
✅ **2** Reference files (backup HTML, notes)

**Total: 35 Files | 22MB Docker Image | ~10 min deploy time**

## Pre-Sync Check (1 minute)

```bash
# Format check
npm run format:check

# Local test
docker ps | grep work-table-app

# SSH verify
ssh user@server "echo OK"

# You're good to go! ✅
```

## Sync Progress

```
1. Create backup on server    ⏱️ 1 min
2. Transfer all files         ⏱️ 1-2 min
3. Auto-format               ⏱️ 30 sec
4. Build Docker image        ⏱️ 30-60 sec
5. Start containers          ⏱️ 5-10 sec
6. Health check              ⏱️ 5-10 sec
7. Verify deployment         ⏱️ 2 min
   ─────────────────────────
   TOTAL:                     ⏱️ ~10-15 min
```

## Post-Sync Verify (2 minutes)

```bash
# Check container
ssh user@server "docker ps | grep work-table-app"

# Check logs
ssh user@server "docker logs work-table-app -n 5"

# Test API
curl http://your-server:3000/api/me

# Test website
# Visit: http://your-server:3000
```

## File Categories

| Category | Files | Status |
|----------|-------|--------|
| App | 6 | ✅ Ready |
| Docker | 3 | ✅ Ready |
| Config | 8 | ✅ Ready |
| Docs | 10 | ✅ Ready |
| Scripts | 4 | ✅ Ready |
| Other | 4 | ✅ Ready |

## 🔑 Key Files

- `server.js` → Your backend
- `Dockerfile` → Container
- `docker-compose.yml` → Orchestration
- `sync-to-server.sh/bat` → Deploy script
- `README.md` → Get started
- `DEPLOYMENT.md` → Full guide
- `UPDATE_CHECKLIST.md` → Step-by-step

## 📞 If Something Goes Wrong

1. **Can't SSH?** → Check server IP and credentials
2. **Port conflicts?** → Change port in docker-compose.yml
3. **Container won't start?** → Check logs: `docker logs work-table-app`
4. **Database error?** → Restore from backup
5. **Need to rollback?** → Auto-backup created, easy restore

See **UPDATE_CHECKLIST.md** for detailed troubleshooting.

## ✅ Success Indicators

After deploy, you should see:
- ✅ Container running (docker ps)
- ✅ No errors in logs
- ✅ Website loads at http://server:3000
- ✅ API responds (curl /api/me)
- ✅ Can register user
- ✅ Can login
- ✅ Can visit settings

## 🚨 Emergency Rollback (2 minutes)

```bash
ssh user@server
cd /app
docker compose down

# Restore backup (auto-created during sync)
cp -r backups/YYYYMMDD_HHMMSS/* .

# Restart
docker compose up -d
docker logs work-table-app
```

## 📚 Documentation

- Quick: This file
- Setup: README.md
- Deploy: DEPLOYMENT.md
- Update: UPDATE_CHECKLIST.md
- Full guide: SYNC_GUIDE.md
- Pre-flight: PRODUCTION_CHECKLIST.md

## 🎯 Next Step

1. Pick your method (Linux/Mac or Windows)
2. Replace server details (user@server, /app)
3. Run one-liner command above
4. Wait ~10 minutes
5. Verify with post-sync check
6. Document in your deployment log

---

**Version**: 1.0.0
**Files**: 35 total
**Status**: ✅ READY
**Deploy Time**: ~10-15 minutes
**Rollback Time**: ~2 minutes

🎉 **Ready to deploy!**
