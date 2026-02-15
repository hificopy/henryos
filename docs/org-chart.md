# Org Chart

The Org Chart page visualizes the agent hierarchy as a department-based organizational tree.

## Hierarchy

```
Henry (Orchestrator, Opus 4.6)
├── Warren (CRO, Opus 4.6)
│   ├── Scout (Product Intelligence, GLM-5)
│   └── Herald (Product Launches, GLM-5)
├── Hormozi (CMO, Opus 4.6)
│   └── Quill (Content Writer, GLM-5)
└── Elon (CTO, Opus 4.6)
    ├── Sales (Sr. Dev — Pipeline, GLM-5)
    ├── Marketing (Sr. Dev — Campaigns, GLM-5)
    ├── Tasks (Sr. Dev — Workflows, GLM-5)
    └── Reviewer (Code Review, GLM-4.7-Flash)
```

## Agent Tiers

| Tier | Model | Role |
|------|-------|------|
| Orchestrator | Opus 4.6 | Henry — routes, plans, approves/rejects |
| Chief | Opus 4.6 | Warren, Hormozi, Elon — department leaders |
| Agent | GLM-5 / GLM-4.7-Flash | Specialized workers |

## Stats Bar

- **Chiefs** — Number of department heads (3)
- **Total in Org** — All agents in the hierarchy (11)
- **Registered** — Agents currently in openclaw.json
- **Pending Setup** — Agents in the org chart not yet registered

## Interactions

- Click any node to navigate to that agent's workspace
- Expand/collapse departments using the chevron button
- Nodes show model badge with tier-appropriate coloring
