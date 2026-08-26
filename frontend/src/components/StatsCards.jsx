import React from 'react';
import { FileText, Clock, CheckCircle2, DollarSign } from 'lucide-react';

export default function StatsCards({ claims }) {
  const totalClaims = claims.length;
  
  const pendingCount = claims.filter(
    c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW'
  ).length;

  const totalAmount = claims.reduce((sum, c) => sum + (Number(c.claimAmount) || 0), 0);

  const approvedPaidAmount = claims
    .filter(c => c.status === 'APPROVED' || c.status === 'PAID')
    .reduce((sum, c) => sum + (Number(c.claimAmount) || 0), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Claims Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Claims</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalClaims}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Recorded in system</p>
        </div>
        <div className="bg-slate-100 p-3 rounded-lg text-slate-700">
          <FileText className="w-6 h-6" />
        </div>
      </div>

      {/* Pending Review Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Pending Officer Action</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Submitted / Under Review</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      {/* Total Claimed Value */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Value</p>
          <h3 className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(totalAmount)}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Aggregate claim amount</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>

      {/* Approved/Paid Value */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between border-l-4 border-l-emerald-500">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Approved & Paid</p>
          <h3 className="text-lg font-bold text-emerald-700 mt-1">{formatCurrency(approvedPaidAmount)}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Settled or approved</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
