import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Clock, BookOpen, AlertCircle, Sparkles, Flame, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export const NotificationsPage = () => {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      showToast('Notification marked as read', 'success');
    } catch (err) {
      showToast('Failed to update notification', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      showToast('Failed to update notifications', 'error');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'class_reminder':
        return <BookOpen size={18} color="var(--accent-cyan-light)" />;
      case 'study_reminder':
        return <Clock size={18} color="var(--accent-amber)" />;
      case 'task_reminder':
        return <AlertCircle size={18} color="var(--accent-indigo)" />;
      case 'focus_session':
        return <Flame size={18} color="var(--accent-rose)" />;
      default:
        return <Sparkles size={18} color="var(--accent-emerald)" />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Notification Center 🔔</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Class reminders, study sessions, focus alerts, and AI assistant notifications.
          </p>
        </div>

        {notifications.some(n => !n.is_read) && (
          <button onClick={handleMarkAllRead} className="btn btn-secondary">
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Bell size={36} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>No Notifications</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            You're all caught up! Scheduled study reminders will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((note) => (
            <div
              key={note.id}
              className="glass-panel"
              style={{
                padding: '1.1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                borderLeft: note.is_read ? '3px solid transparent' : '3px solid var(--accent-cyan)',
                background: note.is_read ? 'var(--bg-card)' : 'rgba(14, 165, 233, 0.05)'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getIcon(note.type)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{note.title}</h4>
                    {!note.is_read && (
                      <span className="badge badge-cyan">New</span>
                    )}
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {note.message}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.65rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      {new Date(note.created_at).toLocaleString()}
                    </span>

                    {note.action_type === 'start_focus' && (
                      <button
                        onClick={() => navigate('/focus')}
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.775rem' }}
                      >
                        Start Focus
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!note.is_read && (
                <button
                  onClick={() => handleMarkRead(note.id)}
                  title="Mark as Read"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <Check size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
