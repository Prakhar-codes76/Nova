import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TodayTasks } from '../components/dashboard/TodayTasks';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { Plus, Filter } from 'lucide-react';

export const TasksPage = () => {
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Tasks & Routine</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your daily assignments, labs, and revisions.</p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Add Task
        </button>
      </div>

      <TodayTasks />

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
