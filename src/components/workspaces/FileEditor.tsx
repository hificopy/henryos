import { useState, useEffect } from 'react';
import { useWorkspaceFile, useSaveWorkspaceFile } from '../../hooks/useWorkspaceFile';
import { MarkdownPreview } from './MarkdownPreview';
import { FileText, Save, Eye, Edit3 } from 'lucide-react';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface FileEditorProps {
  agentId: string | null;
  filename: string | null;
}

export function FileEditor({ agentId, filename }: FileEditorProps) {
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [editContent, setEditContent] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const { data, isLoading } = useWorkspaceFile(agentId || '', filename || '');
  const saveMutation = useSaveWorkspaceFile();

  useEffect(() => {
    if (data?.content) {
      setEditContent(data.content);
      setMode('preview');
    }
  }, [data]);

  const handleSave = async () => {
    if (!agentId || !filename) return;
    try {
      await saveMutation.mutateAsync({ agentId, filename, content: editContent });
      setSaveMessage('Saved');
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (err: any) {
      setSaveMessage(`Error: ${err.message}`);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  if (!agentId || !filename) {
    return (
      <div className="card flex h-full items-center justify-center">
        <div className="text-center text-text-secondary">
          <FileText size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select an agent and file to view</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="card flex h-full items-center justify-center"><LoadingSpinner /></div>;
  }

  return (
    <div className="card flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-text-secondary" />
          <span className="text-sm font-medium">{filename}</span>
          <span className="text-xs text-text-secondary">({agentId})</span>
        </div>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className={`text-xs ${saveMessage.startsWith('Error') ? 'text-status-red' : 'text-status-green'}`}>
              {saveMessage}
            </span>
          )}
          <button
            onClick={() => setMode(mode === 'preview' ? 'edit' : 'preview')}
            className="btn-secondary py-1.5 px-3 text-xs"
          >
            {mode === 'preview' ? <><Edit3 size={12} /> Edit</> : <><Eye size={12} /> Preview</>}
          </button>
          {mode === 'edit' && (
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="btn-primary py-1.5 px-3 text-xs"
            >
              <Save size={12} />
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {mode === 'preview' ? (
          <MarkdownPreview content={data?.content || ''} />
        ) : (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="h-full w-full resize-none bg-transparent font-mono text-sm text-text-primary outline-none"
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
