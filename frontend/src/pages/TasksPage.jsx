import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { Plus, Filter, Search, CheckCircle2, Clock, Trash2, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import api from '../services/api';

export const TasksPage = () => {
  const { tasks, refreshAll, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed
  const [filterPriority, setFilterPriority] = useState('all'); // all, high, medium, low
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      if (currentStatus === 'completed') {
        // Option to reopen or mark pending
        await api.put(`/tasks/${taskId}`, { status: 'pending' });
        showToast('Task reopened', 'info');
      } else {
        await api.post(`/tasks/${taskId}/complete`);
        showToast('Task completed! Great progress! 🎉', 'success');
      }
      await refreshAll();
    } catch (err) {
      showToast('Failed to update task status.', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      showToast('Task deleted successfully', 'info');
      await refreshAll();
    } catch (err) {
      showToast('Failed to delete task.', 'error');
    }
  };

  // Filter & Search logic
  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'pending' && t.status === 'completed') return false;
    if (filterStatus === 'completed' && t.status !== 'completed') return false;
    if (filterPriority !== 'all' && (t.priority || '').toLowerCase() !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchSubject = (t.subject || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSubject) return false;
    }
    return true;
  });

  const getPriorityBadge = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'high':
        return <span className="badge badge-rose" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.3)' }}>High Priority</span>;
      case 'medium':
        return <span className="badge badge-amber">Medium</span>;
      default:
        return <span className="badge badge-cyan">Low</span>;
    }
  };

  return (
    <div className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'var(--font-heading)' }}>
            Tasks & Assignments
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Organize your daily study schedule, lab submissions, and revision tasks.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-full)' }}>
          <Plus size={18} /> Add New Task
        </button>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '360px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search tasks or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {['all', 'pending', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', textTransform: 'capitalize' }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Priority Filter Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} color="var(--text-muted)" />
          <select
            className="form-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', width: 'auto' }}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task Cards List */}
      {filteredTasks.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <CheckCircle2 size={48} color="var(--accent-cyan)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>
            No tasks found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto 1.25rem' }}>
            {searchQuery ? "No tasks match your current search query or filter settings." : "You're all caught up! Click 'Add New Task' to schedule your next study objective."}
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary">
            <Plus size={16} /> Create Task
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredTasks.map((t) => {
            const isCompleted = t.status === 'completed';
            return (
              <div
                key={t.id}
                className="glass-panel glass-panel-interactive"
                style={{
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  gap: '1rem',
                  opacity: isCompleted ? 0.7 : 1,
                  background: isCompleted ? 'rgba(15, 23, 42, 0.4)' : 'rgba(30, 41, 59, 0.5)'
                }}
              >
                {/* Left Side Checkbox & Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                  
                  {/* Completion Toggle Button */}
                  <button
                    onClick={() => handleToggleComplete(t.id, t.status)}
                    style={{
                      background: isCompleted ? 'var(--accent-emerald)' : 'transparent',
                      border: isCompleted ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isCompleted && <CheckCircle2 size={18} color="#fff" />}
                  </button>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: isCompleted ? 'var(--text-muted)' : '#fff',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        margin: 0
                      }}>
                        {t.title}
                      </h4>
                      {getPriorityBadge(t.priority)}
                      {t.subject && (
                        <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                          {t.subject}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      {t.due_date && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={13} color="var(--accent-cyan)" /> Due: {t.due_date} {t.due_time ? `@ ${t.due_time}` : ''}
                        </span>
                      )}
                      {t.description && (
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                          {t.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    title="Delete task"
                    style={{
                      background: 'rgba(244, 63, 94, 0.1)',
                      border: '1px solid rgba(244, 63, 94, 0.2)',
                      color: '#fb7185',
                      borderRadius: '8px',
                      padding: '0.45rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default TasksPage;
