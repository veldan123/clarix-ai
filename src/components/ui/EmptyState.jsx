import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      gap: 12,
    }}>
      {Icon && (
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: 'rgba(108,99,255,0.1)',
          border: '1px solid rgba(108,99,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}>
          <Icon size={24} style={{ color: '#6C63FF' }} />
        </div>
      )}
      <div style={{ color: '#F0F0F5', fontSize: 16, fontWeight: 600 }}>{title}</div>
      {description && (
        <div style={{ color: '#5A5A72', fontSize: 14, maxWidth: 360, lineHeight: 1.5 }}>{description}</div>
      )}
      {action && (
        <div style={{ marginTop: 8 }}>
          <Button onClick={action}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
