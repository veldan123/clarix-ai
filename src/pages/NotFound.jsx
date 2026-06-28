import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0A0A0F', textAlign: 'center', padding: 24,
    }}>
      <div className="dot-grid" />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: 120, fontWeight: 800, color: '#1A1A24',
          fontFamily: 'JetBrains Mono, monospace', lineHeight: 1, marginBottom: 20,
          background: 'linear-gradient(180deg, #2A2A38, #1A1A24)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          404
        </div>
        <h1 style={{ color: '#F0F0F5', fontSize: 24, fontWeight: 700, margin: '0 0 12px' }}>
          This page doesn't exist
        </h1>
        <p style={{ color: '#5A5A72', fontSize: 15, marginBottom: 32 }}>
          The page you're looking for may have been moved or deleted.
        </p>
        <button onClick={() => navigate('/')} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#6C63FF', color: '#fff', border: 'none',
          borderRadius: 6, padding: '11px 24px', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>
          <Home size={16} /> Go back home
        </button>
      </div>
    </div>
  );
}
