import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Network, MessageSquare, FolderOpen, BookOpen } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Tasks', icon: LayoutDashboard },
  { path: '/org', label: 'Org', icon: Network },
  { path: '/standup', label: 'Standup', icon: MessageSquare },
  { path: '/workspaces', label: 'Agents', icon: FolderOpen },
  { path: '/docs', label: 'Docs', icon: BookOpen },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border bg-card safe-bottom">
      {navItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${
              isActive ? 'text-amber' : 'text-text-secondary'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
