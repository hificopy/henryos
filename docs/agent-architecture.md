# Agent Architecture

Axolop's AI team consists of 11 agents organized into a department-head hierarchy.

## Design Principles

- **Department heads are Opus-tier** — Strategic thinking, planning, and delegation require the strongest model
- **Workers are GLM-5** — Execution tasks (coding, writing, monitoring) use the cost-effective muscle tier
- **Read-only agents get Flash** — Reviewer uses GLM-4.7-Flash since it only reads and analyzes

## Departments

### Revenue Operations (Warren, CRO)

Warren manages growth strategy, revenue optimization, community building, and product-market fit.

**Reports:**
- **Scout** — Product intelligence, trend monitoring, competitive analysis
- **Herald** — Product launches, announcements, changelog writing

### Marketing (Hormozi, CMO)

Hormozi owns marketing strategy, content, offers, and demand generation.

**Reports:**
- **Quill** — Content writing, tweet drafting, brand voice

### Engineering (Elon, CTO)

Elon oversees engineering, architecture, code quality, and technical debt.

**Reports:**
- **Sales** — Sr. Developer for pipeline features
- **Marketing** — Sr. Developer for campaign features
- **Tasks** — Sr. Developer for workflow features
- **Reviewer** — Code review and quality audits

## Agent Configuration

Each agent has:

1. **Agent directory** (`~/.openclaw/agents/{id}/agent/`)
   - `SOUL.md` — Source persona (backup)
   - `auth-profiles.json` — API credentials
   - `models.json` — Model configuration

2. **Workspace** (`~/.openclaw/workspaces/{id}/`)
   - `SOUL.md` — Runtime persona (loaded by gateway)
   - `IDENTITY.md` — Name, creature, vibe, emoji
   - `USER.md` — Juan's profile
   - `AGENTS.md` — Team roster
   - `TOOLS.md` — Available tools
   - `MEMORY.md` — Consolidated knowledge
   - `memory/` — Daily session logs
   - `code` — Symlink to Axolop codebase

## Tool Permissions

| Agent | read | write | edit | exec |
|-------|------|-------|------|------|
| Henry | yes | yes | yes | no |
| Warren | yes | yes | no | no |
| Hormozi | yes | yes | no | no |
| Elon | yes | yes | yes | yes |
| Scout | yes | yes | no | no |
| Herald | yes | yes | no | no |
| Quill | yes | yes | no | no |
| Sales | yes | yes | yes | yes |
| Marketing | yes | yes | yes | yes |
| Tasks | yes | yes | yes | yes |
| Reviewer | yes | no | no | no |
