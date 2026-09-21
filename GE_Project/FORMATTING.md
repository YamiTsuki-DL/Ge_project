# Auto-Formatting Setup

This project is configured with **Prettier** for automatic code formatting across all file types.

## Quick Reference

### Option 1: VS Code (Recommended)
**Automatic formatting on save**
1. Install [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
2. VS Code will recommend the extension when you open the project
3. Code formats automatically on save (`Ctrl+S` / `Cmd+S`)
4. Optionally: `Shift+Alt+F` to format the current file

### Option 2: Command Line
**Manual formatting**
```bash
npm run format        # Format all files
npm run format:check  # Check formatting without changes
```

### Option 3: Git Hook
**Automatic formatting on commit**
- Files are auto-formatted before each commit (Git Bash on Windows, native on Mac/Linux)
- No action needed—it happens automatically

## Formatting Rules

Configured in `.prettierrc`:
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always add
- **Line Width**: 100 characters max
- **Trailing Commas**: ES5 style (objects/arrays)
- **End of Line**: LF (Unix-style)

## IDE Integration

- **VS Code**: `.vscode/settings.json` + Prettier extension (recommended)
- **WebStorm/JetBrains**: Built-in support for `.prettierrc`
- **Vim/Neovim**: Install `prettier` + `vim-prettier` plugin
- **Other Editors**: Install Prettier plugin + enable on save

## Ignored Files

Prettier skips these (see `.prettierignore`):
- `node_modules/`
- `data/` (database)
- `.git/`
- Build artifacts

## Troubleshooting

**"Prettier not found" error?**
```bash
npx prettier --write .
```

**Formatting not working in VS Code?**
1. Install Prettier extension: `esbenp.prettier-vscode`
2. Set as default formatter: `Ctrl+Shift+P` → "Format Document With" → Prettier
3. Enable format on save in settings

**Want to skip formatting for a file?**
Add to `.prettierignore`:
```
path/to/file.js
```

**Want to exclude a line from formatting?**
```javascript
// prettier-ignore
const x=1;const y=2;
```
