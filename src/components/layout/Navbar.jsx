import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(10,10,15,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(42,42,56,0.8)' : '1px solid transparent',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 28, height: 28, background: '#6C63FF',
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={16} color="#fff" fill="#fff" />
          </div>
          <span style={{ color: '#F0F0F5', fontWeight: 700, fontSize: 16 }}>Clarix AI Support</span>
        </Link>

        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="hidden-mobile">
          {['Features', 'Pricing', 'Documentation', 'Case Studies'].map(link => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase().replace(' ', '-'))}
              style={{
                background: 'none', border: 'none', color: '#9090A8',
                fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#F0F0F5'}
              onMouseLeave={e => e.currentTarget.style.color = '#9090A8'}
            >
              {link}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }} className="hidden-mobile">
          {user ? (
            <Button onClick={() => navigate('/dashboard')} size="sm">Dashboard</Button>
          ) : (
            <>
              <Link to="/login" style={{ color: '#9090A8', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Sign In</Link>
              <Button size="sm" onClick={() => navigate('/signup')}>Start Free</Button>
            </>
          )}
        </div>

        <button
          className="show-mobile"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle mobile menu"
          style={{
            background: 'none', border: 'none', color: '#9090A8', cursor: 'pointer',
            display: 'none',
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: '#0A0A0F',
          paddingTop: 64,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['Features', 'Pricing', 'Documentation', 'Case Studies'].map(link => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase().replace(' ', '-'))}
                style={{
                  background: 'none', border: 'none', color: '#F0F0F5',
                  fontSize: 18, fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', padding: '14px 0',
                  textAlign: 'left', borderBottom: '1px solid #1A1A24',
                }}
              >
                {link}
              </button>
            ))}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button fullWidth onClick={() => { navigate('/signup'); setMobileOpen(false); }}>Start Free</Button>
              <Button variant="ghost" fullWidth onClick={() => { navigate('/login'); setMobileOpen(false); }}>Sign In</Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
