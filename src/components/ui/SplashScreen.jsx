import { useEffect, useState } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onDone }) {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    // Animation finishes at ~3.8s, start fade-out at 3.8s
    const fadeTimer = setTimeout(() => setHiding(true), 3800);
    const doneTimer = setTimeout(() => onDone?.(), 4000);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div className={`splash-overlay${hiding ? ' hiding' : ''}`}>
      <div className="splash-dot-grid" />
      <div className="splash-glow" />

      <div className="splash-logo-wrap">
        <svg className="splash-hex-svg" width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
          <polygon points="90,10 164,52 164,128 90,170 16,128 16,52" fill="rgba(108,99,255,0.1)" />
          <polygon className="splash-hex-ring" points="90,10 164,52 164,128 90,170 16,128 16,52"
            fill="none" stroke="#6C63FF" strokeWidth="1.5" opacity="0.8" />
          <polygon className="splash-hex-ring-inner" points="90,28 148,62 148,118 90,152 32,118 32,62"
            fill="none" stroke="#6C63FF" strokeWidth="0.6" opacity="0.3" />

          <line className="splash-spoke splash-spoke-1" x1="90" y1="70" x2="90" y2="22" stroke="#A78BFA" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="50" />
          <line className="splash-spoke splash-spoke-2" x1="90" y1="110" x2="90" y2="158" stroke="#A78BFA" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="50" />
          <line className="splash-spoke splash-spoke-3" x1="107" y1="80" x2="149" y2="56" stroke="#A78BFA" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="50" />
          <line className="splash-spoke splash-spoke-4" x1="73" y1="80" x2="31" y2="56" stroke="#A78BFA" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="50" />
          <line className="splash-spoke splash-spoke-5" x1="107" y1="100" x2="149" y2="124" stroke="#A78BFA" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="50" />
          <line className="splash-spoke splash-spoke-6" x1="73" y1="100" x2="31" y2="124" stroke="#A78BFA" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="50" />

          <circle className="splash-end-node splash-en-1" cx="90" cy="20" r="7" fill="#6C63FF" opacity="0.95" />
          <circle className="splash-end-node splash-en-2" cx="90" cy="160" r="7" fill="#6C63FF" opacity="0.95" />
          <circle className="splash-end-node splash-en-3" cx="151" cy="55" r="7" fill="#6C63FF" opacity="0.95" />
          <circle className="splash-end-node splash-en-4" cx="29" cy="55" r="7" fill="#6C63FF" opacity="0.95" />
          <circle className="splash-end-node splash-en-5" cx="151" cy="125" r="7" fill="#6C63FF" opacity="0.95" />
          <circle className="splash-end-node splash-en-6" cx="29" cy="125" r="7" fill="#6C63FF" opacity="0.95" />

          <circle cx="90" cy="20" r="3" fill="white" opacity="0.9" className="splash-end-node splash-en-1" />
          <circle cx="90" cy="160" r="3" fill="white" opacity="0.9" className="splash-end-node splash-en-2" />
          <circle cx="151" cy="55" r="3" fill="white" opacity="0.9" className="splash-end-node splash-en-3" />
          <circle cx="29" cy="55" r="3" fill="white" opacity="0.9" className="splash-end-node splash-en-4" />
          <circle cx="151" cy="125" r="3" fill="white" opacity="0.9" className="splash-end-node splash-en-5" />
          <circle cx="29" cy="125" r="3" fill="white" opacity="0.9" className="splash-end-node splash-en-6" />

          <circle cx="90" cy="90" r="22" fill="rgba(108,99,255,0.2)" />
          <circle cx="90" cy="90" r="16" fill="rgba(180,170,255,0.9)" />
          <circle className="splash-core-pulse" cx="90" cy="90" r="8" fill="#6C63FF" />
          <circle cx="90" cy="90" r="3.5" fill="white" />
        </svg>

        <div className="splash-wordmark">
          <div className="splash-w-main">Clarix</div>
          <div className="splash-divider" />
          <div className="splash-w-sub">AI Support</div>
        </div>
      </div>

      <div className="splash-loader-wrap">
        <div className="splash-loader-track">
          <div className="splash-loader-fill" />
        </div>
        <div className="splash-loader-label">Loading your workspace</div>
      </div>
    </div>
  );
}
