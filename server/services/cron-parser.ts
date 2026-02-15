import { readJSON } from './filesystem.js';
import { openclawPath } from '../config.js';
import { existsSync, readFileSync } from 'fs';

export function getCronJobs(): any[] {
  const cronPath = openclawPath('cron', 'jobs.json');
  if (!existsSync(cronPath)) return [];
  const data = readJSON(cronPath);
  return data.jobs || [];
}

export function getCronRuns(jobId: string): any[] {
  // Cron run logs are JSONL files named by job ID
  const logPath = openclawPath('cron', 'runs', `${jobId}.jsonl`);
  if (!existsSync(logPath)) return [];

  const lines = readFileSync(logPath, 'utf-8').trim().split('\n').filter(Boolean);
  return lines.map(line => {
    try { return JSON.parse(line); }
    catch { return null; }
  }).filter(Boolean).reverse().slice(0, 50); // Last 50 runs
}
