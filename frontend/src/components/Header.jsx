import React from 'react';
import { ShieldAlert, PlusCircle, UserCheck, RefreshCw, LogIn, LogOut, Shield } from 'lucide-react';

export default function Header({
  officer,
  onOpenLoginModal,
  onLogout,
  onOpenCreateModal,
  onRefresh,
  isRefreshing
}) {
  return (
    <header className="bg-jubilee-navy border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Jubilee Logo & Title */}
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
              Claims Officer Portal & Tracking System
            </p>
          </div>
        </div>

        {/* Right Side Actions & Officer Profile */}
        <div className="flex items-center gap-3">
          {officer ? (
            <div className="flex items-center gap-3 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="flex flex-col text-left">
                  <span className="text-white font-bold">{officer.fullName || 'Claims Officer'}</span>
                  <span className="text-[10px] text-slate-300 font-mono">{officer.username}</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white px-2.5 py-1 rounded-md border border-rose-800/80 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ml-1"
                title="Log Out Officer Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700/80 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-jubilee-red" />
              <span>Officer Login</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/50 flex items-center justify-center cursor-pointer"
            title="Refresh Claims List"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-jubilee-red' : ''}`} />
          </button>

          <button
            onClick={onOpenCreateModal}
            className="bg-jubilee-red hover:bg-jubilee-redHover text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition-all flex items-center gap-2 transform active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Capture New Claim</span>
          </button>
        </div>
      </div>
    </header>
  );
}
