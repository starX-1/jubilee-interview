import React from 'react';
import { ShieldAlert, PlusCircle, UserCheck, RefreshCw } from 'lucide-react';

export default function Header({ onOpenCreateModal, onRefresh, isRefreshing }) {
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

        {/* Right Side Actions & Officer Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/60 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <UserCheck className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-200 font-medium">Claims Officer</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors border border-slate-700/50 flex items-center justify-center"
            title="Refresh Claims List"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-jubilee-red' : ''}`} />
          </button>

          <button
            onClick={onOpenCreateModal}
            className="bg-jubilee-red hover:bg-jubilee-redHover text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition-all flex items-center gap-2 transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Capture New Claim</span>
          </button>
        </div>
      </div>
    </header>
  );
}
