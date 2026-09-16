import React from 'react';
import { Calendar, MapPin, Clock, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const NextActivityCard = () => {
  const { timetable, nextActivity } = useApp();
  const navigate = useNavigate();

  // Sort schedule items for today
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todaySchedule = timetable
    .filter(t => !t.day || t.day.toLowerCase().startsWith(todayName.toLowerCase()))
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            padding: '0.45rem',
            background: 'rgba(14, 165, 233, 0.12)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={18} color="var(--accent-cyan-light)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Today's Schedule</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Timeline timetable & upcoming classes</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/focus')}
          className="btn btn-primary"
          style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
        >
          <Play size={14} /> Start Focus
        </button>
      </div>

      {/* Next Activity Highlight Card */}
      {nextActivity ? (
        <div style={{
          padding: '1.15rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(15, 23, 42, 0.8))',
          border: '1px solid rgba(14, 165, 233, 0.3)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan-light)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              NEXT UPCOMING SESSION
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              {nextActivity.subject}
            </h4>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.35rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} color="var(--accent-amber)" /> {nextActivity.time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="var(--accent-rose)" /> Room {nextActivity.room || 'L-101'}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/focus')}
            className="btn btn-emerald"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.825rem' }}
          >
            Start Focus
          </button>
        </div>
      ) : (
        <div style={{
          padding: '0.85rem 1rem',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '1.25rem'
        }}>
          🎉 No more scheduled classes remaining for today!
        </div>
      )}

      {/* Timeline List */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
          TIMELINE OVERVIEW
        </div>

        {todaySchedule.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            No schedule entries added for today. Click Timetable to add classes.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {todaySchedule.map((item, idx) => {
              const isNext = nextActivity && nextActivity.id === item.id;

              return (
                <div
                  key={item.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: isNext ? 'rgba(14, 165, 233, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: isNext ? '1px solid rgba(14, 165, 233, 0.25)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 700, color: isNext ? 'var(--accent-cyan-light)' : 'var(--text-muted)', width: '65px', fontSize: '0.8rem' }}>
                      {item.time}
                    </span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>
                      {item.subject}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      Room {item.room}
                    </span>
                    {isNext && (
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                        Next
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
