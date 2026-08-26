import React from 'react';
import { Search, Eye, Filter, Car, HeartPulse, Plane, Home, Shield, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const CLAIM_TYPES = ['All Types', 'Motor', 'Health', 'Travel', 'Property', 'Other'];
const STATUSES = ['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID'];
const LIMIT_OPTIONS = [5, 10, 25, 50];

export default function ClaimsList({
  claims,
  isLoading,
  error,
  pagination,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedType,
  setSelectedType,
  onPageChange,
  onLimitChange,
  onSelectClaim,
  onOpenCreateModal
}) {
  const { page = 1, limit = 5, total = 0, totalPages = 1 } = pagination || {};

  // Helper for claim type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Motor':
        return <Car className="w-4 h-4 text-blue-600" />;
      case 'Health':
        return <HeartPulse className="w-4 h-4 text-emerald-600" />;
      case 'Travel':
        return <Plane className="w-4 h-4 text-amber-600" />;
      case 'Property':
        return <Home className="w-4 h-4 text-purple-600" />;
      default:
        return <Shield className="w-4 h-4 text-slate-600" />;
    }
  };

  // Format KES currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format date string safely
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const startRecord = total > 0 ? (page - 1) * limit + 1 : 0;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search claim #, policy #, or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-jubilee-red focus:ring-1 focus:ring-jubilee-red transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Claim Type Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-500">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none text-slate-800 cursor-pointer"
            >
              {CLAIM_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Items Per Page Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700">
            <span className="font-medium text-slate-500">Show:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-transparent font-semibold focus:outline-none text-slate-800 cursor-pointer"
            >
              {LIMIT_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt} per page</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Status Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-slate-100 bg-slate-50/30 px-4 pt-2 no-scrollbar">
        {STATUSES.map(status => {
          const isActive = selectedStatus === status;

          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'border-jubilee-red text-jubilee-red font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{status.replace('_', ' ')}</span>
            </button>
          );
        })}
      </div>

      {/* Claims Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-200/80">
              <th className="py-3 px-4 sm:px-6">Claim Number</th>
              <th className="py-3 px-4">Policy Number</th>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Amount (KES)</th>
              <th className="py-3 px-4">Incident Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 sm:px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: limit }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4 sm:px-6"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                  <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-200 rounded w-24 ml-auto"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                  <td className="py-4 px-4"><div className="h-5 bg-slate-200 rounded-full w-24"></div></td>
                  <td className="py-4 px-4 text-center"><div className="h-7 bg-slate-200 rounded w-16 mx-auto"></div></td>
                </tr>
              ))
            ) : error ? (
              // Error State
              <tr>
                <td colSpan="8" className="py-12 px-4 text-center">
                  <div className="max-w-md mx-auto flex flex-col items-center">
                    <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
                    <h4 className="text-base font-bold text-slate-800">Failed to load claims</h4>
                    <p className="text-sm text-slate-500 mt-1 mb-4">{error}</p>
                  </div>
                </td>
              </tr>
            ) : claims.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan="8" className="py-12 px-4 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-800">No claims found</h4>
                    <p className="text-sm text-slate-500 mt-1 mb-4">
                      {searchQuery || selectedStatus !== 'ALL' || selectedType !== 'All Types'
                        ? 'Try adjusting your search filters or status selection.'
                        : 'No claims have been submitted yet.'}
                    </p>
                    <button
                      onClick={onOpenCreateModal}
                      className="text-xs bg-jubilee-red hover:bg-jubilee-redHover text-white px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      + Create First Claim
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              // Claims Table Content
              claims.map((claim) => (
                <tr
                  key={claim.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectClaim(claim)}
                >
                  {/* Claim Number */}
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-jubilee-navy group-hover:text-jubilee-red transition-colors whitespace-nowrap">
                    {claim.claimNumber}
                  </td>

                  {/* Policy Number */}
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                    {claim.policyNumber}
                  </td>

                  {/* Customer Name */}
                  <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                    {claim.customerName}
                  </td>

                  {/* Claim Type Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {getTypeIcon(claim.claimType)}
                      <span>{claim.claimType}</span>
                    </span>
                  </td>

                  {/* Claim Amount */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-right whitespace-nowrap">
                    {formatCurrency(claim.claimAmount)}
                  </td>

                  {/* Incident Date */}
                  <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                    {formatDate(claim.incidentDate)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={claim.status} />
                  </td>

                  {/* View Details Button */}
                  <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectClaim(claim)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-jubilee-navy hover:text-jubilee-red bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS FOOTER */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          Showing <strong className="text-slate-900">{startRecord}</strong> to <strong className="text-slate-900">{endRecord}</strong> of <strong className="text-slate-900">{total}</strong> total claims
        </div>

        {/* Page navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition-all flex items-center gap-1 font-semibold cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-jubilee-navy">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition-all flex items-center gap-1 font-semibold cursor-pointer disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
