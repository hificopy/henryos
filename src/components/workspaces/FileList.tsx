import { useWorkspaceFiles } from '../../hooks/useWorkspaceFile';
import { cn } from '../../lib/utils';
import { FileText, FolderOpen } from 'lucide-react';

interface FileListProps {
  agentId: string | null;
  selectedFile: string | null;
  onSelect: (filename: string) => void;
}

export function FileList({ agentId, selectedFile, onSelect }: FileListProps) {
  const { data: files } = useWorkspaceFiles(agentId || '');

  return (
    <div className="card flex h-full flex-col">
      <div className="border-b border-border px-3 py-2.5">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Files</h3>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {!agentId ? (
          <div className="flex flex-col items-center py-8 text-text-secondary">
            <FolderOpen size={20} className="mb-2 opacity-50" />
            <p className="text-xs">Select an agent</p>
          </div>
        ) : (
          <div className="space-y-1">
            {(files || []).map((file: string) => (
              <button
                key={file}
                onClick={() => onSelect(file)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                  selectedFile === file
                    ? 'bg-card-hover text-amber'
                    : 'text-text-secondary hover:bg-card-hover hover:text-text-primary'
                )}
              >
                <FileText size={14} />
                {file}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
