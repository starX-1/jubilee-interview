import React, { useState } from 'react';
import { ShieldAlert, User, Lock, AlertCircle, LogIn, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both officer username and password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onLogin(username.trim(), password.trim());
    } catch (err) {
      setError(err.message || 'Login failed. Invalid officer credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-jubilee-lightBg flex flex-col justify-between font-sans text-slate-800">
      {/* Brand Header */}
      <header className="bg-jubilee-navy border-b border-slate-800 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="bg-jubilee-red text-white p-2.5 rounded-lg font-bold shadow-lg flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">JUBILEE</span>
                <span className="bg-jubilee-red px-2 py-0.5 text-xs font-bold uppercase rounded text-white tracking-widest">
                  INSURANCE
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Claims Officer Authentication Gateway
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Restricted Internal Portal</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200/80 overflow-hidden">
          {/* Top Banner */}
          <div className="bg-jubilee-navy p-6 text-white text-center border-b border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-jubilee-red mx-auto flex items-center justify-center text-white shadow-xl mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold">Claims Officer Login</h2>
            <p className="text-xs text-slate-300 mt-1">Please authenticate to access claims management</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="m-6 mb-0 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Officer Username / Email
              </label>
              <input
                type="text"
                name="officer_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. officer@jubilee.com"
                autoComplete="off"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-jubilee-red focus:ring-1 focus:ring-jubilee-red transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="officer_password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-jubilee-red focus:ring-1 focus:ring-jubilee-red transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Seeded Credentials Hint */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2.5">
              <KeyRound className="w-4 h-4 text-jubilee-red shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">Default Seeded Officer Credentials:</span>
                <span>Username: <code className="bg-slate-200/70 px-1 rounded text-slate-900 font-mono font-semibold">officer@jubilee.com</code> | Password: <code className="bg-slate-200/70 px-1 rounded text-slate-900 font-mono font-semibold">Jubilee2026!</code></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-sm font-bold text-white bg-jubilee-red hover:bg-jubilee-redHover disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating Officer...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Claims Portal</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-400">
        <p>© 2026 Jubilee Insurance Kenya • Claims Operations Authentication Gateway</p>
      </footer>
    </div>
  );
}
