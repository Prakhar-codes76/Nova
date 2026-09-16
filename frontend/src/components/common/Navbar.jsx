import React, { useState, useEffect } from 'react';
import { Search, Menu, UserCheck, LogOut, Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const Navbar = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications');
        const unread = res.data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      } catch (err) {
        // silent
      }
    };
    fetchUnread();
  }, []);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      try {
        const res = await api.get('/search', { params: { q: val } });
        setSearchResults(res.data.results);
      } catch (err) {
        setSearchResults(null);
      }
    } else {
      setSearchResults(null);
    }
  };

  const displayName = user?.name || 'Student';
  const displayCollege = user?.college || 'Nova Academy';
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '1.25rem',
      borderBottom: '1px solid var(--border-color)',
      marginBottom: '1.5rem',
      position: 'relative',
      gap: '1rem'
    }}>
      {/* Mobile Drawer Trigger */}
      <button 
        onClick={onToggleMobileSidebar}
        className="mobile-menu-btn"
        style={{
          display: 'none',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid var(--border-color)',
          color: '#fff',
          borderRadius: 'var(--radius-sm)',
          padding: '0.45rem',
          cursor: 'pointer'
        }}
      >
        <Menu size={20} />
      </button>

      {/* Global Search Bar */}
      <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-full)',
          padding: '0.45rem 1rem',
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search tasks, timetable, subjects..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.85rem',
              width: '100%'
            }}
          />
        </div>

        {/* Search Results Dropdown */}
        {searchResults && (
          <div className="glass-panel" style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            zIndex: 100,
            padding: '1rem',
            background: 'rgba(15, 23, 42, 0.98)',
            maxHeight: '280px',
            overflowY: 'auto'
          }}>
            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>TASKS MATCHES</h4>
            {searchResults.tasks.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>No tasks found</p>
            ) : (
              searchResults.tasks.map(t => (
                <div key={t.id} style={{ padding: '0.35rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <strong>{t.title}</strong> <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>({t.subject})</span>
                </div>
              ))
            )}

            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.75rem 0 0.5rem' }}>SCHEDULE MATCHES</h4>
            {searchResults.schedule.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>No schedule entries found</p>
            ) : (
              searchResults.schedule.map(s => (
                <div key={s.id} style={{ padding: '0.35rem 0', fontSize: '0.85rem' }}>
                  <strong>{s.subject}</strong> — {s.day} ({s.time})
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Date, Notifications, Settings, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {/* Date Display */}
        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {currentDateFormatted}
        </div>

        {/* Notification Icon Badge */}
        <button
          onClick={() => navigate('/notifications')}
          title="Notifications"
          style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: 'var(--accent-rose)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => navigate('/settings')}
          title="Settings"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
        >
          <Settings size={18} />
        </button>

        {/* Profile Avatar */}
        <div
          onClick={() => navigate('/profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#fff',
            boxShadow: '0 0 10px rgba(14, 165, 233, 0.3)'
          }}>
            {displayName.charAt(0)}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Logout"
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
