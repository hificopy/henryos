import { Router } from 'express';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { dataPath } from '../config.js';
import { gatewayClient } from '../services/gateway-client.js';
import { getAgents } from '../services/openclaw-config.js';
import type { Standup, StandupMessage } from '../types/standup.js';

export const standupsRouter = Router();

const standupsDir = dataPath('standups');
if (!existsSync(standupsDir)) mkdirSync(standupsDir, { recursive: true });

function loadStandup(id: string): Standup | null {
  const filePath = path.join(standupsDir, `${id}.json`);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

function saveStandup(standup: Standup): void {
  writeFileSync(path.join(standupsDir, `${standup.id}.json`), JSON.stringify(standup, null, 2));
}

standupsRouter.get('/', (_req, res) => {
  if (!existsSync(standupsDir)) return res.json([]);
  const files = readdirSync(standupsDir).filter(f => f.endsWith('.json'));
  const standups = files.map(f => {
    const data = JSON.parse(readFileSync(path.join(standupsDir, f), 'utf-8'));
    return {
      id: data.id,
      title: data.title,
      topic: data.topic,
      participants: data.participants,
      status: data.status,
      createdAt: data.createdAt,
      completedAt: data.completedAt,
      messageCount: data.messages?.length || 0,
    };
  }).sort((a: any, b: any) => b.createdAt - a.createdAt);
  res.json(standups);
});

standupsRouter.get('/:id', (req, res) => {
  const standup = loadStandup(req.params.id);
  if (!standup) return res.status(404).json({ message: 'Standup not found' });
  res.json(standup);
});

standupsRouter.post('/', async (req, res) => {
  const { title, participants, topic } = req.body;
  if (!title || !participants?.length || !topic) {
    return res.status(400).json({ message: 'Title, participants, and topic are required' });
  }

  const agents = getAgents();
  const validParticipants = participants.filter((p: string) => agents.some(a => a.id === p));

  const standup: Standup = {
    id: `standup-${Date.now()}`,
    title,
    topic,
    participants: validParticipants,
    messages: [],
    status: 'active',
    createdAt: Date.now(),
  };

  saveStandup(standup);

  // Start orchestration in background
  orchestrateStandup(standup).catch(err => {
    console.error('[standup] orchestration error:', err.message);
  });

  res.json(standup);
});

standupsRouter.post('/:id/message', async (req, res) => {
  const standup = loadStandup(req.params.id);
  if (!standup) return res.status(404).json({ message: 'Standup not found' });

  const msg: StandupMessage = {
    id: `msg-${Date.now()}`,
    agentId: 'human',
    agentName: 'Juan',
    content: req.body.message,
    timestamp: Date.now(),
    role: 'human',
  };

  standup.messages.push(msg);
  saveStandup(standup);
  res.json(msg);
});

async function orchestrateStandup(standup: Standup): Promise<void> {
  const agents = getAgents();

  // Step 1: Send topic to Henry first
  if (standup.participants.includes('henry')) {
    try {
      const response = await gatewayClient.sendAgentMessage(
        'henry',
        `[STANDUP] Topic: "${standup.topic}"\n\nYou're leading this standup. Give your opening thoughts and direction. Keep it brief.`
      );
      const msg: StandupMessage = {
        id: `msg-${Date.now()}`,
        agentId: 'henry',
        agentName: 'Henry',
        content: response,
        timestamp: Date.now(),
        role: 'agent',
      };
      standup.messages.push(msg);
      saveStandup(standup);
    } catch (err: any) {
      console.error('[standup] Henry failed:', err.message);
    }
  }

  // Step 2: Fan out to other participants
  for (const participantId of standup.participants) {
    if (participantId === 'henry') continue;
    const agent = agents.find(a => a.id === participantId);
    if (!agent) continue;

    try {
      const context = standup.messages.map(m => `${m.agentName}: ${m.content}`).join('\n\n');
      const response = await gatewayClient.sendAgentMessage(
        participantId,
        `[STANDUP] Topic: "${standup.topic}"\n\nContext so far:\n${context}\n\nGive your input on this topic from your domain perspective. Keep it focused and brief.`
      );
      const msg: StandupMessage = {
        id: `msg-${Date.now()}-${participantId}`,
        agentId: participantId,
        agentName: agent.name,
        content: response,
        timestamp: Date.now(),
        role: 'agent',
      };
      standup.messages.push(msg);
      saveStandup(standup);
    } catch (err: any) {
      console.error(`[standup] ${participantId} failed:`, err.message);
    }
  }

  // Step 3: Henry synthesizes
  if (standup.participants.includes('henry') && standup.messages.length > 1) {
    try {
      const allInput = standup.messages.map(m => `${m.agentName}: ${m.content}`).join('\n\n');
      const response = await gatewayClient.sendAgentMessage(
        'henry',
        `[STANDUP SYNTHESIS] Everyone has spoken. Here's what was said:\n\n${allInput}\n\nSynthesize the key takeaways, decisions, and action items. Be concise.`
      );
      const msg: StandupMessage = {
        id: `msg-${Date.now()}-synthesis`,
        agentId: 'henry',
        agentName: 'Henry',
        content: response,
        timestamp: Date.now(),
        role: 'agent',
      };
      standup.messages.push(msg);
    } catch (err: any) {
      console.error('[standup] Henry synthesis failed:', err.message);
    }
  }

  standup.status = 'completed';
  standup.completedAt = Date.now();
  saveStandup(standup);
}
