import React from 'react';
import { CheckCircle2, Clock, BookOpen, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OverviewCards = () => {
  const { tasks, progress } = useApp();

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const focusMins = progress?.total_focus_time_minutes || 75;
  const studyHours = ((completedCount * 45 + focusMins) / 60).toFixed(1);

  const cards = [
    { title: 'Pending Tasks', value: pendingCount, icon: Clock, color: 'var(--accent-amber)' },
    { title: 'Completed Tasks', value: completedCount, icon: CheckCircle2, color: 'var(--accent-emerald)' },
    { title: 'Est. Study Time', value: `${studyHours} hrs`, icon: BookOpen, color: 'var(--accent-cyan)' },
    { title: 'Total Focus Time', value: `${focusMins} mins`, icon: Flame, color: 'var(--accent-rose)' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.75rem'
    }}>
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{c.title}</span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: `rgba(${c.color === 'var(--accent-amber)' ? '245, 158, 11' : c.color === 'var(--accent-emerald)' ? '16, 185, 129' : c.color === 'var(--accent-cyan)' ? '6, 182, 212' : '244, 63, 94'}, 0.15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={18} color={c.color} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{c.value}</div>
          </div>
        );
      })}
    </div>
  );
};
