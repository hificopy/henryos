import { OrgStatsBar } from './OrgStatsBar';
import { OrgTree } from './OrgTree';

export function OrgChartPage() {
  return (
    <div className="space-y-6">
      <OrgStatsBar />
      <div className="card overflow-x-auto p-6">
        <OrgTree />
      </div>
    </div>
  );
}
