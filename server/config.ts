import path from 'path';
import { existsSync } from 'fs';

export const OPENCLAW_DIR = process.env.OPENCLAW_DIR || path.join(process.env.HOME || '/home/juansbiz', '.openclaw');
export const GATEWAY_URL = process.env.GATEWAY_URL || 'ws://127.0.0.1:18789';
export const GATEWAY_TOKEN = process.env.GATEWAY_TOKEN || '';
export const DATA_DIR = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'data');

export function openclawPath(...segments: string[]): string {
  return path.join(OPENCLAW_DIR, ...segments);
}

export function dataPath(...segments: string[]): string {
  return path.join(DATA_DIR, ...segments);
}

export function validatePathWithinDir(targetPath: string, baseDir: string): boolean {
  const resolved = path.resolve(targetPath);
  const resolvedBase = path.resolve(baseDir);
  return resolved.startsWith(resolvedBase);
}

// Verify openclaw dir exists on startup
if (!existsSync(OPENCLAW_DIR)) {
  console.error(`[config] OpenClaw directory not found: ${OPENCLAW_DIR}`);
  process.exit(1);
}
