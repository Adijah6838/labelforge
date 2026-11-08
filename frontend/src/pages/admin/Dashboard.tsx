export function Dashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {/* We will put the StatCards here in the next step */}
        <div style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 8px 0' }}>Total Projects</p>
          <h2 style={{ fontSize: '1.75rem', margin: 0 }}>5</h2>
        </div>
      </div>
    </div>
  );
}
