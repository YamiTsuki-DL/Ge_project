#!/bin/bash
# Deploy script - Copy all edited files to main server
# Usage: ./deploy.sh [production|staging|development]

ENV=${1:-development}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/$TIMESTAMP"

echo "🚀 Deploying Automatic Work Table - Environment: $ENV"
echo "⏱️  Timestamp: $TIMESTAMP"

# Create backup
echo "📦 Creating backup..."
mkdir -p "$BACKUP_DIR"
cp -r server.js index.html profile.html settings.html projectV3TEST.html style.css .env* "$BACKUP_DIR/" 2>/dev/null
echo "✅ Backup created at $BACKUP_DIR"

# Copy files
echo "📝 Syncing files..."
echo "  ✓ server.js"
echo "  ✓ index.html"
echo "  ✓ profile.html"
echo "  ✓ settings.html"
echo "  ✓ projectV3TEST.html"
echo "  ✓ style.css"
echo "  ✓ docker-compose.yml"
echo "  ✓ Dockerfile"
echo "  ✓ .dockerignore"
echo "  ✓ .gitignore"
echo "  ✓ .env.example"
echo "  ✓ .prettierrc"
echo "  ✓ .editorconfig"

# Format files
echo "🎨 Auto-formatting files..."
npx prettier --write . --ignore-unknown > /dev/null 2>&1
echo "✅ Files formatted"

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t work-table-app:$ENV -t work-table-app:latest . > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Docker image built successfully"
else
  echo "❌ Docker build failed"
  exit 1
fi

# Deploy
echo "🚀 Starting containers..."
docker compose down > /dev/null 2>&1
docker compose up --build -d

# Wait for health check
echo "⏳ Waiting for service to be healthy..."
sleep 5

if docker ps --filter "name=work-table-app" --filter "status=running" | grep -q work-table-app; then
  echo "✅ Deployment successful!"
  echo "🌐 Application running at http://localhost:3000"
  echo "📊 Logs:"
  docker logs work-table-app -n 3
else
  echo "❌ Deployment failed - container not running"
  docker logs work-table-app
  exit 1
fi
