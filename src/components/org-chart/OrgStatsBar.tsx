import { useAgents } from '../../hooks/useAgents';
import { ORG_HIERARCHY } from '../../lib/constants';

function countNodes(node: any): number {
  let count = 1;
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}

export function OrgStatsBar() {
  const { data: agents } = useAgents();
  const totalInOrg = countNodes(ORG_HIERARCHY);
  const chiefs = ORG_HIERARCHY.children?.length || 0;
  const registered = agents?.length || 0;

  const stats = [
    { label: 'Chiefs', value: chiefs },
    { label: 'Total in Org', value: totalInOrg },
    { label: 'Registered', value: registered },
    { label: 'Pending Setup', value: Math.max(0, totalInOrg - registered) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value }) => (
        <div key={label} className="card p-4">
          <p className="text-xs text-text-secondary">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}
