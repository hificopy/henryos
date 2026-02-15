import { Router } from 'express';
import { getCronJobs, getCronRuns } from '../services/cron-parser.js';

export const cronRouter = Router();

cronRouter.get('/jobs', (_req, res) => {
  res.json(getCronJobs());
});

cronRouter.get('/runs/:jobId', (req, res) => {
  res.json(getCronRuns(req.params.jobId));
});
