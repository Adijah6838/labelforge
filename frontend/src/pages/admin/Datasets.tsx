import { useState, useEffect } from 'react';
import { Upload, Database } from 'lucide-react';
import { api } from '../../services/api';

export function Datasets() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [selectedProject, setSelectedProject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    try {
      const [ds, proj] = await Promise.all([
        api.request('/datasets'),
        api.request('/projects')
      ]);
      setDatasets(ds);
      setProjects(proj);
      if (proj.length > 0 && !selectedProject) setSelectedProject(proj[0].id.toString());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedProject) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', selectedProject);

    try {
      // Note: We can't use the standard api.request because it sets Content-Type to application/json
      const res = await fetch('http://127.0.0.1:8000/api/datasets/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      setFile(null);
      fetchData(); // refresh list
    } catch (err) {
      console.error(err);
      alert('Upload failed. Make sure it is a valid CSV.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Dataset Management</h1>
      </div>

      {/* Upload Section */}
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Upload New Dataset (CSV)</h3>
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Assign to Project</label>
            <select 
              value={selectedProject} onChange={e => setSelectedProject(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '8px' }}>CSV File</label>
            <input 
              type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] || null)}
              style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
            />
          </div>
          <button type="submit" disabled={isUploading || !file} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 500, opacity: (isUploading || !file) ? 0.5 : 1 }}>
            <Upload size={18} /> {isUploading ? 'Uploading...' : 'Upload Dataset'}
          </button>
        </form>
      </div>

      {/* List Section */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px', fontWeight: 600 }}>Dataset Name</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Project ID</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Records</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Imported At</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map(ds => (
              <tr key={ds.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#10b98120', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Database size={18} />
                    </div>
                    <span style={{ fontWeight: 500 }}>{ds.name}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{ds.project_id}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ backgroundColor: 'var(--bg-main)', padding: '4px 10px', borderRadius: '999px', fontWeight: 600, fontSize: '0.875rem' }}>
                    {ds.total_records}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {new Date(ds.imported_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
