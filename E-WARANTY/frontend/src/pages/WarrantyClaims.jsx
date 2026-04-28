import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import api from '../services/api.js';

export const WarrantyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const response = await api.get('/warranties');
        if (response.data.warranties) {
          setClaims(response.data.warranties);
        } else if (Array.isArray(response.data)) {
          setClaims(response.data);
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
        showToast(error.response?.data?.message || 'Failed to load warranty claims', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [showToast]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'APPROVED':
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-amber-400" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  const filteredClaims = claims.filter(claim => {
    if (filter === 'all') return true;
    return claim.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-950/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="rounded-lg p-2 hover:bg-slate-700/30 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-amber-300" />
                  Warranty Claims
                </h1>
                <p className="mt-1 text-slate-400">Review and manage warranty claims</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter Tabs */}
        <div className="mb-6 flex gap-3">
          {[
            { value: 'all', label: 'All Claims', color: 'slate' },
            { value: 'PENDING', label: 'Pending', color: 'amber' },
            { value: 'APPROVED', label: 'Approved', color: 'green' },
            { value: 'REJECTED', label: 'Rejected', color: 'red' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === tab.value
                  ? `bg-${tab.color}-600/30 text-${tab.color}-300`
                  : `text-slate-400 hover:text-white hover:bg-slate-700/30`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <div className="space-y-4">
            {filteredClaims.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-slate-700/50 bg-slate-900/50">
                <AlertCircle className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No warranty claims found</p>
              </div>
            ) : (
              filteredClaims.map((claim) => (
                <div key={claim._id} className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 hover:bg-slate-900/70 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">Claim #{claim._id?.slice(0, 8)}</h3>
                      <p className="text-sm text-slate-400">Product: {claim.product?.name || '—'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(claim.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        claim.status === 'APPROVED' ? 'bg-green-600/20 text-green-300' :
                        claim.status === 'PENDING' ? 'bg-amber-600/20 text-amber-300' :
                        claim.status === 'REJECTED' ? 'bg-red-600/20 text-red-300' :
                        'bg-slate-600/20 text-slate-300'
                      }`}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2 md:grid-cols-3 text-sm text-slate-300 mb-4">
                    <p>Customer: {claim.customer?.name || '—'}</p>
                    <p>Filed: {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : '—'}</p>
                    <p>Type: {claim.claimType || '—'}</p>
                  </div>
                  <button className="rounded-lg bg-amber-600/20 px-4 py-2 text-sm text-amber-300 hover:bg-amber-600/30 transition-colors">
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
