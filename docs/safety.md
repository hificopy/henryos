# Safety Rules

## Infrastructure Safety (All Agents)

These rules are embedded in every agent's SOUL.md and are non-negotiable:

- **NEVER** run `systemctl`, `systemd-run`, `sudo`, `service`, `reboot`, `shutdown`, or `poweroff`
- **NEVER** modify `~/.openclaw/openclaw.json` or any file in `~/.openclaw/` except workspace files
- **NEVER** kill, stop, disable, restart, or modify any system service
- **NEVER** restart the OpenClaw gateway — it kills the agent's own session
- **NEVER** modify the discord-relay service or its files
- **NEVER** modify systemd unit files

If infrastructure changes are needed, agents must tell Juan in Discord and stop.

## Tool Permissions

- **No exec** for non-dev agents: Henry, Scout, Quill, Herald, Warren, Hormozi, Reviewer
- **Exec allowed** for dev agents only: Elon, Sales, Marketing, Tasks
- **Read-only** for Reviewer — no write, edit, or exec

## Henry OS Safety

### Workspace File Security

- **Allowlist only** — Only 7 specific markdown files can be read/written
- **Forbidden files** — `auth-profiles.json`, `models.json`, `.env` are never exposed via API
- **Path traversal prevention** — All paths validated against base directory
- **Backup before write** — Every file edit creates a timestamped `.bak` copy

### API Security

- Config endpoint strips all tokens and API keys before returning data
- Gateway token is loaded from environment, never exposed in API responses
- Agent auth credentials are never readable through the UI

## Lessons from the Feb 14 Incident

Henry used exec access to:
1. Modify `openclaw.json` (self-destructive)
2. Restart the gateway (killed his own session)
3. Disable the discord-relay service

All 7 bots were offline for 14+ hours. Fixes applied:

- Removed exec from Henry, Scout, Quill, Reviewer
- Added SOUL.md infrastructure guardrails to all agents
- Changed relay service to `Restart=always` (not `on-failure`)
- Changed relay dependency to `Wants=` (not `Requires=`)
