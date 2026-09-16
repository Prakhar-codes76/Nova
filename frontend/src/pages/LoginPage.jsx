import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Sparkles, Eye, EyeOff, ArrowRight, CheckCircle2, Bot } from 'lucide-react';

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
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      showToast('Welcome back! Login successful.', 'success');
      await refreshAll();
      navigate('/');
    } catch (err) {
      const msg = err.message || 'Invalid email or password.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--bg-primary)',
      color: 'var(--text-main)',
      overflow: 'hidden'
    }} className="login-split-container">

      {/* LEFT SIDE: Original Fictional NOVA AI Visual */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        background: 'radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0.95) 70%)',
        borderRight: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        {/* Floating Particles */}
        <div className="particle-container">
          <div className="particle" style={{ left: '20%', animationDuration: '7s' }} />
          <div className="particle" style={{ left: '50%', animationDuration: '10s' }} />
          <div className="particle" style={{ left: '80%', animationDuration: '6s' }} />
        </div>

        {/* Fictional NOVA AI Avatar Graphic */}
        <div style={{ position: 'relative', width: '220px', height: '220px', marginBottom: '2.5rem' }} className="nova-avatar-container">
          <div className="nova-avatar-ring ring-idle" style={{ inset: '-25px' }} />
          <div className="nova-avatar-ring ring-speaking" style={{ inset: '-10px' }} />
          
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            border: '2px solid var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 35px rgba(14, 165, 233, 0.35)',
            position: 'relative',
            zIndex: 5
          }}>
            <Bot size={96} color="var(--accent-cyan-light)" />
          </div>
        </div>

        {/* Brand & Text Content */}
        <div style={{ textAlign: 'center', zIndex: 10, maxWidth: '400px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.85rem',
            background: 'rgba(14, 165, 233, 0.1)',
            border: '1px solid rgba(14, 165, 233, 0.25)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--accent-cyan-light)',
            marginBottom: '1rem',
            letterSpacing: '0.08em'
          }}>
            <Sparkles size={14} /> NOVA
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Your AI-Powered Student Life Companion
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            "Plan smarter. Focus better. Achieve more."
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" /> Smart Timetable
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" /> Focus Pomodoro
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" /> Voice Assistant
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Welcome Back Login Form */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Log in to access your Nova student dashboard.
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-rose)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email or Username</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Password</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Password reset link sent to your registered email.', 'info');
                  }}
                  style={{ fontSize: '0.775rem', color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 500 }}
                >
                  Forgot Password?
                </a>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-cyan)', fontWeight: 600, textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .login-split-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
