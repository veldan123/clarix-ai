import { useState } from 'react';
import { CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  valid,
  required,
  disabled,
  icon,
  hint,
  name,
  autoComplete,
  style = {},
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label style={{ color: '#9090A8', fontSize: 13, fontWeight: 500 }}>
          {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span style={{ position: 'absolute', left: 12, color: '#5A5A72', display: 'flex', pointerEvents: 'none' }}>
            {icon}
          </span>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          style={{
            width: '100%',
            background: '#111118',
            border: `1px solid ${error ? '#EF4444' : valid ? '#22C55E' : '#2A2A38'}`,
            borderRadius: 6,
            color: '#F0F0F5',
            fontSize: 14,
            padding: `9px ${(type === 'password' || valid || error) ? '40px' : '12px'} 9px ${icon ? '38px' : '12px'}`,
            outline: 'none',
            transition: 'border-color 0.2s ease',
            fontFamily: 'Inter, sans-serif',
          }}
          onFocus={e => {
            if (!error && !valid) e.target.style.borderColor = '#6C63FF';
          }}
          onBlur={e => {
            if (!error && !valid) e.target.style.borderColor = '#2A2A38';
            onBlur?.(e);
          }}
        />
        <span style={{ position: 'absolute', right: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5A5A72', display: 'flex', padding: 0 }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}
          {valid && <CheckCircle size={15} style={{ color: '#22C55E' }} />}
          {error && <XCircle size={15} style={{ color: '#EF4444' }} />}
        </span>
      </div>
      {error && <span style={{ color: '#EF4444', fontSize: 12 }}>{error}</span>}
      {hint && !error && <span style={{ color: '#5A5A72', fontSize: 12 }}>{hint}</span>}
    </div>
  );
}
