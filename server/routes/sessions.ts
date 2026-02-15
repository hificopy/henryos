import { Router } from 'express';
import { gatewayClient } from '../services/gateway-client.js';
import { parseSessions } from '../services/session-parser.js';
import type { SessionCategory } from '../services/session-parser.js';

export const sessionsRouter = Router();

sessionsRouter.get('/', async (req, res) => {
  if (!gatewayClient.isConnected) {
    return res.json([]);
  }

  try {
    const raw = await gatewayClient.listSessions();
    const sessions = parseSessions(Array.isArray(raw) ? raw : raw?.sessions || []);

    // Sort by most recent activity first
    sessions.sort((a, b) => b.updatedAt - a.updatedAt);

    // Optional filters
    const category = req.query.category as string | undefined;
    const agent = req.query.agent as string | undefined;

    const filtered = sessions.filter((s) => {
      if (category && s.category !== category) return false;
      if (agent && s.agentId !== agent) return false;
      return true;
    });

    res.json(filtered);
  } catch (err: any) {
    console.error('[sessions] Error fetching sessions:', err.message);
    res.json([]);
  }
});
