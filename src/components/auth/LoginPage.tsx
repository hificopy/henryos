import { useState } from 'react';

const PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const hash = await sha256(password);
    if (username === 'admin' && hash === PASSWORD_HASH) {
      sessionStorage.setItem('henry-auth', 'true');
      onSuccess();
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setError('Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-amber">Henry OS</h1>
          <p className="mt-1 text-sm text-text-secondary">Agent Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <div>
            <label htmlFor="username" className="mb-1 block text-xs font-medium text-text-secondary">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-text-secondary">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-status-red">{error}</p>
          )}

          {attempts >= 2 && (
            <p className="text-xs text-text-secondary">Hint: ad</p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
