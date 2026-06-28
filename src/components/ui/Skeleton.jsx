export function Skeleton({ width = '100%', height = 16, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 4, ...style }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      background: '#111118',
      border: '1px solid #2A2A38',
      borderRadius: 8,
      padding: 20,
    }}>
      <Skeleton width="40%" height={12} style={{ marginBottom: 12 }} />
      <Skeleton width="60%" height={28} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={12} />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div style={{
      display: 'flex',
      gap: 16,
      padding: '14px 0',
      borderBottom: '1px solid #2A2A38',
      alignItems: 'center',
    }}>
      <Skeleton width={32} height={32} style={{ borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <Skeleton width="40%" height={13} style={{ marginBottom: 6 }} />
        <Skeleton width="70%" height={11} />
      </div>
      <Skeleton width={80} height={24} />
    </div>
  );
}
