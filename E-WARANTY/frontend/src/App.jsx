import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { Toast } from './components/Toast.jsx';
import { useAuth } from './hooks/useAuth.js';

import { LoginSelection }     from './pages/LoginSelection.jsx';
import { CustomerLogin }      from './pages/CustomerLogin.jsx';
import { AgentLogin }         from './pages/AgentLogin.jsx';
import { Register }           from './pages/Register.jsx';
import { Dashboard }          from './pages/Dashboard.jsx';
import { Products }           from './pages/Products.jsx';
import { ExpiringWarranties } from './pages/ExpiringWarranties.jsx';
import { AddProduct }         from './pages/AddProduct.jsx';
import { ProductDetails }     from './pages/ProductDetails.jsx';
import { MaintenanceHistory } from './pages/MaintenanceHistory.jsx';
import { AdminDashboard }     from './pages/AdminDashboard.jsx';
import { AgentDashboard }     from './pages/AgentDashboard.jsx';
import { CreateAgent }        from './pages/CreateAgent.jsx';
import { AIChat }             from './pages/AIChat.jsx';
import { EditProduct }        from './pages/EditProduct.jsx';
import { LoadingSpinner }     from './components/LoadingSpinner.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'AGENT') return <Navigate to="/agent/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (isAuthenticated) {
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'AGENT') return <Navigate to="/agent/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <ToastProvider>
      <Toast />
      <Routes>
        {/* Public */}
        <Route path="/login"             element={<PublicRoute><LoginSelection /></PublicRoute>} />
        <Route path="/login/customer"    element={<PublicRoute><CustomerLogin /></PublicRoute>} />
        <Route path="/login/agent"       element={<PublicRoute><AgentLogin /></PublicRoute>} />
        <Route path="/register"          element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/register/customer" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Customer */}
        <Route path="/dashboard"         element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']}><Dashboard /></ProtectedRoute>} />
        <Route path="/products"          element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT']}><Products /></ProtectedRoute>} />
        <Route path="/add-product"       element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT']}><AddProduct /></ProtectedRoute>} />
        <Route path="/product/:id"       element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT']}><ProductDetails /></ProtectedRoute>} />
        <Route path="/product/:id/edit"  element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT']}><EditProduct /></ProtectedRoute>} />
        <Route path="/maintenance"       element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT']}><MaintenanceHistory /></ProtectedRoute>} />
        <Route path="/expiring"          element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT']}><ExpiringWarranties /></ProtectedRoute>} />
        <Route path="/assistant"         element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT']}><AIChat /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard"   element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/agents"      element={<ProtectedRoute allowedRoles={['ADMIN']}><CreateAgent /></ProtectedRoute>} />

        {/* Agent */}
        <Route path="/agent/dashboard"   element={<ProtectedRoute allowedRoles={['AGENT']}><AgentDashboard /></ProtectedRoute>} />

        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />
      </Routes>
    </ToastProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;