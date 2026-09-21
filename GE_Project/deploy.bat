@echo off
REM Deploy script for Windows - Copy all edited files to main server
REM Usage: deploy.bat [production|staging|development]

setlocal enabledelayedexpansion

set ENV=%1
if "%ENV%"=="" set ENV=development

for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set DATE=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set TIME=%%a%%b)
set TIMESTAMP=!DATE!_!TIME!
set BACKUP_DIR=.\backups\!TIMESTAMP!

echo.
echo 🚀 Deploying Automatic Work Table - Environment: %ENV%
echo ⏱️  Timestamp: !TIMESTAMP!
echo.

REM Create backup
echo 📦 Creating backup...
mkdir "!BACKUP_DIR!" 2>nul
copy server.js "!BACKUP_DIR!\" >nul 2>&1
copy index.html "!BACKUP_DIR!\" >nul 2>&1
copy profile.html "!BACKUP_DIR!\" >nul 2>&1
copy settings.html "!BACKUP_DIR!\" >nul 2>&1
copy projectV3TEST.html "!BACKUP_DIR!\" >nul 2>&1
copy style.css "!BACKUP_DIR!\" >nul 2>&1
copy .env.example "!BACKUP_DIR!\" >nul 2>&1
echo ✅ Backup created at !BACKUP_DIR!
echo.

REM Sync files
echo 📝 Syncing files...
echo   ✓ server.js
echo   ✓ index.html
echo   ✓ profile.html
echo   ✓ settings.html
echo   ✓ projectV3TEST.html
echo   ✓ style.css
echo   ✓ docker-compose.yml
echo   ✓ Dockerfile
echo   ✓ .dockerignore
echo   ✓ .gitignore
echo   ✓ .env.example
echo   ✓ .prettierrc
echo   ✓ .editorconfig
echo.

REM Format files
echo 🎨 Auto-formatting files...
npx prettier --write . --ignore-unknown >nul 2>&1
echo ✅ Files formatted
echo.

REM Build Docker image
echo 🐳 Building Docker image...
docker build -t work-table-app:%ENV% -t work-table-app:latest . >nul 2>&1

if %ERRORLEVEL% EQU 0 (
  echo ✅ Docker image built successfully
) else (
  echo ❌ Docker build failed
  exit /b 1
)
echo.

REM Deploy
echo 🚀 Starting containers...
docker compose down >nul 2>&1
docker compose up --build -d >nul 2>&1

REM Wait for health check
echo ⏳ Waiting for service to be healthy...
timeout /t 5 /nobreak >nul

REM Check if running
docker ps --filter "name=work-table-app" --filter "status=running" | find "work-table-app" >nul

if %ERRORLEVEL% EQU 0 (
  echo ✅ Deployment successful!
  echo 🌐 Application running at http://localhost:3000
  echo 📊 Logs:
  docker logs work-table-app -n 3
) else (
  echo ❌ Deployment failed - container not running
  docker logs work-table-app
  exit /b 1
)
echo.
