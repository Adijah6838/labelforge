import { useState, useEffect } from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export function ReviewQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const data = await api.request('/reviews/queue');
      setQueue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const handleAction = async (taskId: number, action: 'approve' | 'reject') => {
    try {
      const formData = new FormData();
      formData.append('action', action);
      const res = await fetch(`http://127.0.0.1:8000/api/reviews/${taskId}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: formData
      });
      if (!res.ok) throw new Error('Failed');
      setQueue(queue.filter(q => q.task_id !== taskId));
    } catch (err) { alert('Action failed'); }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading review queue...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldCheck size={28} color="var(--primary)" />
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Quality Assurance Queue</h1>
      </div>
      {queue.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--success)' }}>Queue is empty!</h3>
          <p style={{ color: 'var(--text-muted)' }}>All submitted annotations have been reviewed.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {queue.map(item => (
            <div key={item.task_id} style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontStyle: 'italic', fontSize: '0.95rem', flex: 1 }}>"{item.content}"</div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Annotator's Label</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>{item.label}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button onClick={() => handleAction(item.task_id, 'approve')} style={{ flex: 1, padding: '10px', backgroundColor: '#d1fae5', color: '#10b981', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}><Check size={18} /> Approve</button>
                <button onClick={() => handleAction(item.task_id, 'reject')} style={{ flex: 1, padding: '10px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}><X size={18} /> Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
