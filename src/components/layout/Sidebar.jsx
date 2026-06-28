import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Bot, FileText, Key, BarChart2,
  MessageSquare, CreditCard, Settings, Zap, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Chatbots', icon: Bot, path: '/dashboard/chatbots' },
  { label: 'Documents', icon: FileText, path: '/dashboard/documents' },
  { label: 'API Keys', icon: Key, path: '/dashboard/api-keys' },
  { label: 'Analytics', icon: BarChart2, path: '/dashboard/analytics' },
  { label: 'Conversations', icon: MessageSquare, path: '/dashboard/conversations' },
  { label: 'Billing', icon: CreditCard, path: '/dashboard/billing' },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const PLAN_COLORS = {
  starter: { bg: 'rgba(90,90,114,0.2)', color: '#9090A8' },
  growth: { bg: 'rgba(108,99,255,0.15)', color: '#A78BFA' },
  pro: { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const planStyle = PLAN_COLORS[user?.plan] || PLAN_COLORS.starter;

  return (
    <aside style={{
      width: collapsed ? 64 : 220,
      minHeight: '100vh',
      background: '#0D0D14',
      borderRight: '1px solid #1A1A24',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px 16px',
        borderBottom: '1px solid #1A1A24',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
        height: 64,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 28, height: 28, background: '#6C63FF', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Zap size={15} color="#fff" fill="#fff" />
          </div>
          {!collapsed && (
            <span style={{ color: '#F0F0F5', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
              Clarix AI
            </span>
          )}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(v => !v)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{
          position: 'absolute', top: 72, right: -12,
          width: 24, height: 24,
          background: '#1A1A24', border: '1px solid #2A2A38',
          borderRadius: '50%', cursor: 'pointer', color: '#5A5A72',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10, transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#F0F0F5'; e.currentTarget.style.borderColor = '#6C63FF'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#5A5A72'; e.currentTarget.style.borderColor = '#2A2A38'; }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: collapsed ? '10px 0' : '9px 10px',
                marginBottom: 2,
                borderRadius: 6,
                textDecoration: 'none',
                color: isActive ? '#F0F0F5' : '#5A5A72',
                background: isActive ? 'rgba(108,99,255,0.12)' : 'transparent',
                borderLeft: isActive ? '2px solid #6C63FF' : '2px solid transparent',
                transition: 'all 0.15s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#9090A8';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#5A5A72';
                }
              }}
            >
              <item.icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{
        padding: collapsed ? '12px 0' : '12px 8px',
        borderTop: '1px solid #1A1A24',
      }}>
        <button
          onClick={handleLogout}
          aria-label="Sign out"
          title={collapsed ? 'Sign out' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '8px 0' : '8px 10px',
            borderRadius: 6, border: 'none', background: 'none',
            color: '#5A5A72', cursor: 'pointer', width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.15s',
            fontFamily: 'Inter, sans-serif',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#5A5A72'; e.currentTarget.style.background = 'none'; }}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: 12 }}>Sign out</span>}
        </button>

        {!collapsed && user && (
          <div style={{
            marginTop: 8, padding: '10px',
            background: '#111118', borderRadius: 8,
            border: '1px solid #1A1A24',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: '#6C63FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {user.avatar}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: '#F0F0F5', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.businessName}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 3,
                  ...planStyle,
                }}>
                  {user.plan?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
