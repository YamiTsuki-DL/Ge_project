#!/bin/bash
# Sync all files to server
# Usage: ./sync-to-server.sh [server-user@server-ip] [remote-path]

REMOTE_USER=${1:-deploy}
REMOTE_HOST=${2:-localhost}
REMOTE_PATH=${3:-/app}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🔄 Syncing Automatic Work Table to Server"
echo "📍 Target: $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
echo "⏱️  Timestamp: $TIMESTAMP"
echo ""

# Files to sync
FILES=(
  "server.js"
  "index.html"
  "profile.html"
  "settings.html"
  "projectV3TEST.html"
  "projectV3TEST_backup.html"
  "style.css"
  "office_background.jpg"
  "Dockerfile"
  "docker-compose.yml"
  ".dockerignore"
  ".prettierrc"
  ".editorconfig"
  ".gitignore"
  ".env.example"
  "package.json"
  "package-lock.json"
  "README.md"
  "DEPLOYMENT.md"
  "DEPLOYMENT_SUMMARY.md"
  "PRODUCTION_CHECKLIST.md"
  "FORMATTING.md"
  "PROJECT_FILE_INVENTORY.md"
  "COMPLETE.md"
)

# Create backup on server
echo "📦 Creating backup on server..."
ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_PATH/backups/$TIMESTAMP && \
  cp -r $REMOTE_PATH/*.{js,html,css,json,yml,yaml,md} $REMOTE_PATH/backups/$TIMESTAMP/ 2>/dev/null || true && \
  echo '✅ Backup created'"

# Sync files
echo ""
echo "📝 Syncing files..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    scp -q "$file" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/$file"
    echo "  ✓ $file"
  fi
done

# Sync hidden files
echo "  ✓ .git/hooks/pre-commit"
ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_PATH/.git/hooks"
scp -q .git/hooks/pre-commit "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/.git/hooks/pre-commit" 2>/dev/null || true

echo "  ✓ .vscode/settings.json"
ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_PATH/.vscode"
scp -q .vscode/settings.json "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/.vscode/settings.json" 2>/dev/null || true

echo "  ✓ .vscode/extensions.json"
scp -q .vscode/extensions.json "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/.vscode/extensions.json" 2>/dev/null || true

# Format files on server
echo ""
echo "🎨 Auto-formatting files on server..."
ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && npx prettier --write . --ignore-unknown > /dev/null 2>&1 && echo '✅ Files formatted'"

# Rebuild and restart
echo ""
echo "🐳 Rebuilding and restarting services..."
ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && docker compose down > /dev/null 2>&1"
ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && docker compose up --build -d"

# Wait for health check
echo "⏳ Waiting for service to be healthy..."
sleep 5

# Verify
echo ""
echo "✅ Verification..."
ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && docker ps --filter name=work-table-app && echo '✅ Server updated successfully' || echo '❌ Container not running'"

echo ""
echo "📊 Summary:"
echo "  Remote: $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
echo "  Backup: backups/$TIMESTAMP"
echo "  Files Synced: ${#FILES[@]}"
echo "  Status: ✅ Complete"
