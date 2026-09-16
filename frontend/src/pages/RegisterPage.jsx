import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Sparkles, Eye, EyeOff, ArrowRight, Bot, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast, refreshAll } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register(name.trim(), email.trim(), password);
      showToast('Account created successfully!', 'success');
      await refreshAll();
      navigate('/profile-setup');
    } catch (err) {
      const msg = err.message || 'Registration failed.';
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

      {/* LEFT SIDE: Original Fictional NOVA Visual */}
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
        {/* Particles */}
        <div className="particle-container">
          <div className="particle" style={{ left: '15%', animationDuration: '8s' }} />
          <div className="particle" style={{ left: '45%', animationDuration: '11s' }} />
          <div className="particle" style={{ left: '75%', animationDuration: '6s' }} />
        </div>

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
            Elevate Your Student Experience
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            "Plan smarter. Focus better. Achieve more."
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" /> Free Setup
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" /> AI Productivity
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="var(--accent-emerald)" /> Voice Companion
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Register Form */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Join Nova to personalize your student timetable & AI study goals.
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
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. rahul@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Continue to Personalization'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-cyan)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
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
