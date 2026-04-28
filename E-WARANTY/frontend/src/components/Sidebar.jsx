import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Plus, Wrench, AlertCircle, MessageSquare } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const getLinkClass = (isActivePath) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActivePath
        ? 'bg-gradient-to-r from-emerald-600/30 to-emerald-500/30 text-white border border-emerald-500/30'
        : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
    }`;

  return (
    <div className="glass glass-strong hidden lg:flex flex-col w-64 h-screen border-r border-slate-700/50 p-6 sticky top-0 shadow-xl shadow-slate-950/10">
      <nav className="flex-1 space-y-2">
        <Link to="/dashboard" className={getLinkClass(isActive('/dashboard'))}>
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <Link to="/products" className={getLinkClass(isActive('/products'))}>
          <Package className="w-5 h-5" />
          <span>Products</span>
        </Link>

        <Link to="/add-product" className={getLinkClass(isActive('/add-product'))}>
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>

        <Link to="/maintenance" className={getLinkClass(isActive('/maintenance'))}>
          <Wrench className="w-5 h-5" />
          <span>Maintenance</span>
        </Link>

        <Link to="/assistant" className={getLinkClass(isActive('/assistant'))}>
          <MessageSquare className="w-5 h-5" />
          <span>AI Assistant</span>
        </Link>

        <Link to="/expiring" className={getLinkClass(isActive('/expiring'))}>
          <AlertCircle className="w-5 h-5" />
          <span>Expiring Soon</span>
        </Link>
      </nav>
    </div>
  );
};
