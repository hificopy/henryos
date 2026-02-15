import WebSocket from 'ws';
import { GATEWAY_URL, GATEWAY_TOKEN } from '../config.js';

type ResolveReject = {
  resolve: (value: any) => void;
  reject: (err: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

class GatewayClient {
  private ws: WebSocket | null = null;
  private connected = false;
  private reqId = 0;
  private pendingRequests = new Map<string, ResolveReject>();
  private activeRuns = new Map<string, any>();
  private agentRuns = new Map<string, any>();

  get isConnected(): boolean {
    return this.connected;
  }

  private nextId(): string {
    return `henry-os-${++this.reqId}-${Date.now()}`;
  }

  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;
    if (!GATEWAY_TOKEN) {
      console.warn('[gateway-client] No GATEWAY_TOKEN set, skipping connection');
      return;
    }

    console.log('[gateway-client] connecting to', GATEWAY_URL);
    this.ws = new WebSocket(GATEWAY_URL);

    this.ws.on('open', () => console.log('[gateway-client] socket open, waiting for challenge...'));

    this.ws.on('message', (raw: Buffer) => {
      let msg: any;
      try { msg = JSON.parse(raw.toString()); } catch { return; }

      // Challenge -> authenticate
      if (msg.type === 'event' && msg.event === 'connect.challenge') {
        const id = this.nextId();
        this.ws!.send(JSON.stringify({
          type: 'req', id, method: 'connect',
          params: {
            minProtocol: 3, maxProtocol: 3,
            client: { id: 'gateway-client', version: '1.0.0', platform: 'linux', mode: 'backend' },
            role: 'operator',
            scopes: ['operator.read', 'operator.write'],
            caps: [],
            auth: { token: GATEWAY_TOKEN },
          },
        }));
        this.pendingRequests.set(id, {
          resolve: () => { this.connected = true; console.log('[gateway-client] authenticated'); },
          reject: (e) => console.error('[gateway-client] auth failed:', e),
          timer: setTimeout(() => { this.pendingRequests.delete(id); console.error('[gateway-client] auth timeout'); }, 15000),
        });
        return;
      }

      // Response to a request
      if (msg.type === 'res' && msg.id && this.pendingRequests.has(msg.id)) {
        const p = this.pendingRequests.get(msg.id)!;
        clearTimeout(p.timer);
        this.pendingRequests.delete(msg.id);
        if (msg.ok) p.resolve(msg.payload);
        else p.reject(new Error(msg.error?.message || 'Request failed'));
        return;
      }

      // Streaming agent events
      if (msg.type === 'event' && msg.event === 'agent' && msg.payload?.runId) {
        const eventRunId = msg.payload.runId;
        let run = this.activeRuns.get(eventRunId);

        if (!run) {
          const eventAgentId = msg.payload.agentId || msg.payload.data?.agentId;
          if (eventAgentId && this.agentRuns.has(eventAgentId)) {
            run = this.agentRuns.get(eventAgentId);
            if (run._runId) this.activeRuns.delete(run._runId);
            this.activeRuns.set(eventRunId, run);
            run._runId = eventRunId;
          }
        }

        if (!run) return;

        if (msg.payload.stream === 'assistant' && msg.payload.data?.delta) {
          run.chunks.push(msg.payload.data.delta);
        }
        if (msg.payload.stream === 'lifecycle' && msg.payload.data?.phase === 'end') {
          const text = run.chunks.join('');
          run.resolve(text || '');
          this.activeRuns.delete(eventRunId);
          this.agentRuns.delete(run._agentId);
        }
        if (msg.payload.stream === 'lifecycle' && msg.payload.data?.phase === 'error') {
          run.reject(new Error(msg.payload.data?.error || 'Agent run failed'));
          this.activeRuns.delete(eventRunId);
          this.agentRuns.delete(run._agentId);
        }
      }

      // Fallback: chat final event
      if (msg.type === 'event' && msg.event === 'chat' && msg.payload?.state === 'final' && msg.payload?.runId) {
        const eventRunId = msg.payload.runId;
        let run = this.activeRuns.get(eventRunId);

        if (!run) {
          const eventAgentId = msg.payload.agentId || msg.payload.data?.agentId;
          if (eventAgentId && this.agentRuns.has(eventAgentId)) {
            run = this.agentRuns.get(eventAgentId);
          }
        }

        if (!run) return;

        const text = msg.payload.message?.content?.[0]?.text
          || msg.payload.text
          || run.chunks.join('');
        if (text) {
          run.resolve(text);
          this.activeRuns.delete(eventRunId);
          if (run._runId && run._runId !== eventRunId) this.activeRuns.delete(run._runId);
          this.agentRuns.delete(run._agentId);
        }
      }
    });

    this.ws.on('close', (code: number) => {
      this.connected = false;
      console.warn(`[gateway-client] disconnected (code ${code}), reconnecting in 5s...`);
      setTimeout(() => this.connect(), 5000);
    });

    this.ws.on('error', (err: Error) => {
      console.error('[gateway-client] ws error:', err.message);
    });
  }

  private send(method: string, params: any, timeoutMs = 600000): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return reject(new Error('Gateway not connected'));
      }
      const id = this.nextId();
      const timer = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Gateway request ${method} timed out`));
      }, timeoutMs);
      this.pendingRequests.set(id, { resolve, reject, timer });
      this.ws.send(JSON.stringify({ type: 'req', id, method, params }));
    });
  }

  async listSessions(): Promise<any> {
    return this.send('sessions.list', {}, 10000);
  }

  async sendAgentMessage(agentId: string, message: string): Promise<string> {
    const idempotencyKey = `henry-os-${agentId}-${Date.now()}`;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.activeRuns.delete(idempotencyKey);
        this.agentRuns.delete(agentId);
        for (const [key, r] of this.activeRuns) {
          if (r._agentId === agentId) this.activeRuns.delete(key);
        }
        reject(new Error('Agent response timed out (10 min)'));
      }, 600000);

      const run = {
        _agentId: agentId,
        _runId: idempotencyKey,
        chunks: [] as string[],
        resolve: (text: string) => {
          clearTimeout(timeout);
          this.agentRuns.delete(agentId);
          resolve(text);
        },
        reject: (err: Error) => {
          clearTimeout(timeout);
          this.agentRuns.delete(agentId);
          reject(err);
        },
      };

      this.activeRuns.set(idempotencyKey, run);
      this.agentRuns.set(agentId, run);

      this.send('agent', {
        agentId,
        message,
        sessionKey: `agent:${agentId}:henry-os`,
        idempotencyKey,
      }).then((payload: any) => {
        const gwRunId = payload?.runId;
        if (gwRunId && gwRunId !== idempotencyKey) {
          if (this.activeRuns.has(idempotencyKey)) {
            this.activeRuns.delete(idempotencyKey);
            this.activeRuns.set(gwRunId, run);
            run._runId = gwRunId;
          }
        }
      }).catch((err: Error) => {
        clearTimeout(timeout);
        this.activeRuns.delete(idempotencyKey);
        this.agentRuns.delete(agentId);
        reject(err);
      });
    });
  }
}

export const gatewayClient = new GatewayClient();
