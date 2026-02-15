const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // System
  getHealth: () => fetchJSON<{ status: string; gateway: boolean; uptime: number }>('/system/health'),
  getStats: () => fetchJSON<{ agents: number; sessions: number; cronJobs: number }>('/system/stats'),

  // Agents
  getAgents: () => fetchJSON<any[]>('/agents'),
  getAgent: (id: string) => fetchJSON<any>(`/agents/${id}`),

  // Workspaces
  getWorkspaceFiles: (agentId: string) => fetchJSON<string[]>(`/workspaces/${agentId}/files`),
  getWorkspaceFile: (agentId: string, filename: string) =>
    fetchJSON<{ content: string; filename: string }>(`/workspaces/${agentId}/files/${filename}`),
  saveWorkspaceFile: (agentId: string, filename: string, content: string) =>
    fetchJSON<{ success: boolean }>(`/workspaces/${agentId}/files/${filename}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),

  // Config
  getConfig: () => fetchJSON<any>('/config'),
  getModels: () => fetchJSON<any>('/config/models'),

  // Cron
  getCronJobs: () => fetchJSON<any[]>('/cron/jobs'),
  getCronRuns: (jobId: string) => fetchJSON<any[]>(`/cron/runs/${jobId}`),

  // Gateway
  getGatewayStatus: () => fetchJSON<{ connected: boolean }>('/gateway/status'),
  sendAgentMessage: (agentId: string, message: string) =>
    fetchJSON<{ response: string }>(`/gateway/agent/${agentId}/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  // Standups
  getStandups: () => fetchJSON<any[]>('/standups'),
  getStandup: (id: string) => fetchJSON<any>(`/standups/${id}`),
  createStandup: (data: { title: string; participants: string[]; topic: string }) =>
    fetchJSON<any>('/standups', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  sendStandupMessage: (id: string, message: string) =>
    fetchJSON<any>(`/standups/${id}/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  // Sessions
  getSessions: (params?: { category?: string; agent?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.agent) query.set('agent', params.agent);
    const qs = query.toString();
    return fetchJSON<any[]>(`/sessions${qs ? `?${qs}` : ''}`);
  },

  // Docs
  getDoc: (slug: string) => fetchJSON<{ content: string; title: string }>(`/docs/${slug}`),
};
