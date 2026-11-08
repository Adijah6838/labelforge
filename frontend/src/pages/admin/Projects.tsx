import { useState, useEffect } from 'react';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { api } from '../../services/api';

export function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Text Classification');

  const fetchProjects = async () => {
    try {
      const data = await api.request('/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.request('/projects', {
        method: 'POST',
        body: JSON.stringify({ name, description, category, status: 'active' })
      });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Project Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 500, border: 'none', cursor: 'pointer' }}
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', outline: 'none' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px', fontWeight: 600 }}>Project Name</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No projects found.</td>
              </tr>
            ) : (
              filteredProjects.map(project => (
                <tr key={project.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#4f46e520', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FolderKanban size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{project.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{project.description}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.875rem' }}>{project.category}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                      backgroundColor: project.status === 'active' ? '#d1fae5' : '#f3f4f6',
                      color: project.status === 'active' ? '#10b981' : '#6b7280',
                      textTransform: 'capitalize'
                    }}>
                      {project.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {new Date(project.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '32px', borderRadius: 'var(--radius-md)', width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Create New Project</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Project Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                  <option value="Text Classification">Text Classification</option>
                  <option value="Sentiment Analysis">Sentiment Analysis</option>
                  <option value="Named Entity Recognition">Named Entity Recognition</option>
                  <option value="Audio Transcription">Audio Transcription</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
