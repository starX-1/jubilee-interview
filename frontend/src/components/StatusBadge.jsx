import React from 'react';

const STATUS_CONFIG = {
  SUBMITTED: {
    label: 'SUBMITTED',
    bg: 'bg-slate-100 text-slate-800 border-slate-300',
    dot: 'bg-slate-500'
  },
  UNDER_REVIEW: {
    label: 'UNDER REVIEW',
    bg: 'bg-amber-50 text-amber-800 border-amber-300',
    dot: 'bg-amber-500 animate-pulse'
  },
  APPROVED: {
    label: 'APPROVED',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    dot: 'bg-emerald-500'
  },
  REJECTED: {
    label: 'REJECTED',
    bg: 'bg-rose-50 text-rose-800 border-rose-300',
    dot: 'bg-rose-500'
  },
  PAID: {
    label: 'PAID',
    bg: 'bg-blue-50 text-blue-800 border-blue-300',
    dot: 'bg-blue-600'
  }
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.SUBMITTED;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} shadow-2xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
}
