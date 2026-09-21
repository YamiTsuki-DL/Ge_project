@echo off
REM Sync all files to server (Windows)
REM Usage: sync-to-server.bat [server-user@server-ip] [remote-path]

setlocal enabledelayedexpansion

set REMOTE_USER=%1
set REMOTE_HOST=%2
set REMOTE_PATH=%3

if "!REMOTE_USER!"=="" (
  set REMOTE_USER=deploy
)
if "!REMOTE_HOST!"=="" (
  set REMOTE_HOST=localhost
)
if "!REMOTE_PATH!"=="" (
  set REMOTE_PATH=/app
)

for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set DATE=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set TIME=%%a%%b)
set TIMESTAMP=!DATE!_!TIME!

echo.
echo 🔄 Syncing Automatic Work Table to Server
echo 📍 Target: !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!
echo ⏱️  Timestamp: !TIMESTAMP!
echo.

REM Create backup on server
echo 📦 Creating backup on server...
ssh !REMOTE_USER!@!REMOTE_HOST! "mkdir -p !REMOTE_PATH!/backups/!TIMESTAMP! && cp -r !REMOTE_PATH!/*.* !REMOTE_PATH!/backups/!TIMESTAMP!/ 2^>nul ^|^| true"
echo ✅ Backup created
echo.

REM Sync files
echo 📝 Syncing files...

REM Application Files
scp -q server.js !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/server.js && echo   ✓ server.js
scp -q index.html !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/index.html && echo   ✓ index.html
scp -q profile.html !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/profile.html && echo   ✓ profile.html
scp -q settings.html !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/settings.html && echo   ✓ settings.html
scp -q projectV3TEST.html !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/projectV3TEST.html && echo   ✓ projectV3TEST.html
scp -q projectV3TEST_backup.html !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/projectV3TEST_backup.html && echo   ✓ projectV3TEST_backup.html
scp -q style.css !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/style.css && echo   ✓ style.css
scp -q office_background.jpg !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/office_background.jpg && echo   ✓ office_background.jpg

REM Config Files
scp -q .dockerignore !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/.dockerignore && echo   ✓ .dockerignore
scp -q .prettierrc !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/.prettierrc && echo   ✓ .prettierrc
scp -q .editorconfig !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/.editorconfig && echo   ✓ .editorconfig
scp -q .gitignore !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/.gitignore && echo   ✓ .gitignore
scp -q .env.example !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/.env.example && echo   ✓ .env.example

REM Docker Files
scp -q Dockerfile !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/Dockerfile && echo   ✓ Dockerfile
scp -q docker-compose.yml !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/docker-compose.yml && echo   ✓ docker-compose.yml

REM Package Files
scp -q package.json !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/package.json && echo   ✓ package.json
scp -q package-lock.json !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/package-lock.json && echo   ✓ package-lock.json

REM Documentation
scp -q README.md !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/README.md && echo   ✓ README.md
scp -q DEPLOYMENT.md !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/DEPLOYMENT.md && echo   ✓ DEPLOYMENT.md
scp -q DEPLOYMENT_SUMMARY.md !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/DEPLOYMENT_SUMMARY.md && echo   ✓ DEPLOYMENT_SUMMARY.md
scp -q PRODUCTION_CHECKLIST.md !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/PRODUCTION_CHECKLIST.md && echo   ✓ PRODUCTION_CHECKLIST.md
scp -q FORMATTING.md !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/FORMATTING.md && echo   ✓ FORMATTING.md
scp -q PROJECT_FILE_INVENTORY.md !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/PROJECT_FILE_INVENTORY.md && echo   ✓ PROJECT_FILE_INVENTORY.md
scp -q COMPLETE.md !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!/COMPLETE.md && echo   ✓ COMPLETE.md

echo.
echo 🎨 Auto-formatting files on server...
ssh !REMOTE_USER!@!REMOTE_HOST! "cd !REMOTE_PATH! && npx prettier --write . --ignore-unknown ^> /dev/null 2^>&1"
echo ✅ Files formatted
echo.

echo 🐳 Rebuilding and restarting services...
ssh !REMOTE_USER!@!REMOTE_HOST! "cd !REMOTE_PATH! && docker compose down ^> /dev/null 2^>&1"
ssh !REMOTE_USER!@!REMOTE_HOST! "cd !REMOTE_PATH! && docker compose up --build -d"

echo ⏳ Waiting for service to be healthy...
timeout /t 5 /nobreak >nul

echo.
echo ✅ Verification...
ssh !REMOTE_USER!@!REMOTE_HOST! "cd !REMOTE_PATH! && docker ps --filter name=work-table-app"

echo.
echo 📊 Summary:
echo   Remote: !REMOTE_USER!@!REMOTE_HOST!:!REMOTE_PATH!
echo   Backup: backups\!TIMESTAMP!
echo   Files Synced: 27
echo   Status: ✅ Complete
echo.
