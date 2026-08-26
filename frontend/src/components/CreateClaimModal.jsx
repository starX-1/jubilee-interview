import React, { useState } from 'react';
import { X, ShieldPlus, AlertCircle, CheckCircle2, DollarSign, Calendar, FileText, User, Hash, Tag } from 'lucide-react';

export default function CreateClaimModal({ isOpen, onClose, onCreateClaim }) {
  const [formData, setFormData] = useState({
    claimNumber: '',
    policyNumber: '',
    customerName: '',
    claimType: 'Motor',
    claimAmount: '',
    incidentDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    setSubmitError(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.policyNumber.trim()) {
      newErrors.policyNumber = 'Policy number is required';
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.claimType) {
      newErrors.claimType = 'Claim type is required';
    }

    const amountNum = parseFloat(formData.claimAmount);
    if (isNaN(amountNum)) {
      newErrors.claimAmount = 'Claim amount is required and must be a number';
    } else if (amountNum <= 0) {
      newErrors.claimAmount = 'Claim amount must be a positive number (> 0)';
    }

    if (!formData.incidentDate) {
      newErrors.incidentDate = 'Incident date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Incident description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onCreateClaim({
        ...formData,
        claimAmount: parseFloat(formData.claimAmount)
      });
      // Modal closed on success in parent
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit claim. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-jubilee-navy px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-jubilee-red p-2 rounded-lg text-white">
              <ShieldPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Capture New Claim</h3>
              <p className="text-xs text-slate-300">Initial claim status will automatically be set to SUBMITTED</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert inside Modal */}
        {submitError && (
          <div className="m-6 mb-0 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block">Submission Error</strong>
              <span>{submitError}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Policy Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Policy Number <span className="text-jubilee-red">*</span>
              </label>
              <input
                type="text"
                name="policyNumber"
                placeholder="e.g. POL-2026-001"
                value={formData.policyNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${
                  errors.policyNumber
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-jubilee-red focus:ring-1 focus:ring-jubilee-red'
                }`}
              />
              {errors.policyNumber && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.policyNumber}</p>
              )}
            </div>

            {/* Claim Number (Optional/Auto) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Claim Number <span className="text-slate-400 font-normal">(Optional - Auto-generated)</span>
              </label>
              <input
                type="text"
                name="claimNumber"
                placeholder="Auto-generated if empty (CLM-xxxx)"
                value={formData.claimNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-jubilee-red focus:ring-1 focus:ring-jubilee-red transition-all"
              />
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Customer Name <span className="text-jubilee-red">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              placeholder="e.g. Jane Doe"
              value={formData.customerName}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${
                errors.customerName
                  ? 'border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:border-jubilee-red focus:ring-1 focus:ring-jubilee-red'
              }`}
            />
            {errors.customerName && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.customerName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Claim Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Claim Type <span className="text-jubilee-red">*</span>
              </label>
              <select
                name="claimType"
                value={formData.claimType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-jubilee-red focus:ring-1 focus:ring-jubilee-red transition-all"
              >
                <option value="Motor">Motor</option>
                <option value="Health">Health</option>
                <option value="Travel">Travel</option>
                <option value="Property">Property</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Claim Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Claim Amount (KES) <span className="text-jubilee-red">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="claimAmount"
                placeholder="e.g. 12500"
                value={formData.claimAmount}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm font-medium focus:outline-none transition-all ${
                  errors.claimAmount
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-jubilee-red focus:ring-1 focus:ring-jubilee-red'
                }`}
              />
              {errors.claimAmount && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.claimAmount}</p>
              )}
            </div>

            {/* Incident Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Incident Date <span className="text-jubilee-red">*</span>
              </label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${
                  errors.incidentDate
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-jubilee-red focus:ring-1 focus:ring-jubilee-red'
                }`}
              />
              {errors.incidentDate && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.incidentDate}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Incident Description <span className="text-jubilee-red">*</span>
            </label>
            <textarea
              name="description"
              rows="3"
              placeholder="Detailed description of the claim event..."
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${
                errors.description
                  ? 'border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:border-jubilee-red focus:ring-1 focus:ring-jubilee-red'
              }`}
            ></textarea>
            {errors.description && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-jubilee-red hover:bg-jubilee-redHover disabled:opacity-50 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Claim</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
