import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Database, Users, LineChart, FileText, LogOut, PenTool, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore(state => state.logout);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: PenTool, label: 'Workspace', path: '/dashboard/workspace' },
    { icon: ShieldCheck, label: 'Review Queue', path: '/dashboard/review' },
    { icon: FolderKanban, label: 'Projects', path: '/dashboard/projects' },
    { icon: Database, label: 'Datasets', path: '/dashboard/datasets' },
    { icon: Users, label: 'Workers', path: '/dashboard/workers' },
    { icon: LineChart, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: FileText, label: 'Audit Logs', path: '/dashboard/audit-logs' },
  ];

  return (
    <aside style={{ width: '260px', backgroundColor: '#0f172a', color: '#f8fafc', height: '100vh', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0 }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>LF</div>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>LabelForge</h2>
      </div>
      <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-sm)',
              color: isActive ? '#fff' : '#94a3b8', backgroundColor: isActive ? '#1e293b' : 'transparent', textDecoration: 'none', transition: 'all 0.2s'
            }}>
              <item.icon size={20} />
              <span style={{ fontWeight: 500 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: '24px 16px', borderTop: '1px solid #1e293b' }}>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', width: '100%', color: '#ef4444', borderRadius: 'var(--radius-sm)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <LogOut size={20} /> <span style={{ fontWeight: 500 }}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
