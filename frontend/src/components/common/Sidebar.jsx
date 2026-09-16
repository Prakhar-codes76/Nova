import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Sparkles, 
  Timer, 
  BarChart3, 
  User, 
  MessageSquare,
  Bell,
  Settings,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/timetable', label: 'Timetable', icon: Calendar },
    { path: '/focus', label: 'Focus Mode', icon: Timer },
    { path: '/progress', label: 'Analytics & Progress', icon: BarChart3 },
    { path: '/assistant', label: 'AI Assistant', icon: MessageSquare },
  ];

  const bottomNavItems = [
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src="/assets/nova-logo.jpg" 
              alt="NOVA Logo" 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1.5px solid rgba(14, 165, 233, 0.5)',
                boxShadow: '0 0 15px rgba(14, 165, 233, 0.4), 0 0 30px rgba(99, 102, 241, 0.2)'
              }}
            />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1, fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
              NOVA
            </h2>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan-light)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Student Life Assistant
            </span>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Main Navigation Group */}
      <div style={{ fontSize: '0.675rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', paddingLeft: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        Main Workspace
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {mainNavItems.map((item) => {
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
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.15), rgba(99, 102, 241, 0.08))' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 20px rgba(14, 165, 233, 0.15)' : 'none'
              })}
            >
              <Icon size={18} color={item.path === '/assistant' ? 'var(--accent-cyan-light)' : 'currentColor'} />
              <span>{item.label}</span>
              {item.path === '/assistant' && (
                <span className="badge badge-cyan" style={{ marginLeft: 'auto', fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  AI 🎙️
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '0.5rem 0' }} />

      {/* Account & Settings Group */}
      <div style={{ fontSize: '0.675rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', paddingLeft: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        Account & System
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                background: isActive ? 'rgba(124, 92, 255, 0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-purple)' : '3px solid transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Card at Bottom */}
      <div style={{
        marginTop: 'auto',
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#fff',
            flexShrink: 0
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Student'}
            </h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.course || user?.college || 'B.Tech CSE'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Log out"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#f43f5e'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
