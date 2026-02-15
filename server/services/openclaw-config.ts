import { readJSON } from './filesystem.js';
import { openclawPath } from '../config.js';
import type { Agent } from '../types/agent.js';

export function getOpenClawConfig(): any {
  const config = readJSON(openclawPath('openclaw.json'));
  return sanitizeConfig(config);
}

function sanitizeConfig(config: any): any {
  const sanitized = JSON.parse(JSON.stringify(config));

  // Remove gateway auth token
  if (sanitized.gateway?.auth?.token) {
    sanitized.gateway.auth.token = '***';
  }

  // Remove API keys from model providers
  if (sanitized.models?.providers) {
    for (const provider of Object.values(sanitized.models.providers) as any[]) {
      if (provider.apiKey) provider.apiKey = '***';
    }
  }

  // Remove auth profile keys
  if (sanitized.auth?.profiles) {
    for (const profile of Object.values(sanitized.auth.profiles) as any[]) {
      if (profile.key) profile.key = '***';
      if (profile.token) profile.token = '***';
    }
  }

  return sanitized;
}

export function getAgents(): Agent[] {
  const config = readJSON(openclawPath('openclaw.json'));
  return (config.agents?.list || []).map((a: any) => ({
    id: a.id,
    name: a.name,
    model: a.model || config.agents?.defaults?.model || { primary: 'unknown', fallbacks: [] },
    workspace: a.workspace,
    tools: a.tools || { allow: [] },
  }));
}

export function getAgent(id: string): Agent | null {
  const agents = getAgents();
  return agents.find(a => a.id === id) || null;
}

export function getModelMetadata(): any {
  const config = readJSON(openclawPath('openclaw.json'));
  const providers = config.models?.providers || {};
  const models: any[] = [];

  for (const [providerId, provider] of Object.entries(providers) as any) {
    for (const model of provider.models || []) {
      models.push({
        id: `${providerId}/${model.id}`,
        name: model.name,
        provider: providerId,
        contextWindow: model.contextWindow,
        maxTokens: model.maxTokens,
        cost: model.cost,
      });
    }
  }

  return models;
}
