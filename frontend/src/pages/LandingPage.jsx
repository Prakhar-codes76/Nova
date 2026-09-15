import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Mic, BrainCircuit, Shield } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="cinematic-bg" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Background Glowing Orb */}
      <div className="cinematic-orb" />

      {/* Header */}
      <header style={{
        padding: '1.5rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>NOVA</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn btn-secondary" style={{ borderRadius: 'var(--radius-full)' }}>
            Login
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
            Create Account
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        zIndex: 10,
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid var(--border-glow)',
          color: 'var(--accent-cyan)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} /> NEXT-GEN AI STUDENT ASSISTANT
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.1,
          marginBottom: '1rem',
          textShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}>
          NOVA
        </h1>

        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #fff, var(--text-muted))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Your AI Student Life Assistant
        </h2>

        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-muted)',
          maxWidth: '650px',
          marginBottom: '2.5rem',
          lineHeight: 1.6
        }}>
          Plan smarter. Stay focused. Get things done.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem', borderRadius: 'var(--radius-full)' }}>
            Get Started Free <ArrowRight size={18} />
          </Link>

          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', borderRadius: 'var(--radius-full)' }}>
            Existing Student Login
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginTop: '4rem',
          width: '100%'
        }}>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <Mic size={24} color="var(--accent-cyan)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Nova AI Voice Assistant</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Natural voice commands executing real database tasks & schedule updates.</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <BrainCircuit size={24} color="var(--accent-primary)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>AI Study Roadmap</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Custom day-by-day exam schedules avoiding timetable conflicts.</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <Shield size={24} color="var(--accent-emerald)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Authenticated Privacy</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Secure password hashing & isolated per-user dataset architecture.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
