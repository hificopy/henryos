import { useState } from 'react';
import { AgentList } from './AgentList';
import { FileList } from './FileList';
import { FileEditor } from './FileEditor';
import { ChevronLeft } from 'lucide-react';

export function WorkspacesPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Mobile: show agent list -> file list -> editor (drill-down)
  const mobileView = !selectedAgent ? 'agents' : !selectedFile ? 'files' : 'editor';

  return (
    <>
      {/* Desktop: side-by-side */}
      <div className="hidden md:flex h-[calc(100vh-8rem)] gap-4">
        <div className="w-56 shrink-0">
          <AgentList
            selectedId={selectedAgent}
            onSelect={(id) => { setSelectedAgent(id); setSelectedFile(null); }}
          />
        </div>
        <div className="w-48 shrink-0">
          <FileList agentId={selectedAgent} selectedFile={selectedFile} onSelect={setSelectedFile} />
        </div>
        <div className="flex-1 min-w-0">
          <FileEditor agentId={selectedAgent} filename={selectedFile} />
        </div>
      </div>

      {/* Mobile: drill-down navigation */}
      <div className="md:hidden h-[calc(100vh-7rem-4rem)]">
        {mobileView === 'agents' && (
          <AgentList
            selectedId={selectedAgent}
            onSelect={(id) => { setSelectedAgent(id); setSelectedFile(null); }}
          />
        )}
        {mobileView === 'files' && (
          <div className="flex h-full flex-col">
            <button
              onClick={() => setSelectedAgent(null)}
              className="flex items-center gap-1 px-2 py-2 text-xs text-amber"
            >
              <ChevronLeft size={14} /> Agents
            </button>
            <div className="flex-1 min-h-0">
              <FileList agentId={selectedAgent} selectedFile={selectedFile} onSelect={setSelectedFile} />
            </div>
          </div>
        )}
        {mobileView === 'editor' && (
          <div className="flex h-full flex-col">
            <button
              onClick={() => setSelectedFile(null)}
              className="flex items-center gap-1 px-2 py-2 text-xs text-amber"
            >
              <ChevronLeft size={14} /> Files
            </button>
            <div className="flex-1 min-h-0">
              <FileEditor agentId={selectedAgent} filename={selectedFile} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
