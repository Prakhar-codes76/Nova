import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import api from '../../services/api';

export const AddScheduleModal = ({ isOpen, onClose }) => {
  const { refreshAll, showToast } = useApp();

  const [subject, setSubject] = useState('');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [room, setRoom] = useState('LH-101');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setLoading(true);
    try {
      await api.post('/timetable', {
        subject: subject.trim(),
        day,
        start_time: startTime,
        end_time: endTime,
        room
      });
      showToast('Timetable entry added!', 'success');
      await refreshAll();
      setSubject('');
      onClose();
    } catch (err) {
      showToast('Failed to add schedule entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Timetable Class / Activity">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Subject / Course Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Data Structures & Algorithms"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Day of Week</label>
            <select className="form-select" value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Room / Venue</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Hall 101 / CS Lab 2"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Start Time</label>
            <input
              type="time"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">End Time</label>
            <input
              type="time"
              className="form-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Class'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
