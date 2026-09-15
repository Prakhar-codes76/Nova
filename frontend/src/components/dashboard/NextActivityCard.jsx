import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NextActivityCard = () => {
  const { nextActivity } = useApp();

  if (!nextActivity) {
    return (
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>NEXT ACTIVITY</h3>
        <p style={{ color: '#fff', fontWeight: 600 }}>No more scheduled classes for today! 🎉</p>
      </div>
    );
  }

  return (
    <div className="glass-panel glass-panel-glow" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
            UPCOMING CLASS ({nextActivity.day})
          </span>
        </div>
        <span className="badge badge-low">Live Schedule</span>
      </div>

      <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
        {nextActivity.subject}
      </h2>

      <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={15} color="var(--accent-amber)" />
          <span>{nextActivity.time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={15} color="var(--accent-rose)" />
          <span>Room: {nextActivity.room}</span>
        </div>
      </div>
    </div>
  );
};
