const VARIANTS = {
  success: { background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' },
  error: { background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' },
  warning: { background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' },
  info: { background: 'rgba(56,189,248,0.12)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.25)' },
  purple: { background: 'rgba(108,99,255,0.12)', color: '#A78BFA', border: '1px solid rgba(108,99,255,0.25)' },
  neutral: { background: 'rgba(90,90,114,0.2)', color: '#9090A8', border: '1px solid #2A2A38' },
};

export default function Badge({ children, variant = 'neutral', size = 'sm', dot }) {
  const styles = VARIANTS[variant] || VARIANTS.neutral;
  const padding = size === 'sm' ? '3px 8px' : '4px 10px';
  const fontSize = size === 'sm' ? 11 : 12;

  return (
    <span style={{
      ...styles,
      padding,
      fontSize,
      fontWeight: 600,
      borderRadius: 4,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      letterSpacing: '0.3px',
      whiteSpace: 'nowrap',
    }}>
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: styles.color,
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
}
