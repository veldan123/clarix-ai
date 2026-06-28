import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Badge from '../ui/Badge';
import { mockNotifications } from '../../data/mockData';

const TYPE_MAP = { warning: 'warning', info: 'info', success: 'success', error: 'error' };

export default function DashboardLayout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));

  const handleLogout = () => {
    logout();
    addToast('info', 'Signed out', 'See you next time!');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Top bar */}
        <header style={{
          height: 64, borderBottom: '1px solid #1A1A24',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', background: '#0D0D14', flexShrink: 0,
        }}>
          <h1 style={{ margin: 0, color: '#F0F0F5', fontSize: 18, fontWeight: 700 }}>{title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setNotifOpen(v => !v); setUserMenuOpen(false); }}
                aria-label="Notifications"
                style={{
                  background: 'none', border: '1px solid #2A2A38', borderRadius: 8,
                  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#5A5A72', position: 'relative', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.color = '#F0F0F5'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A38'; e.currentTarget.style.color = '#5A5A72'; }}
              >
                <Bell size={16} />
                {unread > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#EF4444', color: '#fff',
                    width: 16, height: 16, borderRadius: '50%',
                    fontSize: 9, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div style={{
                  position: 'absolute', top: 44, right: 0, zIndex: 200,
                  background: '#1A1A24', border: '1px solid #2A2A38',
                  borderRadius: 10, width: 340,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 16px', borderBottom: '1px solid #2A2A38',
                  }}>
                    <span style={{ color: '#F0F0F5', fontSize: 14, fontWeight: 600 }}>Notifications</span>
                    {unread > 0 && (
                      <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#6C63FF', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} style={{
                      padding: '14px 16px', borderBottom: '1px solid #111118',
                      background: n.read ? 'transparent' : 'rgba(108,99,255,0.04)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                          background: n.read ? '#2A2A38' : TYPE_MAP[n.type] === 'warning' ? '#F59E0B' : TYPE_MAP[n.type] === 'success' ? '#22C55E' : '#38BDF8',
                        }} />
                        <div>
                          <div style={{ color: '#F0F0F5', fontSize: 13, fontWeight: 500 }}>{n.title}</div>
                          <div style={{ color: '#5A5A72', fontSize: 12, marginTop: 2 }}>{n.message}</div>
                          <div style={{ color: '#3A3A4E', fontSize: 11, marginTop: 4 }}>
                            {new Date(n.time).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User menu */}
            <div ref={userRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setUserMenuOpen(v => !v); setNotifOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#111118', border: '1px solid #2A2A38',
                  borderRadius: 8, padding: '6px 10px',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#6C63FF'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A38'}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: 6, background: '#6C63FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: '#fff',
                }}>
                  {user?.avatar}
                </div>
                <span style={{ color: '#F0F0F5', fontSize: 13, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.businessName}
                </span>
                <ChevronDown size={14} style={{ color: '#5A5A72' }} />
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: 44, right: 0, zIndex: 200,
                  background: '#1A1A24', border: '1px solid #2A2A38',
                  borderRadius: 8, width: 180,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  padding: 4,
                }}>
                  {[
                    { label: 'Profile', icon: User, action: () => navigate('/dashboard/settings') },
                    { label: 'Settings', icon: Settings, action: () => navigate('/dashboard/settings') },
                    { label: 'Sign Out', icon: LogOut, action: handleLogout, danger: true },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => { item.action(); setUserMenuOpen(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                        padding: '9px 12px', background: 'none', border: 'none',
                        borderRadius: 6, cursor: 'pointer',
                        color: item.danger ? '#EF4444' : '#9090A8', fontSize: 13,
                        fontFamily: 'Inter, sans-serif', textAlign: 'left',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
