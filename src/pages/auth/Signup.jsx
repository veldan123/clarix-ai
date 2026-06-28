import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Bot, FileText, Globe, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

function PasswordStrength({ password }) {
  const strength = !password ? 0
    : password.length < 6 ? 1
    : password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) ? 2
    : 3;

  const labels = ['', 'Weak', 'Medium', 'Strong'];
  const colors = ['#2A2A38', '#EF4444', '#F59E0B', '#22C55E'];

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= strength ? colors[strength] : '#2A2A38',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
      {password && (
        <div style={{ color: colors[strength], fontSize: 11, marginTop: 4 }}>
          {labels[strength]} password
        </div>
      )}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({ businessName: '', email: '', password: '', confirm: '', agreed: false });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = (field, value) => {
    const errs = {};
    if (field === 'businessName' || !field) {
      if (!form.businessName && !value) errs.businessName = 'Business name is required';
    }
    if (field === 'email' || !field) {
      const email = field === 'email' ? value : form.email;
      if (!email) errs.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Must be a valid email address';
    }
    if (field === 'password' || !field) {
      const pw = field === 'password' ? value : form.password;
      if (!pw) errs.password = 'Password is required';
      else if (pw.length < 8) errs.password = 'Must be at least 8 characters';
    }
    if (field === 'confirm' || !field) {
      const confirm = field === 'confirm' ? value : form.confirm;
      if (!confirm) errs.confirm = 'Please confirm your password';
      else if (confirm !== form.password && !(field === 'confirm' && value !== form.password)) {
        if (field !== 'confirm') errs.confirm = 'Passwords do not match';
        else if (value !== form.password) errs.confirm = 'Passwords do not match';
      }
    }
    return errs;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: value }));
    if (touched[field]) {
      const errs = validate(field, value);
      setErrors(prev => ({ ...prev, [field]: errs[field] }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched(t => ({ ...t, [field]: true }));
    const errs = validate(field, form[field]);
    setErrors(prev => ({ ...prev, [field]: errs[field] }));
  };

  const isValid = (field) => touched[field] && !errors[field] && form[field];

  const allValid = !Object.keys(validate()).length && form.agreed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { businessName: true, email: true, password: true, confirm: true };
    setTouched(allTouched);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length || !form.agreed) return;

    setLoading(true);
    const { ok, message } = await signup(form.businessName, form.email, form.password);
    if (!ok) {
      setErrors(prev => ({ ...prev, email: message || 'Could not create account.' }));
      setLoading(false);
      return;
    }
    addToast('success', 'Account created!', `Welcome to Clarix AI Support, ${form.businessName}!`);
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#0A0A0F', fontFamily: 'Inter, sans-serif',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, position: 'relative', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 48px',
        background: '#0D0D14', borderRight: '1px solid #1A1A24',
        minWidth: 0,
      }}
        className="signup-left"
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
            Start building better support
          </h1>
          <p style={{ color: '#5A5A72', fontSize: 15, lineHeight: 1.65, margin: '0 0 40px' }}>
            Join 200+ businesses that use Clarix to deliver instant, accurate support — without growing their team.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: FileText, title: 'Train in minutes', desc: 'Upload your existing docs and go live same day' },
              { icon: Bot, title: 'No hallucinations', desc: 'AI only answers from your verified knowledge base' },
              { icon: Globe, title: 'Works everywhere', desc: 'One script tag, any website, any stack' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: 'rgba(108,99,255,0.1)',
                  border: '1px solid rgba(108,99,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} style={{ color: '#6C63FF' }} />
                </div>
                <div>
                  <div style={{ color: '#F0F0F5', fontWeight: 600, fontSize: 14 }}>{title}</div>
                  <div style={{ color: '#5A5A72', fontSize: 13 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px', minWidth: 0,
      }}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <h2 style={{ color: '#F0F0F5', fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Create your account</h2>
          <p style={{ color: '#5A5A72', fontSize: 14, margin: '0 0 28px' }}>
            Free forever. No credit card required.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Business name"
              value={form.businessName}
              onChange={handleChange('businessName')}
              onBlur={handleBlur('businessName')}
              placeholder="Acme Corp"
              error={touched.businessName && errors.businessName}
              valid={isValid('businessName')}
              required
            />
            <Input
              label="Work email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="you@company.com"
              error={touched.email && errors.email}
              valid={isValid('email')}
              required
            />
            <div>
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Min. 8 characters"
                error={touched.password && errors.password}
                valid={isValid('password')}
                required
              />
              {form.password && <PasswordStrength password={form.password} />}
            </div>
            <Input
              label="Confirm password"
              type="password"
              value={form.confirm}
              onChange={handleChange('confirm')}
              onBlur={handleBlur('confirm')}
              placeholder="Repeat your password"
              error={touched.confirm && errors.confirm}
              valid={isValid('confirm') && form.confirm === form.password}
              required
            />

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 4 }}>
              <input
                type="checkbox"
                checked={form.agreed}
                onChange={handleChange('agreed')}
                style={{ marginTop: 2, accentColor: '#6C63FF', width: 15, height: 15, flexShrink: 0 }}
              />
              <span style={{ color: '#5A5A72', fontSize: 13, lineHeight: 1.5 }}>
                I agree to the{' '}
                <a href="#" target="_blank" style={{ color: '#6C63FF', textDecoration: 'none' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" target="_blank" style={{ color: '#6C63FF', textDecoration: 'none' }}>Privacy Policy</a>
              </span>
            </label>

            <Button
              type="submit"
              loading={loading}
              disabled={!allValid}
              fullWidth
              style={{ marginTop: 4 }}
            >
              Create Account
            </Button>
          </form>

          <p style={{ color: '#5A5A72', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6C63FF', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) { .signup-left { display: none !important; } }
      `}</style>
    </div>
  );
}
