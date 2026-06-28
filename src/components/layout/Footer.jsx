import { Link } from 'react-router-dom';
import { Zap, ExternalLink, Share2, Rss } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#0A0A0F',
      borderTop: '1px solid #2A2A38',
      padding: '64px 24px 32px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 40,
          marginBottom: 48,
        }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 12 }}>
              <div style={{ width: 26, height: 26, background: '#6C63FF', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} color="#fff" fill="#fff" />
              </div>
              <span style={{ color: '#F0F0F5', fontWeight: 700, fontSize: 15 }}>Clarix AI Support</span>
            </Link>
            <p style={{ color: '#5A5A72', fontSize: 13, lineHeight: 1.6, marginBottom: 16, maxWidth: 220 }}>
              The AI-powered customer support infrastructure built for modern businesses.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[Share2, ExternalLink, Rss].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social link" style={{
                  color: '#5A5A72', display: 'flex',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#9090A8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#5A5A72'}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div style={{ color: '#F0F0F5', fontWeight: 600, fontSize: 13, marginBottom: 16 }}>Product</div>
            {['Features', 'Pricing', 'Documentation', 'Changelog', 'Status Page'].map(link => (
              <div key={link} style={{ marginBottom: 10 }}>
                <Link to="/docs" style={{ color: '#5A5A72', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#9090A8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#5A5A72'}
                >{link}</Link>
              </div>
            ))}
          </div>

          <div>
            <div style={{ color: '#F0F0F5', fontWeight: 600, fontSize: 13, marginBottom: 16 }}>Company</div>
            {['About', 'Blog', 'Careers', 'Case Studies', 'Contact'].map(link => (
              <div key={link} style={{ marginBottom: 10 }}>
                <a href="#" style={{ color: '#5A5A72', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#9090A8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#5A5A72'}
                >{link}</a>
              </div>
            ))}
          </div>

          <div>
            <div style={{ color: '#F0F0F5', fontWeight: 600, fontSize: 13, marginBottom: 16 }}>Legal</div>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Security'].map(link => (
              <div key={link} style={{ marginBottom: 10 }}>
                <a href="#" style={{ color: '#5A5A72', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#9090A8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#5A5A72'}
                >{link}</a>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1A1A24',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <span style={{ color: '#3A3A4E', fontSize: 12 }}>
            © 2026 Clarix AI Support. All rights reserved.
          </span>
          <span style={{ color: '#3A3A4E', fontSize: 12 }}>
            Built with Clarix AI Support
          </span>
        </div>
      </div>
    </footer>
  );
}
