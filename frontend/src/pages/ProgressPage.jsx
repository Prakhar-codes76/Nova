import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';
import { BarChart3, CheckCircle2, Clock, AlertTriangle, Flame } from 'lucide-react';

export const ProgressPage = () => {
  const { tasks, progress } = useApp();

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const delayed = tasks.filter(t => t.status === 'delayed').length;
  const rate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0.0';

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Progress & Performance Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real database analytics based on your activity.</p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>COMPLETION RATE</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.25rem' }}>{rate}%</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TASKS COMPLETED</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>{completed}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PENDING TASKS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '0.25rem' }}>{pending}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MISSED / DELAYED</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '0.25rem' }}>{delayed}</div>
        </div>
      </div>

      <ProductivityChart />
    </div>
  );
};
