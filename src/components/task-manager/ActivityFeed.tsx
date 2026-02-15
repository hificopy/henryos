import { useState } from 'react';
import { useSessions } from '../../hooks/useSessions';
import { ActivityFeedItem } from './ActivityFeedItem';
import { ActivityFeedFilters } from './ActivityFeedFilters';
import { Activity } from 'lucide-react';

export function ActivityFeed() {
  const [category, setCategory] = useState('');
  const [agent, setAgent] = useState('');

  const filters = {
    ...(category ? { category } : {}),
    ...(agent ? { agent } : {}),
  };

  const { data: sessions, isLoading, error } = useSessions(
    category || agent ? filters : undefined
  );

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Activity Feed</h3>
        <ActivityFeedFilters
          category={category}
          agent={agent}
          onCategoryChange={setCategory}
          onAgentChange={setAgent}
        />
      </div>
      {isLoading ? (
        <div className="py-8 text-center text-text-secondary text-sm">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-status-red text-sm">Failed to load sessions</div>
      ) : sessions && sessions.length > 0 ? (
        <div className="space-y-2">
          {sessions.map((session: any) => (
            <ActivityFeedItem key={session.key} session={session} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-8 text-text-secondary">
          <Activity size={24} className="mb-2 opacity-50" />
          <p className="text-sm">No sessions found</p>
        </div>
      )}
    </div>
  );
}
