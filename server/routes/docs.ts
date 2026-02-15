import { Router } from 'express';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

export const docsRouter = Router();

const docsDir = path.join(process.cwd(), 'docs');

const TITLES: Record<string, string> = {
  'overview': 'Overview',
  'task-manager': 'Task Manager',
  'org-chart': 'Org Chart',
  'workspaces': 'Workspaces',
  'standups': 'Standups',
  'agent-architecture': 'Agent Architecture',
  'gateway': 'Gateway',
  'memory': 'Memory Architecture',
  'safety': 'Safety Rules',
};

docsRouter.get('/:slug', (req, res) => {
  const { slug } = req.params;
  if (!TITLES[slug]) return res.status(404).json({ message: 'Doc not found' });

  const filePath = path.join(docsDir, `${slug}.md`);
  if (!existsSync(filePath)) return res.status(404).json({ message: 'Doc file not found' });

  const content = readFileSync(filePath, 'utf-8');
  res.json({ content, title: TITLES[slug] });
});
