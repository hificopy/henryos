import { useState, Component, ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { MissionControlPage } from './components/mission-control/MissionControlPage';
import { PlanManagerPage } from './components/plans/PlanManagerPage';
import { TaskManagerPage } from './components/task-manager/TaskManagerPage';
import { OrgChartPage } from './components/org-chart/OrgChartPage';
import { StandupPage } from './components/standup/StandupPage';
import { WorkspacesPage } from './components/workspaces/WorkspacesPage';
import { DocsPage } from './components/docs/DocsPage';
import { SessionBrowserPage } from './components/sessions/SessionBrowserPage';
import { LoginPage } from './components/auth/LoginPage';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-page p-8 text-center">
          <div>
            <h1 className="text-xl font-bold text-status-red mb-2">Something crashed</h1>
            <pre className="text-xs text-text-secondary whitespace-pre-wrap max-w-md">{this.state.error.message}</pre>
            <button onClick={() => { this.setState({ error: null }); window.location.reload(); }} className="mt-4 btn-primary">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('henry-auth') === 'true');

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />;
  }

  return (
    <ErrorBoundary>
      <AppShell>
        <Routes>
          <Route path="/" element={<MissionControlPage />} />
          <Route path="/plans" element={<PlanManagerPage />} />
          <Route path="/tasks" element={<TaskManagerPage />} />
          <Route path="/sessions" element={<SessionBrowserPage />} />
          <Route path="/org" element={<OrgChartPage />} />
          <Route path="/standup" element={<StandupPage />} />
          <Route path="/workspaces" element={<WorkspacesPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/docs/:slug" element={<DocsPage />} />
        </Routes>
      </AppShell>
    </ErrorBoundary>
  );
}
