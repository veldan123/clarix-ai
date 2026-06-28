export default function Toggle({ checked, onChange, label, description, disabled }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        padding: '14px 0',
        borderBottom: '1px solid #2A2A38',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div>
        <div style={{ color: '#F0F0F5', fontSize: 14, fontWeight: 500 }}>{label}</div>
        {description && <div style={{ color: '#5A5A72', fontSize: 13, marginTop: 2 }}>{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          background: checked ? '#6C63FF' : '#2A2A38',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          transition: 'background 0.2s ease',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 23 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        />
      </button>
    </div>
  );
}
