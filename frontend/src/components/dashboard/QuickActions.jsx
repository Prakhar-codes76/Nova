import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Mic, BrainCircuit, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickActions = ({ onOpenAddTask, onOpenAddSchedule }) => {
  const { setIsVoiceOpen } = useApp();
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.85rem', fontWeight: 600 }}>
        QUICK ACTIONS
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button onClick={onOpenAddTask} className="btn btn-primary">
          <Plus size={16} /> Add Task
        </button>

        <button onClick={onOpenAddSchedule} className="btn btn-secondary">
          <Calendar size={16} /> Add Schedule
        </button>

        <button onClick={() => setIsVoiceOpen(true)} className="btn btn-voice">
          <Mic size={16} /> Talk to Nova 🎙️
        </button>

        <button onClick={() => navigate('/study-planner')} className="btn btn-secondary">
          <BrainCircuit size={16} color="var(--accent-secondary)" /> Create Study Plan 🧠
        </button>

        <button onClick={() => navigate('/focus')} className="btn btn-secondary">
          <Target size={16} color="var(--accent-rose)" /> Start Focus 🎯
        </button>
      </div>
    </div>
  );
};
