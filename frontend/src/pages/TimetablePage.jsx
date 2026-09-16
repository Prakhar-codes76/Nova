import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddScheduleModal } from '../components/timetable/AddScheduleModal';
import { Plus, Calendar, Clock, MapPin, Trash2, BookOpen } from 'lucide-react';
import api from '../services/api';

export const TimetablePage = () => {
  const { timetable, refreshAll, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('All');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this class from your timetable?')) return;
    try {
      await api.delete(`/timetable/${id}`);
      showToast('Schedule entry removed', 'info');
      await refreshAll();
    } catch (err) {
      showToast('Failed to delete schedule entry', 'error');
    }
  };

  const displayedDays = selectedDay === 'All' ? days : [selectedDay];

  return (
    <div className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'var(--font-heading)' }}>
            Weekly Timetable
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Automated class schedule, lectures, and lab slots. Today is <strong style={{ color: 'var(--accent-cyan)' }}>{todayName}</strong>.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-full)' }}>
          <Plus size={18} /> Add Class Slot
        </button>
      </div>

      {/* Day Filter Tabs */}
      <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto' }}>
        <button
          onClick={() => setSelectedDay('All')}
          className={`btn ${selectedDay === 'All' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }}
        >
          All Days
        </button>
        {days.map((d) => {
          const isToday = d.toLowerCase() === todayName.toLowerCase();
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`btn ${selectedDay === d ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.825rem',
                border: isToday ? '1px solid var(--accent-cyan)' : undefined
              }}
            >
              {d} {isToday && '●'}
            </button>
          );
        })}
      </div>

      {/* Timetable Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {displayedDays.map((day) => {
          const dayEntries = timetable.filter(t => t.day.toLowerCase() === day.toLowerCase());
          const isToday = day.toLowerCase() === todayName.toLowerCase();

          return (
            <div
              key={day}
              className="glass-panel"
              style={{
                padding: '1.35rem',
                border: isToday ? '1.5px solid rgba(14, 165, 233, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isToday ? '0 10px 30px rgba(14, 165, 233, 0.15)' : undefined
              }}
            >
              {/* Day Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '0.65rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} color={isToday ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                    {day}
                  </h3>
                </div>

                {isToday && (
                  <span className="badge badge-cyan" style={{ fontSize: '0.675rem' }}>
                    Today
                  </span>
                )}
              </div>

              {/* Sessions List */}
              {dayEntries.length === 0 ? (
                <div style={{ padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No classes scheduled for {day}.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {dayEntries.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.85rem 1rem',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                          {item.subject}
                        </h4>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Remove class"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '2px'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={13} color="var(--accent-amber)" />
                          <span>{item.start_time} - {item.end_time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={13} color="var(--accent-rose)" />
                          <span>{item.room || 'Room LH-101'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Schedule Modal */}
      <AddScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default TimetablePage;
