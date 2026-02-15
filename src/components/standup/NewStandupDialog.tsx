import { useState } from 'react';
import { useAgents } from '../../hooks/useAgents';
import { useCreateStandup } from '../../hooks/useStandups';
import { X } from 'lucide-react';

interface NewStandupDialogProps {
  onClose: () => void;
  onCreated: (id: string) => void;
}

export function NewStandupDialog({ onClose, onCreated }: NewStandupDialogProps) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['henry']);
  const { data: agents } = useAgents();
  const createMutation = useCreateStandup();

  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!title.trim() || !topic.trim() || selectedAgents.length === 0) return;
    try {
      const result = await createMutation.mutateAsync({
        title: title.trim(),
        topic: topic.trim(),
        participants: selectedAgents,
      });
      onCreated(result.id);
    } catch (err) {
      console.error('Failed to create standup:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">New Standup</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Daily standup, Sprint review..."
              className="input"
            />
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Topic</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What should the team discuss?"
              className="input min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Participants</label>
            <div className="flex flex-wrap gap-2">
              {(agents || []).map((agent: any) => (
                <button
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                    selectedAgents.includes(agent.id)
                      ? 'border-amber bg-amber/10 text-amber'
                      : 'border-border text-text-secondary hover:border-text-secondary'
                  }`}
                >
                  {agent.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button
              onClick={handleCreate}
              disabled={!title.trim() || !topic.trim() || selectedAgents.length === 0 || createMutation.isPending}
              className="btn-primary"
            >
              {createMutation.isPending ? 'Creating...' : 'Start Standup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
