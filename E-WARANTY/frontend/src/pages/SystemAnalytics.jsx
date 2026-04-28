import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowLeft, Users, Package, AlertCircle, TrendingUp } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import api from '../services/api.js';

export const SystemAnalytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalClaims: 0,
    expiringWarranties: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [usersRes, productsRes, warrantyRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/products'),
          api.get('/warranties'),
        ]);

        let userData = { users: [] };
        let productData = { products: [] };
        let warrantyData = { warranties: [] };

        if (usersRes.data.users) userData = usersRes.data;
        if (Array.isArray(usersRes.data)) userData.users = usersRes.data;

        if (productsRes.data.products) productData = productsRes.data;
        if (Array.isArray(productsRes.data)) productData.products = productsRes.data;

        if (warrantyRes.data.warranties) warrantyData = warrantyRes.data;
        if (Array.isArray(warrantyRes.data)) warrantyData.warranties = warrantyRes.data;

        const expiringCount = (warrantyData.warranties || []).filter(w => 
          w.status === 'EXPIRING_SOON'
        ).length;

        setStats({
          totalUsers: userData.users?.length || 0,
          totalProducts: productData.products?.length || 0,
          totalClaims: warrantyData.warranties?.length || 0,
          expiringWarranties: expiringCount,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
        showToast(error.response?.data?.message || 'Failed to load analytics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [showToast]);

  const analyticsCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      color: 'cyan',
      trend: '+2.5%'
    },
    {
      icon: Package,
      label: 'Total Products',
      value: stats.totalProducts,
      color: 'emerald',
      trend: '+5.1%'
    },
    {
      icon: AlertCircle,
      label: 'Total Claims',
      value: stats.totalClaims,
      color: 'amber',
      trend: '+1.2%'
    },
    {
      icon: TrendingUp,
      label: 'Expiring Soon',
      value: stats.expiringWarranties,
      color: 'purple',
      trend: '+0.8%'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-950/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="rounded-lg p-2 hover:bg-slate-700/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-purple-300" />
                System Analytics
              </h1>
              <p className="mt-1 text-slate-400">View detailed system reports and metrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <>
            {/* Analytics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {analyticsCards.map((card, index) => {
                const Icon = card.icon;
                const colorClasses = {
                  cyan: 'bg-cyan-600/15 text-cyan-300',
                  emerald: 'bg-emerald-600/15 text-emerald-300',
                  amber: 'bg-amber-600/15 text-amber-300',
                  purple: 'bg-purple-600/15 text-purple-300'
                };

                return (
                  <div key={index} className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 hover:bg-slate-900/70 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorClasses[card.color]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-medium text-emerald-300 bg-emerald-600/20 px-2 py-1 rounded-full">
                        {card.trend}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-400 mb-1">{card.label}</p>
                    <p className="text-4xl font-bold text-white">{card.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Reports Section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* User Distribution */}
              <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-6">User Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Customers</span>
                      <span className="text-sm font-semibold text-emerald-300">45%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Admins</span>
                      <span className="text-sm font-semibold text-purple-300">15%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Agents</span>
                      <span className="text-sm font-semibold text-blue-300">40%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warranty Status */}
              <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Warranty Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Active</span>
                      <span className="text-sm font-semibold text-green-300">70%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Expiring Soon</span>
                      <span className="text-sm font-semibold text-amber-300">20%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Expired</span>
                      <span className="text-sm font-semibold text-red-300">10%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
