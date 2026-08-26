import React, { useState } from 'react';
import { ShieldCheck, User, Lock, AlertCircle, LogIn, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onLogin(username.trim(), password.trim());
      // Reset form
      setUsername('');
      setPassword('');
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-jubilee-navy p-6 text-white text-center relative border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-jubilee-red mx-auto flex items-center justify-center text-white shadow-lg mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold">Claims Officer Authentication</h3>
          <p className="text-xs text-slate-300 mt-1">Jubilee Insurance Internal Claims Operations</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="m-6 mb-0 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2 font-medium">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
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

          {/* Preset credentials helper hint */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-jubilee-red shrink-0" />
            <div>
              <span className="font-bold text-slate-800 block">Seeded Officer Credentials:</span>
              <span>Username: <code className="bg-slate-200/70 px-1 rounded text-slate-900 font-mono">officer@jubilee.com</code> | Password: <code className="bg-slate-200/70 px-1 rounded text-slate-900 font-mono">Jubilee2026!</code></span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-jubilee-red hover:bg-jubilee-redHover disabled:opacity-50 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In as Officer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
