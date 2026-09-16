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

  // SVG Chart Dimensions
  const chartHeight = 200;
  const chartWidth = 1000; // Arbitrary wide width for SVG viewBox
  const padding = 40;

  const generateLinePath = (data, maxValue) => {
    if (!data || data.length === 0) return '';
    const points = data.map((d, i) => {
      const x = padding + (i * (chartWidth - 2 * padding)) / Math.max(1, data.length - 1);
      const y = chartHeight - padding - ((d[yValKey] || 0) / maxValue) * (chartHeight - 2 * padding);
      return `${x},${y}`;
    });
    
    // Create smooth bezier curve (Catmull-Rom to Bezier or simple cubic for demonstration)
    // For simplicity, we just use simple lines L, but we can do a C for curve if we want to be fancy.
    // We'll stick to a smooth path string manually constructed or simple lines.
    let path = `M ${points[0]}`;
    for (let i = 1; i < points.length; i++) {
      const current = points[i].split(',');
      const prev = points[i-1].split(',');
      const cx1 = parseFloat(prev[0]) + (parseFloat(current[0]) - parseFloat(prev[0])) / 2;
      const cy1 = parseFloat(prev[1]);
      const cx2 = cx1;
      const cy2 = parseFloat(current[1]);
      path += ` C ${cx1},${cy1} ${cx2},${cy2} ${current[0]},${current[1]}`;
    }
    return path;
  };

  const linePath = generateLinePath(currentSeries, maxVal);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ padding: '0.5rem', background: 'rgba(14, 165, 233, 0.12)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} color="var(--accent-cyan-light)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Activity Trend</h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Focus time over period</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(15, 23, 42, 0.8)', padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          {['TODAY', 'WEEK', 'MONTH'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'var(--accent-cyan)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                border: 'none', padding: '0.35rem 0.85rem', borderRadius: 'calc(var(--radius-sm) - 2px)',
                fontWeight: 600, fontSize: '0.775rem', cursor: 'pointer', transition: 'all 0.15s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {!hasData || totalFocusPeriod === 0 ? (
        <div style={{ padding: '2.5rem 1rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)' }}>
          <Info size={32} color="var(--accent-cyan-light)" style={{ marginBottom: '0.75rem', opacity: 0.8 }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>No activity data yet</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            Complete study tasks and focus sessions to view your trends.
          </p>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '220px', overflowX: 'auto', overflowY: 'hidden' }}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: '100%', minWidth: '600px', overflow: 'visible' }}>
            
            {/* Grid Lines */}
            {[0, 0.5, 1].map((tick, i) => {
              const y = chartHeight - padding - (tick * (chartHeight - 2 * padding));
              return (
                <g key={i}>
                  <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4,4" />
                  <text x={padding - 10} y={y + 4} fill="var(--text-subtle)" fontSize="12" textAnchor="end">{Math.round(tick * maxVal)}m</text>
                </g>
              );
            })}

            {/* Gradient for area under line */}
            <defs>
              <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0" />
              </linearGradient>
              <filter id="blur">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>

            {/* The Line Area */}
            <path 
              d={`${linePath} L ${chartWidth - padding},${chartHeight - padding} L ${padding},${chartHeight - padding} Z`} 
              fill="url(#glow)" 
            />

            {/* The Line itself */}
            <path 
              d={linePath} 
              fill="none" 
              stroke="var(--accent-cyan-light)" 
              strokeWidth="3" 
              filter="url(#blur)"
              opacity="0.5"
            />
            <path 
              d={linePath} 
              fill="none" 
              stroke="var(--accent-cyan)" 
              strokeWidth="2" 
            />

            {/* Data Points and Labels */}
            {currentSeries.map((d, i) => {
              const x = padding + (i * (chartWidth - 2 * padding)) / Math.max(1, currentSeries.length - 1);
              const y = chartHeight - padding - ((d[yValKey] || 0) / maxVal) * (chartHeight - 2 * padding);
              return (
                <g key={i}>
                  {/* Point */}
                  <circle cx={x} cy={y} r="4" fill="var(--bg-primary)" stroke="var(--accent-cyan)" strokeWidth="2" />
                  
                  {/* X Axis Label */}
                  <text x={x} y={chartHeight - padding + 20} fill="var(--text-muted)" fontSize="12" textAnchor="middle" style={{ display: (activeTab === 'MONTH' && i % 3 !== 0 && i !== currentSeries.length -1) ? 'none' : 'block' }}>
                    {d[xLabelKey]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};
