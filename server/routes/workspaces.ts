import { Router } from 'express';
import { listWorkspaceFiles, readWorkspaceFile, writeWorkspaceFile, listMemoryFiles } from '../services/filesystem.js';

export const workspacesRouter = Router();

workspacesRouter.get('/:agentId/files', (req, res) => {
  const files = listWorkspaceFiles(req.params.agentId);
  res.json(files);
});

workspacesRouter.get('/:agentId/files/:filename', (req, res) => {
  try {
    const content = readWorkspaceFile(req.params.agentId, req.params.filename);
    res.json({ content, filename: req.params.filename });
  } catch (err: any) {
    res.status(err.message === 'File not found' ? 404 : 403).json({ message: err.message });
  }
});

workspacesRouter.put('/:agentId/files/:filename', (req, res) => {
  try {
    const { content } = req.body;
    if (typeof content !== 'string') return res.status(400).json({ message: 'Content must be a string' });
    writeWorkspaceFile(req.params.agentId, req.params.filename, content);
    res.json({ success: true });
  } catch (err: any) {
    res.status(403).json({ message: err.message });
  }
});

workspacesRouter.get('/:agentId/memory', (req, res) => {
  const files = listMemoryFiles(req.params.agentId);
  res.json(files);
});
