import { Router } from 'express';
import { getAgents, getAgent } from '../services/openclaw-config.js';

export const agentsRouter = Router();

agentsRouter.get('/', (_req, res) => {
  res.json(getAgents());
});

agentsRouter.get('/:id', (req, res) => {
  const agent = getAgent(req.params.id);
  if (!agent) return res.status(404).json({ message: 'Agent not found' });
  res.json(agent);
});
