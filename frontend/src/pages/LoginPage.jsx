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
    <div className="login-split-container">
      {/* LEFT SIDE: Premium Branding */}
      <div className="login-brand-side">
        <div className="brand-mesh-1"></div>
        <div className="brand-mesh-2"></div>
        
        <div className="brand-content-wrapper">
          <div className="brand-logo-pill">
            <Sparkles size={14} /> <span>NOVA OS</span>
          </div>

          <h1 className="brand-hero-text">
            Master your<br/>academic life.
          </h1>
          <p className="brand-sub-text">
            Your intelligent student workspace. Organize tasks, optimize your schedule, and enter deep focus effortlessly.
          </p>

          <div className="brand-feature-list">
            <div className="feature-item">
              <div className="feature-icon-wrapper cyan">
                <CheckCircle2 size={20} />
              </div>
              <div className="feature-text">
                <h4>Smart Organization</h4>
                <p>Unified dashboard for tasks and classes.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper emerald">
                <Bot size={20} />
              </div>
              <div className="feature-text">
                <h4>AI Companion</h4>
                <p>Voice-enabled study assistant at your command.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Welcome Back Login Form */}
      <div className="login-form-side">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Log in to access your Nova workspace.</p>
          </div>

          {error && (
            <div className="alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="input-label">Email or Username</label>
              <input
                type="email"
                className="form-input"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <div className="input-label-row">
                <label className="input-label">Password</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Password reset link sent.', 'info');
                  }}
                  className="forgot-link"
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
              className="btn btn-primary login-submit-btn"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="login-footer">
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
