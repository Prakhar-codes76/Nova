import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast, refreshAll } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      showToast('Welcome back! Neural connection established. 🚀', 'success');
      await refreshAll();
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || 'Invalid credentials. Please verify email and password.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '1.5rem',
      background: 'radial-gradient(circle at center, rgba(124, 92, 255, 0.15), rgba(3, 5, 12, 0.95) 70%)'
    }}>
      {/* Background Image Mesh */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url("/assets/nova-login.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.25,
        filter: 'brightness(0.6) contrast(1.2)',
        zIndex: 0
      }} />

      {/* Dark Vignette Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(3, 5, 12, 0.4) 0%, rgba(3, 5, 12, 0.92) 80%)',
        zIndex: 1
      }} />

      {/* Glassmorphism Login Card */}
      <div className="page-fade-in" style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2.25rem',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7), 0 0 50px rgba(124, 92, 255, 0.2), inset 0 1px rgba(255, 255, 255, 0.12)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            position: 'relative',
            display: 'inline-block',
            marginBottom: '1rem'
          }}>
            <img 
              src="/assets/nova-logo.jpg" 
              alt="NOVA Logo" 
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '22px',
                objectFit: 'cover',
                border: '2px solid rgba(14, 165, 233, 0.5)',
                boxShadow: '0 0 30px rgba(14, 165, 233, 0.5), 0 0 60px rgba(99, 102, 241, 0.3)'
              }}
            />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
            marginBottom: '0.35rem'
          }}>
            Welcome to <span className="gradient-text">NOVA</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 400 }}>
            Advanced AI Student Life Assistant
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Email Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email or Student ID
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', pointerEvents: 'none' }} />
              <input
                type="text"
                className="form-input"
                placeholder="prakhar.cse@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Demo login: prakhar.cse@college.edu / Password123!', 'info');
                }}
                style={{ fontSize: '0.775rem', color: 'var(--accent-cyan-light)', textDecoration: 'none', fontWeight: 500 }}
              >
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', pointerEvents: 'none' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.85rem', background: 'transparent', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.95rem',
              fontWeight: 700,
              width: '100%',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
              boxShadow: '0 4px 25px rgba(14, 165, 233, 0.4)'
            }}
          >
            {loading ? 'Authenticating...' : (
              <>
                Sign In to NOVA <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Hint */}
        <div style={{
          marginTop: '1.25rem',
          padding: '0.65rem 0.85rem',
          background: 'rgba(14, 165, 233, 0.08)',
          border: '1px dashed rgba(14, 165, 233, 0.3)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          fontSize: '0.775rem',
          color: 'var(--accent-cyan-light)'
        }}>
          💡 Demo Account: <strong>prakhar.cse@college.edu</strong> / <strong>Password123!</strong>
        </div>

        {/* Footer Navigation */}
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          Don't have a NOVA account?{' '}
          <Link to="/register" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
