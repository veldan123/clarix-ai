import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Landing from './pages/marketing/Landing';
import Docs from './pages/marketing/Docs';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import NotFound from './pages/NotFound';

import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Chatbots from './pages/dashboard/Chatbots';
import Documents from './pages/dashboard/Documents';
import ApiKeys from './pages/dashboard/ApiKeys';
import Analytics from './pages/dashboard/Analytics';
import Conversations from './pages/dashboard/Conversations';
import Billing from './pages/dashboard/Billing';
import Settings from './pages/dashboard/Settings';

const PAGE_TITLES = {
  '/dashboard': 'Overview',
  '/dashboard/chatbots': 'Chatbots',
  '/dashboard/documents': 'Documents',
  '/dashboard/api-keys': 'API Keys',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/conversations': 'Conversations',
  '/dashboard/billing': 'Billing',
  '/dashboard/settings': 'Settings',
};

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
        style={{ minHeight: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function DashboardRoutes() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Dashboard';
  return (
    <ProtectedRoute>
      <DashboardLayout title={title}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ height: '100%' }}
          >
            <Routes>
              <Route index element={<Overview />} />
              <Route path="chatbots" element={<Chatbots />} />
              <Route path="documents" element={<Documents />} />
              <Route path="api-keys" element={<ApiKeys />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="conversations" element={<Conversations />} />
              <Route path="billing" element={<Billing />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
