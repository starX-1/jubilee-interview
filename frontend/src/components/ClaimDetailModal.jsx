import React, { useState, useEffect } from 'react';
import { X, FileText, User, Hash, Calendar, DollarSign, Tag, Clock, ShieldCheck, Check, AlertCircle, Key, AlertTriangle, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const STATUS_OPTIONS = [
  { value: 'SUBMITTED', label: 'SUBMITTED', desc: 'Newly captured claim', bg: 'hover:bg-slate-100' },
  { value: 'UNDER_REVIEW', label: 'UNDER REVIEW', desc: 'Assessing documentation', bg: 'hover:bg-amber-50' },
  { value: 'APPROVED', label: 'APPROVED', desc: 'Claim validated for payment', bg: 'hover:bg-emerald-50' },
  { value: 'REJECTED', label: 'REJECTED', desc: 'Claim denied', bg: 'hover:bg-rose-50' },
  { value: 'PAID', label: 'PAID', desc: 'Funds disbursed to customer', bg: 'hover:bg-blue-50' },
];

export default function ClaimDetailModal({
  claim,
  isOpen,
  onClose,
  onUpdateStatus
}) {
  const [currentStatus, setCurrentStatus] = useState('');
  const [pendingStatus, setPendingStatus] = useState(null); // Triggers confirmation modal
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (claim) {
      setCurrentStatus(claim.status);
      setPendingStatus(null);
      setUpdateError(null);
      setUpdateSuccess(false);
    }
  }, [claim]);

  if (!isOpen || !claim) return null;

  // Initial status button click opens confirmation modal
  const handleSelectStatus = (newStatus) => {
    if (newStatus === currentStatus || isUpdating) return;
    setPendingStatus(newStatus);
    setUpdateError(null);
  };

  // Explicit confirmation in confirmation modal
  const handleConfirmStatusUpdate = async () => {
    if (!pendingStatus || isUpdating) return;

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      await onUpdateStatus(claim.id, pendingStatus);
      setCurrentStatus(pendingStatus);
      setUpdateSuccess(true);
      setPendingStatus(null); // Close confirmation modal
      setTimeout(() => setUpdateSuccess(false), 4000);
    } catch (err) {
      setUpdateError(err.message || 'Failed to update claim status.');
      setPendingStatus(null); // Close confirmation modal on error to display error banner
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      {/* Main Claim Detail Modal */}
      <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-jubilee-navy px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-lg text-jubilee-red">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg leading-tight">{claim.claimNumber}</h3>
                  <StatusBadge status={currentStatus} />
                </div>
                <p className="text-xs text-slate-300">Policy: {claim.policyNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Success Banner */}
            {updateSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Claim status successfully updated to <strong>{currentStatus}</strong></span>
              </div>
            )}

            {/* Error Banner */}
            {updateError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{updateError}</span>
              </div>
            )}

            {/* Key Metric Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Claim Amount</span>
                <span className="text-lg font-bold text-slate-900">{formatCurrency(claim.claimAmount)}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Claim Type</span>
                <span className="text-sm font-semibold text-slate-800">{claim.claimType}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Incident Date</span>
                <span className="text-sm font-medium text-slate-700">{formatDate(claim.incidentDate)}</span>
              </div>
            </div>

            {/* Customer & Policy Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                  <User className="w-3.5 h-3.5 text-jubilee-red" />
                  Customer Name
                </div>
                <p className="text-sm font-bold text-slate-900">{claim.customerName}</p>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                  <Hash className="w-3.5 h-3.5 text-jubilee-red" />
                  Policy Reference
                </div>
                <p className="text-sm font-mono font-bold text-slate-900">{claim.policyNumber}</p>
              </div>
            </div>

            {/* Incident Description */}
            <div className="bg-white p-4 rounded-lg border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                <FileText className="w-3.5 h-3.5 text-jubilee-red" />
                Incident Description
              </div>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-md border border-slate-100">
                {claim.description}
              </p>
            </div>

            {/* Database System Metadata (UUID ID) */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-mono">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Database UUID:</span>
                <span className="text-slate-700 font-semibold">{claim.id}</span>
              </div>
              {claim.createdAt && (
                <div className="text-[11px] text-slate-400">
                  Created: {new Date(claim.createdAt).toLocaleString('en-GB')}
                </div>
              )}
            </div>

            {/* STATUS UPDATE CONTROL SECTION */}
            <div className="border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-jubilee-red" />
                  Update Claim Status
                </h4>
                <span className="text-xs text-slate-400 font-medium">Claims Officer Decision</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {STATUS_OPTIONS.map((opt) => {
                  const isCurrent = currentStatus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectStatus(opt.value)}
                      disabled={isUpdating}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isCurrent
                          ? 'border-jubilee-red bg-rose-50/70 ring-2 ring-jubilee-red/20 shadow-xs'
                          : `border-slate-200 bg-white ${opt.bg} hover:border-slate-300 hover:shadow-2xs`
                      }`}
                    >
                      <span className={`text-[11px] font-bold ${isCurrent ? 'text-jubilee-red' : 'text-slate-700'}`}>
                        {opt.label}
                      </span>
                      {isCurrent && (
                        <span className="bg-jubilee-red text-white p-0.5 rounded-full text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Jubilee Insurance Kenya</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL OVERLAY */}
      {pendingStatus && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 transform transition-all animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confirmation Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Confirm Status Change</h4>
                <p className="text-xs text-slate-500">Requires officer confirmation</p>
              </div>
            </div>

            {/* Claim details summary */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 mb-4 space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Claim Number:</span>
                <span className="font-bold text-jubilee-navy">{claim.claimNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Customer:</span>
                <span className="font-semibold text-slate-900">{claim.customerName}</span>
              </div>
              
              {/* Status Transition Visual */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Current Status</span>
                  <StatusBadge status={currentStatus} />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-3" />
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[10px] text-amber-600 font-semibold uppercase">New Status</span>
                  <StatusBadge status={pendingStatus} />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to change the status of this claim to <strong className="text-slate-900">{pendingStatus}</strong>? This action will update the status in the system.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPendingStatus(null)}
                disabled={isUpdating}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmStatusUpdate}
                disabled={isUpdating}
                className="px-4 py-2 text-xs font-bold text-white bg-jubilee-red hover:bg-jubilee-redHover disabled:opacity-50 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating Status...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm Status Update</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
