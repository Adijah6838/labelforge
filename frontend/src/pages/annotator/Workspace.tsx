import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export function Workspace() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await api.request('/tasks');
      setTasks(data);
      setCurrentIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleAnnotate = async (label: string) => {
    const currentTask = tasks[currentIndex];
    try {
      await api.request('/annotations', {
        method: 'POST',
        body: JSON.stringify({ task_id: currentTask.id, record_id: currentTask.record_id, label, notes: '' })
      });
      const newTasks = tasks.filter((_, i) => i !== currentIndex);
      setTasks(newTasks);
      if (currentIndex >= newTasks.length) setCurrentIndex(Math.max(0, newTasks.length - 1));
    } catch (err) {
      alert('Failed to submit annotation');
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading tasks...</div>;
  if (tasks.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '16px' }} />
      <h2>All tasks completed!</h2>
      <p style={{ color: 'var(--text-muted)' }}>You have no pending annotations at the moment.</p>
    </div>
  );

  const task = tasks[currentIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Annotation Workspace</h1>
        <span style={{ backgroundColor: 'var(--primary)', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600 }}>
          Task {currentIndex + 1} of {tasks.length}
        </span>
      </div>
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Source Content</h3>
        <div style={{ padding: '24px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '32px' }}>
          "{task.content}"
        </div>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Select Label</h3>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => handleAnnotate('Positive')} style={{ flex: 1, padding: '16px', backgroundColor: '#d1fae5', color: '#10b981', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Positive</button>
          <button onClick={() => handleAnnotate('Neutral')} style={{ flex: 1, padding: '16px', backgroundColor: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Neutral</button>
          <button onClick={() => handleAnnotate('Negative')} style={{ flex: 1, padding: '16px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Negative</button>
        </div>
      </div>
    </div>
  );
}
