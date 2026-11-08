import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Navbar() {
  const user = useAuthStore(state => state.user);

  return (
    <header style={{ height: '64px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-main)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', width: '300px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input type="text" placeholder="Search projects, tasks..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', color: 'var(--text-muted)' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%' }}></span>
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.full_name.charAt(0)}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>{user?.full_name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
