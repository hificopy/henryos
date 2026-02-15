# Gateway

Henry OS communicates with agents through the OpenClaw gateway WebSocket protocol.

## Connection

The gateway runs on `ws://127.0.0.1:18789` (configurable via `GATEWAY_URL` environment variable).

## Protocol

### Authentication

1. Gateway sends a `connect.challenge` event
2. Client responds with a `connect` request including auth token and client metadata
3. Gateway sends a response confirming authentication

```json
{
  "type": "req",
  "id": "henry-os-1-1707955200000",
  "method": "connect",
  "params": {
    "minProtocol": 3,
    "maxProtocol": 3,
    "client": {
      "id": "henry-os",
      "version": "1.0.0",
      "platform": "linux",
      "mode": "backend"
    },
    "role": "operator",
    "scopes": ["operator.read", "operator.write"],
    "auth": { "token": "..." }
  }
}
```

### Sending Messages

Messages are sent using the `agent` method:

```json
{
  "type": "req",
  "id": "unique-id",
  "method": "agent",
  "params": {
    "agentId": "henry",
    "message": "Hello",
    "sessionKey": "agent:henry:henry-os",
    "idempotencyKey": "henry-os-henry-1707955200000"
  }
}
```

### Streaming Response

Agent responses arrive as streaming events:

- `agent` events with `stream: "assistant"` carry text deltas
- `agent` events with `stream: "lifecycle", phase: "end"` signal completion
- `chat` events with `state: "final"` carry the complete message (fallback)

### Run Tracking

The gateway may assign a different `runId` than the client's `idempotencyKey`. Henry OS maintains a dual-index lookup (by `runId` and by `agentId`) to correctly match streaming events to their originating request.

## Status Indicator

The top bar shows a green/red dot indicating gateway connectivity. Status is polled every 10 seconds via `GET /api/gateway/status`.

## Reconnection

If the WebSocket connection drops, Henry OS automatically reconnects after 5 seconds.
