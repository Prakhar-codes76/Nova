import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Prakhar',
    email: 'prakhar.cse@college.edu',
    college: 'IIT Kanpur',
    course: 'B.Tech CSE',
    year: '2nd Year',
    preferred_language: 'Hinglish',
  });

  const [tasks, setTasks] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [nextActivity, setNextActivity] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchUser = async () => {
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
    } catch (err) {
      console.warn("Using default demo user profile.");
    }
  };

  const fetchTasks = async (status = null) => {
    try {
      const res = await api.get('/tasks', { params: status ? { status } : {} });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  const fetchTimetable = async () => {
    try {
      const res = await api.get('/timetable');
      setTimetable(res.data);
    } catch (err) {
      console.error("Failed to load timetable", err);
    }
  };

  const fetchNextActivity = async () => {
    try {
      const res = await api.get('/timetable/next-activity');
      setNextActivity(res.data.next_activity);
    } catch (err) {
      console.error("Failed to load next activity", err);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress');
      setProgress(res.data.summary);
    } catch (err) {
      console.error("Failed to load progress analytics", err);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchUser(), fetchTasks(), fetchTimetable(), fetchNextActivity(), fetchProgress()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const addTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      showToast(`Task '${res.data.title}' created!`, 'success');
      await refreshAll();
      return res.data;
    } catch (err) {
      showToast(err.message || 'Failed to add task', 'error');
      throw err;
    }
  };

  const completeTask = async (taskId) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/complete`);
      showToast(`Task '${res.data.title}' completed! 🎉`, 'success');
      await refreshAll();
    } catch (err) {
      showToast('Failed to complete task', 'error');
    }
  };

  const rescheduleTask = async (taskId, dueDate, dueTime) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/reschedule`, { due_date: dueDate, due_time: dueTime });
      showToast(`Rescheduled to ${res.data.due_date}!`, 'info');
      await refreshAll();
    } catch (err) {
      showToast('Failed to reschedule task', 'error');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      showToast('Task removed', 'info');
      await refreshAll();
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        tasks,
        timetable,
        nextActivity,
        progress,
        loading,
        toast,
        showToast,
        refreshAll,
        addTask,
        completeTask,
        rescheduleTask,
        deleteTask,
        isVoiceOpen,
        setIsVoiceOpen,
        isDemoMode,
        setIsDemoMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
