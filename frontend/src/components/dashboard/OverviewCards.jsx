import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Flame, Award, BookOpen } from 'lucide-react';
import api from '../../services/api';
import { useApp } from '../../context/AppContext';

export const OverviewCards = () => {
  const { tasks } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
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
    fetchOverview();
  }, [tasks]);

  const summary = data?.summary || {};
  const todayStudyMins = summary.today_study_minutes || 0;
  const tasksCompleted = summary.today_tasks_completed ?? summary.tasks_completed ?? 0;
  const focusSessionsCount = summary.today_focus_sessions ?? 0;
  const streakDays = summary.current_streak ?? 0;

  const cards = [
    {
      title: "Today's Study Time",
      value: `${todayStudyMins} mins`,
      subtitle: todayStudyMins > 0 ? "Logged from active focus" : "No study time logged today",
      icon: Clock,
      color: "var(--accent-cyan-light)"
    },
    {
      title: "Tasks Completed",
      value: tasksCompleted,
      subtitle: `${summary.tasks_pending || 0} tasks pending`,
      icon: CheckCircle2,
      color: "var(--accent-emerald)"
    },
    {
      title: "Focus Sessions",
      value: focusSessionsCount,
      subtitle: `${summary.total_focus_time_minutes || 0} total focus mins`,
      icon: Flame,
      color: "var(--accent-indigo)"
    },
    {
      title: "Current Streak",
      value: `${streakDays} Days`,
      subtitle: streakDays > 0 ? "Streak active!" : "Start a session to build streak",
      icon: Award,
      color: "var(--accent-amber)"
    }
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
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 500 }}>{c.title}</span>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={18} color={c.color} />
              </div>
            </div>
            
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '0.25rem' }}>
              {loading ? '-' : c.value}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              {c.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};
