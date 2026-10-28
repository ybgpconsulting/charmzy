import React, { useEffect, useState } from 'react';
import { KeyRound, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminPanelModal } from './AdminPanelModal';

interface AdminSession {
  authenticated: boolean;
  mustChangePassword: boolean;
  email: string | null;
}

const requestAdmin = async (path: string, method = 'GET', body?: Record<string, string>) => {
  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const result = await response.json() as AdminSession & { error?: string };
  if (!response.ok) throw new Error(result.error || 'The admin request failed. Please try again.');
  return result;
};

export const AdminRoute: React.FC = () => {
  const { isAdminOpen, setIsAdminOpen } = useStore();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('shubhanshu@charmzy.in');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Admin Sign In | CHARMZY JEWELLERY';
    let active = true;
    requestAdmin('/api/admin/session')
      .then(result => {
        if (!active) return;
        setSession(result);
        setIsAdminOpen(result.authenticated && !result.mustChangePassword);
      })
      .catch(() => {
        if (active) setError('Admin sign-in is unavailable. Check that the Worker and its D1 migration are configured.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [setIsAdminOpen]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await requestAdmin('/api/admin/login', 'POST', { email, password });
      setSession(result);
      setPassword('');
      setIsAdminOpen(!result.mustChangePassword);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('The new passwords do not match.');
      return;
    }
    if (newPassword.length < 12) {
      setError('Use at least 12 characters for your new password.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await requestAdmin('/api/admin/password', 'POST', { password: newPassword });
      setSession(result);
      setNewPassword('');
      setConfirmPassword('');
      setIsAdminOpen(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Password update failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setError('');
    try {
      await requestAdmin('/api/admin/logout', 'POST', {});
      setSession({ authenticated: false, mustChangePassword: false, email: null });
      setIsAdminOpen(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Sign-out failed.');
    }
  };

  const isAuthenticated = Boolean(session?.authenticated);

  return (
    <div className="min-h-screen bg-[#fff5f7] px-4 py-10 text-zinc-800">
      {isAuthenticated && !session?.mustChangePassword && isAdminOpen && <AdminPanelModal />}
      <main className="mx-auto flex min-h-[75vh] max-w-lg flex-col justify-center">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200">
            <ShieldCheck className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-pink-700">Charmzy Store Management</p>
        </div>

        {loading ? (
          <section aria-live="polite" className="rounded-3xl border border-pink-200 bg-white p-7 text-center shadow-xl shadow-pink-100/60">
            <p className="text-sm font-semibold text-zinc-600">Checking secure admin session…</p>
          </section>
        ) : isAuthenticated && session?.mustChangePassword ? (
          <section className="rounded-3xl border border-pink-200 bg-white p-6 shadow-xl shadow-pink-100/60 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h1 className="font-outfit text-xl font-black text-zinc-900">Set a new password</h1>
                <p className="text-xs text-zinc-500">A password change is required before admin access.</p>
              </div>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <label className="block text-sm font-semibold text-zinc-700">
                New password
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={256}
                  required
                  value={newPassword}
                  onChange={event => setNewPassword(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-pink-200 px-3 py-3 text-sm text-zinc-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </label>
              <label className="block text-sm font-semibold text-zinc-700">
                Confirm new password
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={256}
                  required
                  value={confirmPassword}
                  onChange={event => setConfirmPassword(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-pink-200 px-3 py-3 text-sm text-zinc-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </label>
              {error && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
              <button disabled={submitting} className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-60">
                {submitting ? 'Updating password…' : 'Save new password'}
              </button>
            </form>
          </section>
        ) : isAuthenticated ? (
          <section className="rounded-3xl border border-pink-200 bg-white p-6 shadow-xl shadow-pink-100/60 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-outfit text-2xl font-black text-zinc-900">Admin access ready</h1>
                <p className="mt-1 text-sm text-zinc-600">Signed in as {session?.email}</p>
              </div>
              <Sparkles className="h-6 w-6 text-pink-600" aria-hidden="true" />
            </div>
            {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setIsAdminOpen(true)} className="flex-1 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105">
                Open admin panel
              </button>
              <button onClick={handleLogout} className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-pink-50">
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-pink-200 bg-white p-6 shadow-xl shadow-pink-100/60 sm:p-8">
            <div className="mb-6">
              <h1 className="font-outfit text-2xl font-black text-zinc-900">Admin sign in</h1>
              <p className="mt-1 text-sm text-zinc-600">Authorized Charmzy store administrators only.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-sm font-semibold text-zinc-700">
                Email
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-pink-200 px-3 py-3 text-sm text-zinc-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </label>
              <label className="block text-sm font-semibold text-zinc-700">
                Temporary password
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-pink-200 px-3 py-3 text-sm text-zinc-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </label>
              {error && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
              <button disabled={submitting} className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-60">
                {submitting ? 'Signing in…' : 'Sign in securely'}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};
