import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Projects } from './pages/admin/Projects';
import { Datasets } from './pages/admin/Datasets';
import { Analytics } from './pages/admin/Analytics';
import { Workspace } from './pages/annotator/Workspace';
import { ReviewQueue } from './pages/reviewer/ReviewQueue';
import { AdminLayout } from './layouts/AdminLayout';
import { useAuthStore } from './store/authStore';
import './App.css';

function App() {
  const { token, fetchMe } = useAuthStore();
  useEffect(() => { if (token) fetchMe(); }, [token, fetchMe]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route element={token ? <AdminLayout /> : <Navigate to="/login" replace />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/workspace" element={<Workspace />} />
          <Route path="/dashboard/review" element={<ReviewQueue />} />
          <Route path="/dashboard/projects" element={<Projects />} />
          <Route path="/dashboard/datasets" element={<Datasets />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/*" element={<div style={{ padding: '24px' }}>Module under construction...</div>} />
        </Route>
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
