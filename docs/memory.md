# Memory Architecture

Each agent in Axolop has a three-layer memory system managed by OpenClaw.

## Layer 1 — Working Memory (Auto-loaded)

Files loaded automatically at session start:

- `SOUL.md` — Agent persona and behavior rules
- `IDENTITY.md` — Name, creature type, vibe, emoji
- `USER.md` — Juan's profile and preferences
- `AGENTS.md` — Team roster and routing rules
- `TOOLS.md` — Available tool permissions
- `MEMORY.md` — Consolidated knowledge from past sessions

These files are editable through the Henry OS Workspaces page.

## Layer 2 — Episodic Memory (Auto-loaded)

Daily session logs stored in `memory/YYYY-MM-DD.md`:

- Today's and yesterday's logs are loaded automatically
- Agents write important context throughout sessions
- Henry periodically consolidates patterns into each agent's `MEMORY.md`

## Layer 3 — Semantic Memory (Search on demand)

Agents use `memory_search` to query:

- The Axolop Brain vault (Obsidian, at `2. AXOLOP-BRAIN/`)
- Past session conversations
- All agents' memory files
- Extra paths configured in `openclaw.json`

## The Brain

The Axolop Brain is an Obsidian vault containing company knowledge:

```
2. AXOLOP-BRAIN/
├── 1. Axolop/           — Company knowledge (sales, market, service)
├── 2. juansbiz/         — Juan's personal brand (content, marketing)
├── 3. Archive/          — Old/archived knowledge
├── 4. Context/          — Team coordination
│   ├── shared/          — Project state (Henry writes, all read)
│   ├── agents/{id}/     — Per-agent goals + session summaries
│   └── handoffs/        — Async inbox messages between agents
└── templates/           — Templater templates
```

## Memory Consolidation

Henry (orchestrator) has special memory duties:

1. Review all agents' daily logs periodically
2. Distill patterns into each agent's `MEMORY.md`
3. Maintain `shared/project-status.md` and `active-sprint.md`
4. Prune changelog entries older than 14 days
5. Flag stale agent inboxes (unprocessed > 3 days)
