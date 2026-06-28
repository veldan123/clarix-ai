import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: { border: '#22C55E', text: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  error: { border: '#EF4444', text: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  warning: { border: '#F59E0B', text: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  info: { border: '#38BDF8', text: '#38BDF8', bg: 'rgba(56,189,248,0.1)' },
};

function Toast({ toast, onRemove }) {
  const Icon = ICONS[toast.type] || Info;
  const colors = COLORS[toast.type] || COLORS.info;

  return (
    <div
      className="fade-in"
      style={{
        background: '#1A1A24',
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        padding: '12px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        minWidth: 300,
        maxWidth: 380,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        marginBottom: 8,
      }}
    >
      <Icon size={18} style={{ color: colors.text, flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div style={{ color: '#F0F0F5', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
            {toast.title}
          </div>
        )}
        {toast.message && (
          <div style={{ color: '#9090A8', fontSize: 13, lineHeight: 1.4 }}>{toast.message}</div>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A5A72', padding: 0, flexShrink: 0 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}>
        {toasts.map(t => <Toast key={t.id} toast={t} onRemove={removeToast} />)}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
