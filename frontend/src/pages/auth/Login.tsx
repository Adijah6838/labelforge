import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { Boxes } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Left Branding Panel */}
      <div style={{ flex: 1, backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Boxes size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 700 }}>LabelForge</h1>
        </div>
        <h2 style={{ fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '24px' }}>
          AI Data Annotation & Quality Management.
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#94a3b8', lineHeight: 1.6 }}>
          Streamline your annotation pipeline, manage quality assurance, and track worker performance all in one centralized platform.
        </p>
      </div>

      {/* Right Form Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Enter your credentials to access your workspace.</p>

          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Email address</label>
              <input 
                type="email" 
                {...register('email')} 
                placeholder="admin@labelforge.com"
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }} 
              />
              {errors.email && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Password</label>
              <input 
                type="password" 
                {...register('password')} 
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }} 
              />
              {errors.password && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px' }}>{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ padding: '12px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '1rem', marginTop: '8px', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          
          <div style={{ marginTop: '32px', padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Demo Credentials</p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>Email: <strong>admin@labelforge.com</strong></p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>Password: <strong>admin123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
