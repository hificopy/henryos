# Workspaces

The Workspaces page provides a file editor for viewing and modifying agent identity and configuration files.

## Layout

Three-column layout:

1. **Agent List** — All registered agents with avatar and model badge
2. **File List** — Allowlisted workspace files for the selected agent
3. **Editor** — Markdown preview or edit mode with save capability

## Allowlisted Files

Only these files can be read/written through the UI:

| File | Purpose |
|------|---------|
| `SOUL.md` | Agent persona, voice rules, capabilities |
| `IDENTITY.md` | Name, creature type, vibe, emoji |
| `USER.md` | Juan's profile and working style |
| `AGENTS.md` | Team roster and routing rules |
| `TOOLS.md` | Available tools and permissions |
| `MEMORY.md` | Consolidated learnings |
| `HEARTBEAT.md` | Health check configuration |

## Safety

- **Path traversal prevention** — All file paths are validated against the workspace directory
- **Allowlist enforcement** — Only the 7 files above can be accessed
- **Forbidden files** — `auth-profiles.json`, `models.json`, `.env` are never exposed
- **Backup before write** — Every edit creates a timestamped backup in `.backups/`

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces/:agentId/files` | List available files |
| GET | `/api/workspaces/:agentId/files/:filename` | Read file content |
| PUT | `/api/workspaces/:agentId/files/:filename` | Write file (with backup) |
| GET | `/api/workspaces/:agentId/memory` | List daily memory files |
