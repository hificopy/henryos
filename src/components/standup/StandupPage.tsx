import { useState } from 'react';
import { StandupArchive } from './StandupArchive';
import { StandupThread } from './StandupThread';
import { NewStandupDialog } from './NewStandupDialog';
import { Plus, ChevronLeft } from 'lucide-react';

export function StandupPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const archiveSidebar = (
    <div className="card flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Standups</h3>
        <button onClick={() => setShowNew(true)} className="rounded p-1 text-text-secondary hover:text-amber transition-colors">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <StandupArchive selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: side-by-side */}
      <div className="hidden md:flex h-[calc(100vh-8rem)] gap-4">
        <div className="w-72 shrink-0">{archiveSidebar}</div>
        <div className="flex-1 min-w-0">
          <StandupThread standupId={selectedId} />
        </div>
      </div>

      {/* Mobile: drill-down */}
      <div className="md:hidden h-[calc(100vh-7rem-4rem)]">
        {!selectedId ? (
          archiveSidebar
        ) : (
          <div className="flex h-full flex-col">
            <button
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-1 px-2 py-2 text-xs text-amber"
            >
              <ChevronLeft size={14} /> Standups
            </button>
            <div className="flex-1 min-h-0">
              <StandupThread standupId={selectedId} />
            </div>
          </div>
        )}
      </div>

      {showNew && (
        <NewStandupDialog
          onClose={() => setShowNew(false)}
          onCreated={(id) => { setSelectedId(id); setShowNew(false); }}
        />
      )}
    </>
  );
}
