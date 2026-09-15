import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddScheduleModal } from '../components/timetable/AddScheduleModal';
import { Plus, Calendar, Clock, MapPin, Trash2 } from 'lucide-react';
import api from '../services/api';

export const TimetablePage = () => {
  const { timetable, refreshAll, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleDelete = async (id) => {
    try {
      await api.delete(`/timetable/${id}`);
      showToast('Schedule entry removed', 'info');
      await refreshAll();
    } catch (err) {
      showToast('Failed to delete schedule entry', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Weekly Timetable</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your automated college class routine & labs.</p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Add Class
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {days.map((day) => {
          const dayEntries = timetable.filter(t => t.day.toLowerCase() === day.toLowerCase());
          return (
            <div key={day} className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
              }}>
                {day}
              </div>

              {dayEntries.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>No classes scheduled</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {dayEntries.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.75rem',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                          {item.subject}
                        </h4>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={13} color="var(--accent-amber)" />
                          <span>{item.start_time} - {item.end_time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={13} color="var(--accent-rose)" />
                          <span>{item.room || 'TBD'}</span>
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

      <AddScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
