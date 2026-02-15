import { useState } from 'react';
import { useStandup } from '../../hooks/useStandups';
import { StandupMessage } from './StandupMessage';
import { api } from '../../lib/api';
import { MessageSquare, Send } from 'lucide-react';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface StandupThreadProps {
  standupId: string | null;
}

export function StandupThread({ standupId }: StandupThreadProps) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const { data: standup, isLoading, refetch } = useStandup(standupId || '');

  if (!standupId) {
    return (
      <div className="card flex h-full items-center justify-center">
        <div className="text-center text-text-secondary">
          <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a standup to view</p>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="card flex h-full items-center justify-center"><LoadingSpinner /></div>;

  const handleSend = async () => {
    if (!input.trim() || !standupId) return;
    setSending(true);
    try {
      await api.sendStandupMessage(standupId, input.trim());
      setInput('');
      refetch();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">{standup?.title}</h3>
        <p className="text-xs text-text-secondary mt-0.5">{standup?.topic}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {(standup?.messages || []).map((msg: any) => (
          <StandupMessage key={msg.id} message={msg} />
        ))}
        {standup?.status === 'active' && standup?.messages?.length === 0 && (
          <div className="text-center text-text-secondary text-sm py-8">
            Waiting for agents to respond...
          </div>
        )}
      </div>

      {/* Input */}
      {standup?.status === 'active' && (
        <div className="border-t border-border p-3">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Inject a message..."
              className="input flex-1"
              disabled={sending}
            />
            <button onClick={handleSend} disabled={sending || !input.trim()} className="btn-primary px-3">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
