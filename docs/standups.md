# Standups

The Standup system enables orchestrated multi-agent conversations for team coordination and decision-making.

## How It Works

1. **Create a standup** — Set a title, select participants, and define a topic
2. **Henry opens** — If Henry is a participant, he speaks first with direction-setting remarks
3. **Fan out** — Each other participant responds with their domain perspective
4. **Synthesis** — Henry reviews all input and produces action items
5. **Archive** — The completed standup is saved as JSON for future reference

## Creating a Standup

Click the **+** button in the standup sidebar to open the creation dialog:

- **Title** — Short label for the standup (e.g., "Sprint Review", "Launch Planning")
- **Topic** — The discussion prompt sent to all participants
- **Participants** — Select which agents should participate

## Thread View

Messages appear in chronological order with:

- Agent avatar and name
- Timestamp
- Rendered markdown content

Human messages can be injected into active standups using the input field.

## Storage

Standups are stored as JSON files in `data/standups/`:

```json
{
  "id": "standup-1707955200000",
  "title": "Daily Standup",
  "topic": "What did everyone work on today?",
  "participants": ["henry", "warren", "elon"],
  "messages": [...],
  "status": "completed",
  "createdAt": 1707955200000,
  "completedAt": 1707955800000
}
```

## Communication

Messages are sent to agents via the OpenClaw gateway WebSocket protocol. Each agent receives the topic and all prior context, then responds from their domain perspective.
