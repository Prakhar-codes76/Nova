import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Flame, 
  TrendingUp, 
  Award, 
  Calendar,
  Sparkles,
  Info,
  Zap
} from 'lucide-react';
import api from '../services/api';

export const ProgressPage = () => {
  const { tasks } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProgressData = async () => {
    try {
      const res = await api.get('/progress');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, [tasks]);

  const summary = data?.summary || {};
  const consistency = data?.consistency || {};
  const productivityScore = data?.productivity_score ?? 0;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Productivity & Study Analytics 📊</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Real database performance metrics, focus duration, and study consistency tracking.
        </p>
      </div>

      {/* Row 1: Productivity Score & Study Consistency */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', marginBottom: '1.75rem' }} className="analytics-top-grid">
        
        {/* Productivity Score Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              MY PRODUCTIVITY SCORE
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.12)' }}>
              <Zap size={20} color="var(--accent-cyan-light)" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
              {productivityScore}%
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              {productivityScore >= 70 ? 'High Performance' : productivityScore >= 40 ? 'Moderate Progress' : 'Building Momentum'}
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Based on your study activity, tasks and focus sessions.
          </p>
        </div>

        {/* Study Consistency Card */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Flame size={22} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Study Consistency</h3>
            </div>
            <span className="badge badge-amber">{consistency.current_streak || 0} Day Streak 🔥</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }} className="consistency-stats-grid">
            <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>CURRENT STREAK</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{consistency.current_streak || 0} Days</div>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>LONGEST STREAK</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan-light)' }}>{consistency.longest_streak || 0} Days</div>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>ACTIVE DAYS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{consistency.active_days || 0}</div>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>MONTHLY CONSISTENCY</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{consistency.monthly_consistency || 0}%</div>
            </div>
          </div>

          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-subtle)', textAlign: 'center' }}>
            Keep building your study routine to maintain long-term focus habits.
          </p>
        </div>
      </div>

      {/* Row 2: Productivity Summary Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.75rem' }} className="summary-cards-grid">
        
        {/* TODAY */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan-light)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            TODAY SUMMARY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Study Time</span>
              <strong style={{ color: '#fff' }}>{summary.today_study_minutes || 0} mins</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tasks Completed</span>
              <strong style={{ color: '#fff' }}>{summary.today_tasks_completed || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Focus Sessions</span>
              <strong style={{ color: '#fff' }}>{summary.today_focus_sessions || 0}</strong>
            </div>
          </div>
        </div>

        {/* THIS WEEK */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            THIS WEEK SUMMARY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Focus Time</span>
              <strong style={{ color: '#fff' }}>{summary.total_focus_time_minutes || 0} mins</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tasks Completed</span>
              <strong style={{ color: '#fff' }}>{summary.tasks_completed || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Completion Rate</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>{summary.completion_rate_percentage || 0}%</strong>
            </div>
          </div>
        </div>

        {/* THIS MONTH */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            THIS MONTH SUMMARY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Active Days</span>
              <strong style={{ color: '#fff' }}>{summary.active_days_count || 0} Days</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Longest Streak</span>
              <strong style={{ color: '#fff' }}>{summary.longest_streak || 0} Days</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Consistency Score</span>
              <strong style={{ color: 'var(--accent-amber)' }}>{consistency.monthly_consistency || 0}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Interactive Analytics Chart */}
      <ProductivityChart />

      <style>{`
        @media (max-width: 900px) {
          .analytics-top-grid, .summary-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .consistency-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
