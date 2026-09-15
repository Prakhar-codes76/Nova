import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BrainCircuit, 
  Timer, 
  BarChart3, 
  User, 
  Mic, 
  MessageSquare,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { setIsVoiceOpen } = useApp();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tasks & Routine', icon: CheckSquare },
    { path: '/timetable', label: 'Timetable', icon: Calendar },
    { path: '/ai-chat', label: 'Nova AI Chat', icon: MessageSquare },
    { path: '/study-planner', label: 'Study Planner', icon: BrainCircuit },
    { path: '/focus', label: 'Focus Mode', icon: Timer },
    { path: '/progress', label: 'Progress Analytics', icon: BarChart3 },
    { path: '/profile', label: 'Profile Settings', icon: User },
  ];

  const sidebarStyle = {
    width: '260px',
    background: 'rgba(15, 23, 42, 0.98)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.25rem 1rem',
    gap: '1.5rem',
    flexShrink: 0,
    zIndex: 100,
  };

  return (
    <aside className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`} style={sidebarStyle}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>NOVA</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.05em' }}>
              STUDENT ASSISTANT
            </span>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="mobile-close-btn" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Voice Assistant Trigger */}
      <button 
        onClick={() => {
          setIsVoiceOpen(true);
          if (onClose) onClose();
        }}
        className="btn btn-voice" 
        style={{ width: '100%', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.9rem' }}
      >
        <Mic size={18} />
        Talk to Nova 🎙️
      </button>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.15s ease'
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
