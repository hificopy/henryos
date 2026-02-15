import { Router } from 'express';
import { getOpenClawConfig, getModelMetadata } from '../services/openclaw-config.js';

export const configRouter = Router();

configRouter.get('/', (_req, res) => {
  res.json(getOpenClawConfig());
});

configRouter.get('/models', (_req, res) => {
  res.json(getModelMetadata());
});
