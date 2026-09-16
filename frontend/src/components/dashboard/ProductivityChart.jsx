import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Info, Zap } from 'lucide-react';
import api from '../../services/api';

export const ProductivityChart = () => {
  const [activeTab, setActiveTab] = useState('WEEK'); // TODAY, WEEK, MONTH
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/progress');
      setAnalyticsData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading real-time productivity analytics...
      </div>
    );
  }

  const hasData = analyticsData?.has_sufficient_data;
  const todayHourly = analyticsData?.today_hourly || [];
  const weeklyActivity = analyticsData?.weekly_activity || [];
  const monthlyActivity = analyticsData?.monthly_activity || [];

  // Determine active view items based on tab
  let currentSeries = [];
  let xLabelKey = '';
  let yValKey = 'focus_minutes';

  if (activeTab === 'TODAY') {
    currentSeries = todayHourly;
    xLabelKey = 'label';
  } else if (activeTab === 'WEEK') {
    currentSeries = weeklyActivity;
    xLabelKey = 'day';
  } else if (activeTab === 'MONTH') {
    currentSeries = monthlyActivity;
    xLabelKey = 'date';
  }

  const maxVal = Math.max(...currentSeries.map(d => d[yValKey] || 0), 1);
  const totalFocusPeriod = currentSeries.reduce((acc, curr) => acc + (curr[yValKey] || 0), 0);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      {/* Header & Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            padding: '0.5rem',
            background: 'rgba(14, 165, 233, 0.12)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={20} color="var(--accent-cyan-light)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Productivity Analytics</h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Real database study activity tracking</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)'
        }}>
          {['TODAY', 'WEEK', 'MONTH'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'var(--accent-cyan)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.35rem 0.85rem',
                borderRadius: 'calc(var(--radius-sm) - 2px)',
                fontWeight: 600,
                fontSize: '0.775rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Body or Empty State */}
      {!hasData || totalFocusPeriod === 0 ? (
        <div style={{
          padding: '2.5rem 1rem',
          textAlign: 'center',
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: 'var(--radius-sm)',
          border: '1px dashed var(--border-color)'
        }}>
          <Info size={32} color="var(--accent-cyan-light)" style={{ marginBottom: '0.75rem', opacity: 0.8 }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
            Not enough activity data yet.
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            Continue using NOVA to start focus sessions and complete study tasks to build your interactive analytics.
          </p>
        </div>
      ) : (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: '180px',
            gap: '0.75rem',
            paddingTop: '1rem',
            paddingBottom: '0.5rem'
          }}>
            {currentSeries.map((d, idx) => {
              const val = d[yValKey] || 0;
              const heightPct = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0;
              const isZero = val === 0;

              return (
                <div key={idx} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {val > 0 ? `${val}m` : '-'}
                  </span>

                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: isZero ? '4px' : `${Math.max(8, heightPct)}%`,
                      background: isZero 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'linear-gradient(180deg, var(--accent-cyan), var(--accent-indigo))',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease, background 0.2s ease',
                      boxShadow: isZero ? 'none' : '0 2px 8px rgba(14, 165, 233, 0.3)'
                    }}
                    title={`${d[xLabelKey]}: ${val} mins focus`}
                  />

                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: activeTab === 'MONTH' ? 'var(--text-subtle)' : 'var(--text-main)',
                    whiteSpace: 'nowrap'
                  }}>
                    {d[xLabelKey]}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <span>Total Period Focus: <strong style={{ color: 'var(--accent-cyan-light)' }}>{totalFocusPeriod} Mins</strong></span>
            <span>Real DB Aggregation • Updated Live</span>
          </div>
        </div>
      )}
    </div>
  );
};
