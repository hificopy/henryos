import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useWorkspaceFiles(agentId: string) {
  return useQuery({
    queryKey: ['workspace-files', agentId],
    queryFn: () => api.getWorkspaceFiles(agentId),
    enabled: !!agentId,
  });
}

export function useWorkspaceFile(agentId: string, filename: string) {
  return useQuery({
    queryKey: ['workspace-file', agentId, filename],
    queryFn: () => api.getWorkspaceFile(agentId, filename),
    enabled: !!agentId && !!filename,
  });
}

export function useSaveWorkspaceFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, filename, content }: { agentId: string; filename: string; content: string }) =>
      api.saveWorkspaceFile(agentId, filename, content),
    onSuccess: (_, { agentId, filename }) => {
      queryClient.invalidateQueries({ queryKey: ['workspace-file', agentId, filename] });
    },
  });
}
