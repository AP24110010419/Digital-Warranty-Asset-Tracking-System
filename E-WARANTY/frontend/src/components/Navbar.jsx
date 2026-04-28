import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass border-b border-emerald-500/20 sticky top-0 z-40 backdrop-blur-xl shadow-xl shadow-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all transform group-hover:scale-105">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="block font-black text-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">WarrantyHub</span>
              <span className="block text-xs text-emerald-400/70 font-semibold tracking-wide">Secure Warranty Management</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/products" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
              Products
            </Link>
            <Link to="/add-product" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-2 text-sm font-semibold text-white transition hover:brightness-110 shadow-lg shadow-emerald-500/30">
              + Add Product
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-slate-300 text-sm">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="btn-secondary inline-flex items-center justify-center p-2 text-slate-100 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700/50 mt-4 space-y-2">
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/products"
              className="block px-4 py-2 text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              Products
            </Link>
            <Link
              to="/add-product"
              className="block px-4 py-2 btn-primary text-center"
            >
              + Add Product
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
