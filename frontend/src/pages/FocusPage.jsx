import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { requestNotificationPermission, sendBrowserNotification } from '../utils/notifications';
import api from '../services/api';

export const FocusPage = () => {
  const { refreshAll, showToast } = useApp();
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((sec) => sec - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      handleFinishSession();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/focus/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFinishSession = async () => {
    try {
      await api.post('/focus/start', { duration: mode === 'focus' ? 25 : 5 });
      const msg = mode === 'focus' ? 'Great work! Focus Session completed 🎉' : 'Break completed! Ready to study?';
      showToast(msg, 'success');
      sendBrowserNotification('Nova Focus Assistant', { body: msg });
      await refreshAll();
      await fetchHistory();
    } catch (err) {
      showToast('Failed to record session', 'error');
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setSecondsLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Pomodoro Focus Mode 🎯</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Enhance deep study concentration. Nova tracks your sessions automatically with browser alerts.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel glass-panel-glow" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.4)', padding: '0.35rem', borderRadius: 'var(--radius-full)', marginBottom: '2rem' }}>
            <button
              onClick={() => switchMode('focus')}
              className="btn"
              style={{
                background: mode === 'focus' ? 'var(--accent-primary)' : 'transparent',
                color: '#fff',
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 1.25rem'
              }}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => switchMode('break')}
              className="btn"
              style={{
                background: mode === 'break' ? 'var(--accent-emerald)' : 'transparent',
                color: '#fff',
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 1.25rem'
              }}
            >
              Rest Break (5m)
            </button>
          </div>

          <div style={{ fontSize: '5rem', fontWeight: 800, fontFamily: 'monospace', color: '#fff', letterSpacing: '0.05em', marginBottom: '2rem' }}>
            {formatTime(secondsLeft)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={toggleTimer} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.1rem' }}>
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              {isActive ? 'Pause' : 'Start Focus'}
            </button>

            <button onClick={resetTimer} className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>
              <RotateCcw size={18} /> Reset
            </button>
          </div>

          <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            ℹ️ Browser Notifications enabled for focus completion alerts.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Flame size={20} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Focus History</h3>
          </div>

          {history.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No completed focus sessions yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
              {history.map((sess) => (
                <div key={sess.id} style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{sess.duration} Min Sprint</span>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>✓ Completed</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                    {new Date(sess.started_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
