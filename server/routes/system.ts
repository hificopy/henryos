import { Router } from 'express';
import { gatewayClient } from '../services/gateway-client.js';
import { getAgents } from '../services/openclaw-config.js';
import { getCronJobs } from '../services/cron-parser.js';

export const systemRouter = Router();

const startTime = Date.now();

systemRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    gateway: gatewayClient.isConnected,
    uptime: Date.now() - startTime,
  });
});

systemRouter.get('/stats', async (_req, res) => {
  const agents = getAgents();
  const cronJobs = getCronJobs();

  let sessionCount = 0;
  if (gatewayClient.isConnected) {
    try {
      const raw = await gatewayClient.listSessions();
      const list = Array.isArray(raw) ? raw : raw?.sessions || [];
      sessionCount = list.length;
    } catch {
      // gateway error — leave at 0
    }
  }

  res.json({
    agents: agents.length,
    sessions: sessionCount,
    cronJobs: cronJobs.length,
  });
});
