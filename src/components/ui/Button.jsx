export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  style = {},
  className = '',
  ariaLabel,
  fullWidth = false,
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    border: 'none',
    borderRadius: 6,
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : undefined,
    justifyContent: fullWidth ? 'center' : undefined,
    textDecoration: 'none',
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: 13 },
    md: { padding: '9px 18px', fontSize: 14 },
    lg: { padding: '12px 24px', fontSize: 15 },
  };

  const variants = {
    primary: {
      background: '#6C63FF',
      color: '#fff',
    },
    secondary: {
      background: '#1A1A24',
      color: '#F0F0F5',
      border: '1px solid #2A2A38',
    },
    ghost: {
      background: 'transparent',
      color: '#9090A8',
      border: '1px solid #2A2A38',
    },
    danger: {
      background: '#EF4444',
      color: '#fff',
    },
    outline: {
      background: 'transparent',
      color: '#6C63FF',
      border: '1px solid #6C63FF',
    },
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      className={className}
      onMouseEnter={e => {
        if (disabled || loading) return;
        if (variant === 'primary') e.currentTarget.style.background = '#7B74FF';
        if (variant === 'danger') e.currentTarget.style.background = '#F87171';
        if (variant === 'outline') e.currentTarget.style.background = 'rgba(108,99,255,0.1)';
        if (variant === 'secondary' || variant === 'ghost') e.currentTarget.style.borderColor = '#6C63FF';
      }}
      onMouseLeave={e => {
        if (disabled || loading) return;
        if (variant === 'primary') e.currentTarget.style.background = '#6C63FF';
        if (variant === 'danger') e.currentTarget.style.background = '#EF4444';
        if (variant === 'outline') e.currentTarget.style.background = 'transparent';
        if (variant === 'secondary') e.currentTarget.style.borderColor = '#2A2A38';
        if (variant === 'ghost') e.currentTarget.style.borderColor = '#2A2A38';
      }}
    >
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
}
