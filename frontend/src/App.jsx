import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ClaimsList from './components/ClaimsList';
import CreateClaimModal from './components/CreateClaimModal';
import ClaimDetailModal from './components/ClaimDetailModal';
import Toast from './components/Toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  /**
   * Fetch all claims from API
   */
  const fetchClaims = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/claims`);
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to fetch claims list');
      }

      setClaims(json.data || []);
    } catch (err) {
      console.error('Error fetching claims:', err);
      setError(err.message || 'Unable to connect to Jubilee Claims API service');
      showToast(err.message || 'Failed to load claims', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  /**
   * Handle Create Claim
   */
  const handleCreateClaim = async (claimData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(claimData)
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to create claim');
      }

      showToast(`Claim ${json.data.claimNumber} captured successfully with status SUBMITTED!`, 'success');
      setIsCreateModalOpen(false);
      // Refresh claims list
      await fetchClaims(true);
    } catch (err) {
      console.error('Create claim error:', err);
      throw err;
    }
  };

  /**
   * Handle Status Update
   */
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/claims/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to update claim status');
      }

      showToast(`Status updated to ${newStatus} for claim ${json.data.claimNumber}`, 'success');

      // Update local claim object if open in modal
      if (selectedClaim && selectedClaim.id === id) {
        setSelectedClaim(json.data);
      }

      // Refresh list
      await fetchClaims(true);
    } catch (err) {
      console.error('Status update error:', err);
      showToast(err.message || 'Status update failed', 'error');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-jubilee-lightBg flex flex-col font-sans">
      {/* Navbar Header */}
      <Header
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onRefresh={() => fetchClaims(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner Welcome */}
        <div className="mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Insurance Claims Management System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Capture customer claims, inspect submitted policy incident records, and update processing statuses seamlessly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-jubilee-red hover:bg-jubilee-redHover text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all transform active:scale-95 whitespace-nowrap"
            >
              + New Claim Form
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <StatsCards claims={claims} />

        {/* Claims Table List */}
        <ClaimsList
          claims={claims}
          isLoading={isLoading}
          error={error}
          onSelectClaim={(claim) => setSelectedClaim(claim)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      </main>

      {/* Modals & Drawers */}
      <CreateClaimModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateClaim={handleCreateClaim}
      />

      <ClaimDetailModal
        claim={selectedClaim}
        isOpen={Boolean(selectedClaim)}
        onClose={() => setSelectedClaim(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-400 mt-auto">
        <p>© 2026 Jubilee Insurance Kenya • Full Stack Engineering Interview Task</p>
      </footer>
    </div>
  );
}
