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
  Bell,
  Settings,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { setIsVoiceOpen } = useApp();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'My Tasks', icon: CheckSquare },
    { path: '/timetable', label: 'Timetable', icon: Calendar },
    { path: '/study-planner', label: 'AI Planner', icon: BrainCircuit },
    { path: '/assistant', label: 'NOVA Assistant', icon: MessageSquare },
    { path: '/focus', label: 'Focus Mode', icon: Timer },
    { path: '/progress', label: 'Analytics & Progress', icon: BarChart3 },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const sidebarStyle = {
    width: '260px',
    background: 'rgba(15, 23, 42, 0.98)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.25rem 1rem',
    gap: '1.25rem',
    flexShrink: 0,
    zIndex: 100,
    maxHeight: '100vh',
    overflowY: 'auto'
  };

  return (
    <aside className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`} style={sidebarStyle}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src="/assets/nova-logo.jpg" 
            alt="NOVA Logo" 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '1px solid rgba(14, 165, 233, 0.4)',
              boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)'
            }}
          />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>NOVA</h2>
            <span style={{ fontSize: '0.675rem', color: 'var(--accent-cyan-light)', fontWeight: 600, letterSpacing: '0.06em' }}>
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
        className="btn btn-primary" 
        style={{
          width: '100%',
          borderRadius: 'var(--radius-full)',
          padding: '0.65rem',
          fontSize: '0.85rem',
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
        }}
      >
        <Mic size={16} />
        Talk to Nova 🎙️
      </button>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                background: isActive ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.85rem',
                transition: 'all 0.15s ease'
              })}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
