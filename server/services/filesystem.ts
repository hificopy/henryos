import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync, statSync } from 'fs';
import path from 'path';
import { openclawPath, validatePathWithinDir } from '../config.js';

const ALLOWED_WORKSPACE_FILES = new Set([
  'SOUL.md', 'IDENTITY.md', 'USER.md', 'AGENTS.md', 'TOOLS.md', 'MEMORY.md', 'HEARTBEAT.md',
]);

const FORBIDDEN_FILES = new Set([
  'auth-profiles.json', 'models.json', '.env',
]);

export function readJSON(filePath: string): any {
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function readText(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}

export function listWorkspaceFiles(agentId: string): string[] {
  const wsDir = openclawPath('workspaces', agentId);
  if (!existsSync(wsDir)) return [];
  return readdirSync(wsDir)
    .filter(f => ALLOWED_WORKSPACE_FILES.has(f))
    .filter(f => {
      const fullPath = path.join(wsDir, f);
      try { return statSync(fullPath).isFile(); } catch { return false; }
    });
}

export function readWorkspaceFile(agentId: string, filename: string): string {
  if (FORBIDDEN_FILES.has(filename)) throw new Error('Access denied');
  if (!ALLOWED_WORKSPACE_FILES.has(filename)) throw new Error(`File not in allowlist: ${filename}`);

  const filePath = openclawPath('workspaces', agentId, filename);
  if (!validatePathWithinDir(filePath, openclawPath('workspaces', agentId))) {
    throw new Error('Path traversal detected');
  }
  if (!existsSync(filePath)) throw new Error('File not found');
  return readText(filePath);
}

export function writeWorkspaceFile(agentId: string, filename: string, content: string): void {
  if (FORBIDDEN_FILES.has(filename)) throw new Error('Access denied');
  if (!ALLOWED_WORKSPACE_FILES.has(filename)) throw new Error(`File not in allowlist: ${filename}`);

  const filePath = openclawPath('workspaces', agentId, filename);
  if (!validatePathWithinDir(filePath, openclawPath('workspaces', agentId))) {
    throw new Error('Path traversal detected');
  }

  // Create backup before overwrite
  if (existsSync(filePath)) {
    const backupDir = openclawPath('workspaces', agentId, '.backups');
    if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    copyFileSync(filePath, path.join(backupDir, `${filename}.${timestamp}.bak`));
  }

  writeFileSync(filePath, content, 'utf-8');
}

export function listMemoryFiles(agentId: string): string[] {
  const memDir = openclawPath('workspaces', agentId, 'memory');
  if (!existsSync(memDir)) return [];
  return readdirSync(memDir).filter(f => f.endsWith('.md')).sort().reverse();
}
