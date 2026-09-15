import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductivityChart = () => {
  const { progress } = useApp();

  const data = [
    { day: 'Mon', focus: 50, tasks: 2 },
    { day: 'Tue', focus: 75, tasks: 4 },
    { day: 'Wed', focus: 25, tasks: 1 },
    { day: 'Thu', focus: 100, tasks: 5 },
    { day: 'Fri', focus: 60, tasks: 3 },
    { day: 'Sat', focus: 120, tasks: 6 },
    { day: 'Sun', focus: 45, tasks: 2 },
  ];

  const maxFocus = Math.max(...data.map(d => d.focus));

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Weekly Productivity Analytics</h3>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Focus Time (Minutes)</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '150px', gap: '0.75rem', paddingTop: '1rem' }}>
        {data.map((d, idx) => {
          const heightPct = Math.round((d.focus / maxFocus) * 100);
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.focus}m</span>
              <div
                style={{
                  width: '100%',
                  maxWidth: '32px',
                  height: `${heightPct}%`,
                  background: 'linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: '0 0 12px rgba(99, 102, 241, 0.3)',
                  transition: 'height 0.4s ease'
                }}
                title={`${d.day}: ${d.focus} mins focus, ${d.tasks} tasks completed`}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
