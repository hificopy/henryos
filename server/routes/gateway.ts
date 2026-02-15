import { Router } from 'express';
import { gatewayClient } from '../services/gateway-client.js';

export const gatewayRouter = Router();

gatewayRouter.get('/status', (_req, res) => {
  res.json({ connected: gatewayClient.isConnected });
});

gatewayRouter.post('/agent/:agentId/message', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });
    const response = await gatewayClient.sendAgentMessage(req.params.agentId, message);
    res.json({ response });
  } catch (err: any) {
    res.status(502).json({ message: err.message });
  }
});
