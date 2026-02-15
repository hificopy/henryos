import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { OrgNode } from './OrgNode';
import type { OrgNode as OrgNodeType } from '../../lib/types';

interface DepartmentGroupProps {
  node: OrgNodeType;
}

export function DepartmentGroup({ node }: DepartmentGroupProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col items-center">
      {/* Vertical connector from horizontal bar */}
      <div className="h-8 w-px bg-border" />

      {/* Department head */}
      <div className="relative">
        <OrgNode node={node} />
        {node.children && node.children.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-card border border-border p-0.5 text-text-secondary hover:text-text-primary transition-colors"
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        )}
      </div>

      {/* Sub-agents */}
      {expanded && node.children && node.children.length > 0 && (
        <>
          <div className="h-6 w-px bg-border" />
          <div className="relative flex items-start gap-6">
            {node.children.length > 1 && (
              <div className="absolute top-0 left-1/2 h-px -translate-x-1/2" style={{
                width: `calc(100% - 80px)`,
                backgroundColor: '#222222'
              }} />
            )}
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="h-6 w-px bg-border" />
                <OrgNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
