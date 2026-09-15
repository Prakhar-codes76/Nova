import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Calendar, Info, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { ConfirmModal } from '../common/ConfirmModal';
import api from '../../services/api';

export const TodayTasks = () => {
  const { tasks, completeTask, rescheduleTask, deleteTask, showToast } = useApp();
  const [explanation, setExplanation] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleFetchExplanation = async (taskId) => {
    try {
      const res = await api.get(`/tasks/${taskId}/priority-explanation`);
      setExplanation(res.data);
    } catch (err) {
      showToast('Could not fetch priority reasoning', 'error');
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '0.35rem' }}>You don't have any tasks yet.</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click "+ Add Task" to plan your upcoming routine.</p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Today's Tasks & Routine</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tasks.length} item(s)</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {tasks.map((task) => {
          const isDelayed = task.status === 'delayed';
          const isCompleted = task.status === 'completed';

          return (
            <div
              key={task.id}
              className={`glass-panel ${isDelayed ? 'glass-panel-glow' : ''}`}
              style={{
                padding: '1rem 1.25rem',
                borderColor: isDelayed ? 'rgba(239, 68, 68, 0.4)' : undefined,
                background: isDelayed ? 'rgba(239, 68, 68, 0.05)' : undefined
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {task.subject || 'GENERAL'}
                    </span>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                    <button
                      onClick={() => handleFetchExplanation(task.id)}
                      title="Why this priority?"
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <Info size={14} />
                    </button>
                  </div>

                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: isCompleted ? 'var(--text-muted)' : '#fff',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    marginBottom: '0.35rem'
                  }}>
                    {task.title}
                  </h4>

                  {task.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      {task.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={13} />
                      <span>Due: {task.due_date} at {task.due_time || '20:00'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {!isCompleted && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', color: 'var(--accent-emerald)' }}
                    >
                      <CheckCircle2 size={15} /> Complete
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTargetId(task.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '0.4rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {isDelayed && (
                <div style={{
                  marginTop: '0.85rem',
                  padding: '0.65rem 0.85rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#fca5a5' }}>
                    <AlertTriangle size={15} />
                    <span>Looks like this task was missed. Do you want to reschedule it?</span>
                  </div>
                  <button
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      rescheduleTask(task.id, tomorrow.toISOString().split('T')[0], '10:00');
                    }}
                    className="btn btn-primary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    Move to Tomorrow 🗓️
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Priority Explanation Overlay */}
      {explanation && (
        <div style={{
          marginTop: '1rem',
          padding: '0.85rem',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <strong>Priority Engine Reasoning ({explanation.title}):</strong> {explanation.explanation} (Score: {explanation.score}/10)
          </div>
          <button onClick={() => setExplanation(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId && deleteTask(deleteTargetId)}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};
