import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 700));
    const ok = login(form.email, form.password);
    if (ok) {
      addToast('success', 'Welcome back!', 'Logged in successfully.');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Try the demo credentials below.');
    }
    setLoading(false);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setForgotLoading(false);
    setForgotSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0A0A0F', fontFamily: 'Inter, sans-serif' }}>
      {/* Left branding */}
      <div style={{
        flex: 1, position: 'relative', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 48px',
        background: '#0D0D14', borderRight: '1px solid #1A1A24',
      }}
        className="login-left"
      >
        <div className="dot-grid" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 48 }}>
            <div style={{ width: 28, height: 28, background: '#6C63FF', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={15} color="#fff" fill="#fff" />
            </div>
            <span style={{ color: '#F0F0F5', fontWeight: 700, fontSize: 16 }}>Clarix AI Support</span>
          </Link>

          <h1 style={{ color: '#F0F0F5', fontSize: 32, fontWeight: 800, margin: '0 0 14px', letterSpacing: '-1px' }}>
            Welcome back
          </h1>
          <p style={{ color: '#5A5A72', fontSize: 15, lineHeight: 1.65, margin: '0 0 40px' }}>
            Your AI support team has been working while you were away.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: Shield, text: 'Enterprise-grade security' },
              { icon: Clock, text: '99.9% uptime SLA' },
              { icon: Zap, text: 'Sub-200ms response times' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#5A5A72', fontSize: 14 }}>
                <Icon size={16} style={{ color: '#6C63FF', flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px' }}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <h2 style={{ color: '#F0F0F5', fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Sign in to your account</h2>
          <p style={{ color: '#5A5A72', fontSize: 14, margin: '0 0 28px' }}>Access your dashboard and manage your chatbots.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Your password"
              required
              autoComplete="current-password"
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                  style={{ accentColor: '#6C63FF' }}
                />
                <span style={{ color: '#5A5A72', fontSize: 13 }}>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                style={{ background: 'none', border: 'none', color: '#6C63FF', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 6, padding: '10px 14px', color: '#EF4444', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} fullWidth style={{ marginTop: 4 }}>
              Sign In
            </Button>
          </form>

          <div style={{
            marginTop: 20, padding: '12px 16px',
            background: '#111118', border: '1px solid #2A2A38', borderRadius: 8,
          }}>
            <div style={{ color: '#5A5A72', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>Demo credentials</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#9090A8' }}>
              <div>demo@clarixaisupport.com</div>
              <div>password123</div>
            </div>
            <button
              onClick={() => setForm({ email: 'demo@clarixaisupport.com', password: 'password123', remember: false })}
              style={{
                marginTop: 8, background: 'none', border: '1px solid #2A2A38',
                borderRadius: 4, color: '#6C63FF', fontSize: 11, padding: '3px 8px',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              Use demo credentials
            </button>
          </div>

          <p style={{ color: '#5A5A72', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#6C63FF', textDecoration: 'none', fontWeight: 500 }}>Sign up free</Link>
          </p>
        </motion.div>
      </div>

      {/* Forgot password modal */}
      <Modal open={forgotOpen} onClose={() => { setForgotOpen(false); setForgotSent(false); setForgotEmail(''); }} title="Reset Password">
        {forgotSent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>
              <Zap size={44} style={{ color: '#22C55E', margin: '0 auto' }} />
            </div>
            <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 8 }}>Check your inbox</div>
            <div style={{ color: '#5A5A72', fontSize: 14 }}>
              We sent a reset link to <strong style={{ color: '#9090A8' }}>{forgotEmail}</strong>. It expires in 24 hours.
            </div>
          </div>
        ) : (
          <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: '#5A5A72', fontSize: 14, margin: 0 }}>
              Enter your email and we'll send you a link to reset your password.
            </p>
            <Input
              label="Email address"
              type="email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
            <Button type="submit" loading={forgotLoading} fullWidth>Send Reset Link</Button>
          </form>
        )}
      </Modal>

      <style>{`
        @media (max-width: 768px) { .login-left { display: none !important; } }
      `}</style>
    </div>
  );
}
