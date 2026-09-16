import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';

// SVG Icons for social login
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
    <div className="login-page-container">
      {/* Blurred background image layer */}
      <div 
        className="login-background-mesh"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1633511119567-96a93b482260?q=80&w=2000&auto=format&fit=crop")' }}
      ></div>

      <div className="login-glass-card">
        <div className="login-logo-container" style={{ marginBottom: '1.5rem' }}>
          <div className="nova-logo-glow" style={{ width: 48, height: 48, marginBottom: '1rem' }}>
            <div className="nova-logo-glow-inner">
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}></div>
            </div>
          </div>
          <h2>Create Account</h2>
        </div>

        {error && (
          <div className="alert-error" style={{ width: '100%', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              className="form-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Create Password"
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

          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Continue to Personalization'}
          </button>
        </form>

        <div className="social-login-divider">
          <span>or sign up with</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn" onClick={() => showToast('Google sign up coming soon', 'info')}>
            <GoogleIcon />
          </button>
          <button className="social-btn" onClick={() => showToast('Apple sign up coming soon', 'info')}>
            <AppleIcon />
          </button>
        </div>

        <div className="login-footer">
          Already have an account?{' '}
          <Link to="/login" className="register-link">
            Sign In
          </Link>
        </div>
      </div>

      <div className="support-button-container">
        <button className="support-btn" onClick={() => showToast('Support chat coming soon', 'info')}>
          <div className="support-avatar"></div>
          Support
        </button>
      </div>
    </div>
  );
};
