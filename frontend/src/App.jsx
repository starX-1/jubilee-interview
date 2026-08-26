import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ClaimsList from './components/ClaimsList';
import CreateClaimModal from './components/CreateClaimModal';
import ClaimDetailModal from './components/ClaimDetailModal';
import LoginScreen from './components/LoginScreen';
import Toast from './components/Toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Officer Auth State
  const [officer, setOfficer] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('officer_token') || null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(localStorage.getItem('officer_token')));

  // Pagination & Filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedType, setSelectedType] = useState('All Types');
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Restore Officer session on startup if token exists
  useEffect(() => {
    if (token) {
      setIsCheckingAuth(true);
      fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.officer) {
            setOfficer(data.officer);
          } else {
            handleLogout();
          }
        })
        .catch(() => handleLogout())
        .finally(() => setIsCheckingAuth(false));
    } else {
      setIsCheckingAuth(false);
    }
  }, [token]);

  /**
   * Handle Officer Login
   */
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Login failed');
      }

      setToken(json.token);
      setOfficer(json.officer);
      localStorage.setItem('officer_token', json.token);
      showToast(`Welcome back, ${json.officer.fullName}! Logged in successfully.`, 'success');
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  /**
   * Handle Officer Logout
   */
  const handleLogout = () => {
    setToken(null);
    setOfficer(null);
    localStorage.removeItem('officer_token');
    showToast('Logged out of Claims Officer session.', 'success');
  };

  /**
   * Fetch Claims with pagination and filters
   */
  const fetchClaims = useCallback(async (quiet = false) => {
    if (!token && !officer) return;

    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (selectedType !== 'All Types') params.append('claimType', selectedType);
      if (searchQuery.trim() !== '') params.append('search', searchQuery.trim());

      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/api/claims?${params.toString()}`, { headers });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to fetch claims list');
      }

      setClaims(json.data || []);
      setPagination({
        page: json.page || 1,
        limit: json.limit || 5,
        total: json.total || 0,
        totalPages: json.totalPages || 1
      });
    } catch (err) {
      console.error('Error fetching claims:', err);
      setError(err.message || 'Unable to connect to Jubilee Claims API service');
      showToast(err.message || 'Failed to load claims', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [page, limit, selectedStatus, selectedType, searchQuery, token, officer]);

  useEffect(() => {
    if (officer) {
      fetchClaims();
    }
  }, [fetchClaims, officer]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedStatus, selectedType]);

  /**
   * Handle Create Claim
   */
  const handleCreateClaim = async (claimData) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/api/claims`, {
        method: 'POST',
        headers,
        body: JSON.stringify(claimData)
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to create claim');
      }

      showToast(`Claim ${json.data.claimNumber} captured successfully with status SUBMITTED!`, 'success');
      setIsCreateModalOpen(false);
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
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/api/claims/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus })
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to update claim status');
      }

      showToast(`Status updated to ${newStatus} for claim ${json.data.claimNumber}`, 'success');

      if (selectedClaim && selectedClaim.id === id) {
        setSelectedClaim(json.data);
      }

      await fetchClaims(true);
    } catch (err) {
      console.error('Status update error:', err);
      showToast(err.message || 'Status update failed', 'error');
      throw err;
    }
  };

  // 1. Loading Auth Session State
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-jubilee-navy flex flex-col items-center justify-center text-white p-4">
        <div className="w-10 h-10 border-4 border-jubilee-red border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-300">Verifying Officer Session...</p>
      </div>
    );
  }

  // 2. Unauthenticated Gate -> Render Full Page Login Screen
  if (!officer) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // 3. Authenticated Officer Dashboard View
  return (
    <div className="min-h-screen bg-jubilee-lightBg flex flex-col font-sans text-slate-800">
      {/* Header */}
      <Header
        officer={officer}
        onOpenLoginModal={() => {}}
        onLogout={handleLogout}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onRefresh={() => fetchClaims(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
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
              onClick={handleLogout}
              className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-rose-800 transition-all cursor-pointer flex items-center gap-1.5"
            >
              Log Out Session
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-jubilee-red hover:bg-jubilee-redHover text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all transform active:scale-95 whitespace-nowrap cursor-pointer"
            >
              + New Claim Form
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <StatsCards claims={claims} />

        {/* Paginated Claims List */}
        <ClaimsList
          claims={claims}
          isLoading={isLoading}
          error={error}
          pagination={pagination}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onPageChange={(newPage) => setPage(newPage)}
          onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
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
