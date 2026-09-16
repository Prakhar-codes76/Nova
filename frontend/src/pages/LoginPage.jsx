import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.78 15.73 17.56V20.31H19.29C21.37 18.39 22.56 15.57 22.56 12.25Z" fill="#4285F4"/>
    <path d="M12 23C14.97 23 17.46 22.02 19.29 20.31L15.73 17.56C14.74 18.23 13.48 18.63 12 18.63C9.14 18.63 6.72 16.7 5.85 14.11H2.17V16.96C3.99 20.57 7.7 23 12 23Z" fill="#34A853"/>
    <path d="M5.85 14.11C5.63 13.45 5.5 12.74 5.5 12C5.5 11.26 5.63 10.55 5.85 9.89V7.04H2.17C1.43 8.52 1 10.21 1 12C1 13.79 1.43 15.48 2.17 16.96L5.85 14.11Z" fill="#FBBC05"/>
    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.02L19.38 3.84C17.46 2.05 14.97 1 12 1C7.7 1 3.99 3.43 2.17 7.04L5.85 9.89C6.72 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.42 12.21C16.42 9.07 18.99 7.54 19.11 7.46C17.65 5.33 15.39 5.01 14.59 4.9C12.63 4.7 10.74 6.05 9.74 6.05C8.75 6.05 7.18 4.9 5.55 4.93C3.42 4.96 1.45 6.17 0.36 8.08C-1.85 11.93 0.81 17.62 2.97 20.73C4.01 22.25 5.22 23.95 6.84 23.89C8.4 23.83 8.98 22.88 10.87 22.88C12.75 22.88 13.27 23.89 14.88 23.86C16.54 23.83 17.58 22.31 18.6 20.78C19.79 19.04 20.28 17.34 20.3 17.25C20.25 17.23 16.42 15.78 16.42 12.21ZM13.84 3.23C14.7 2.19 15.28 0.77 15.12 -0.5C14.04 -0.46 12.56 0.22 11.66 1.25C10.87 2.15 10.18 3.63 10.38 4.88C11.59 4.97 12.98 4.27 13.84 3.23Z" />
  </svg>
);

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
    <div className="login-page-container">
      {/* Cinematic Background Layer */}
      <div 
        className="login-background-mesh"
        style={{ backgroundImage: 'url("/assets/nova-login.jpg")' }}
      />

      {/* Dark Purple/Blue Ambient Overlay & Particle glow */}
      <div className="vfx-radial-overlay" />
      <div className="vfx-particle particle-1" />
      <div className="vfx-particle particle-2" />
      <div className="vfx-particle particle-3" />

      {/* Glassmorphism Login Card */}
      <div className="login-glass-card page-fade-in">
        <div className="login-logo-container">
          <div className="nova-logo-glow" style={{ position: 'relative' }}>
            <img 
              src="/assets/nova-logo.jpg" 
              alt="NOVA Logo" 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(14, 165, 233, 0.5)',
                boxShadow: '0 0 25px rgba(14, 165, 233, 0.5), 0 0 45px rgba(99, 102, 241, 0.4)'
              }}
            />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ffffff 0%, var(--accent-cyan-light) 50%, var(--accent-indigo) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            marginTop: '0.5rem'
          }}>
            Welcome to NOVA
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Next-Gen AI Student Life Assistant
          </p>
        </div>

        {error && (
          <div className="alert-error" style={{ width: '100%' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="email"
              className="form-input"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Password"
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

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem', marginTop: '-0.5rem', paddingLeft: '0.25rem' }}>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                showToast('Password reset link sent.', 'info');
              }}
              className="forgot-link"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              fontSize: '1rem',
              fontWeight: 700
            }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="social-login-divider">
          <span>or log in with</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn" onClick={() => showToast('Google login coming soon', 'info')}>
            <GoogleIcon />
          </button>
          <button className="social-btn" onClick={() => showToast('Apple login coming soon', 'info')}>
            <AppleIcon />
          </button>
        </div>

        <div className="login-footer">
          Don't have an account?{' '}
          <Link to="/register" className="register-link">
            Create Account
          </Link>
        </div>
      </div>

      <div className="support-button-container">
        <button className="support-btn" onClick={() => showToast('Support chat coming soon', 'info')}>
          <div className="support-avatar" />
          Support
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
