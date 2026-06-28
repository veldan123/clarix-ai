import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ open, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const widths = { sm: 400, md: 520, lg: 680, xl: 860 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1A1A24',
              border: '1px solid #2A2A38',
              borderRadius: 10,
              width: '100%',
              maxWidth: widths[size],
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
          >
            {title && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 24px',
                borderBottom: '1px solid #2A2A38',
                flexShrink: 0,
              }}>
                <h3 style={{ margin: 0, color: '#F0F0F5', fontSize: 16, fontWeight: 600 }}>{title}</h3>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A5A72', padding: 4, display: 'flex' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#9090A8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#5A5A72'}
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
              {children}
            </div>
            {footer && (
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #2A2A38',
                display: 'flex', gap: 8, justifyContent: 'flex-end',
                flexShrink: 0,
              }}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
