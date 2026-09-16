import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Clock, 
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { requestNotificationPermission, sendBrowserNotification } from '../utils/notifications';
import api from '../services/api';

export const FocusPage = () => {
  const { tasks, refreshAll, showToast } = useApp();
  
  // Timer State
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [customInput, setCustomInput] = useState('45');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [history, setHistory] = useState([]);

  // Distraction Control State
  const [focusProtection, setFocusProtection] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [blockSocial, setBlockSocial] = useState(true);
  const [blockStreaming, setBlockStreaming] = useState(true);

  // Completion Summary Modal State
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [lastCompletedSession, setLastCompletedSession] = useState(null);

  useEffect(() => {
    requestNotificationPermission();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/focus/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleSelectDuration = (mins) => {
    setDurationMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsActive(false);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0 && val <= 300) {
      handleSelectDuration(val);
    }
  };

  const toggleFocusProtection = (e) => {
    const checked = e.target.checked;
    if (checked && !permissionGranted) {
      setShowPermissionModal(true);
    } else {
      setFocusProtection(checked);
    }
  };

  const handleGrantPermission = () => {
    setPermissionGranted(true);
    setFocusProtection(true);
    setShowPermissionModal(false);
    showToast('Focus protection enabled for this session.', 'success');
  };

  const handleDenyPermission = () => {
    setPermissionGranted(false);
    setFocusProtection(false);
    setShowPermissionModal(false);
  };

  const handleFinishSession = async () => {
    try {
      const res = await api.post('/focus/start', { duration: durationMinutes });
      const completedSess = res.data;
      setLastCompletedSession(completedSess);
      setShowCompletionModal(true);

      const msg = `Great work! Focus Session (${durationMinutes} mins) completed 🎉`;
      showToast(msg, 'success');
      sendBrowserNotification('Nova Focus Assistant', { body: msg });

      await refreshAll();
      await fetchHistory();
    } catch (err) {
      showToast('Failed to record focus session', 'error');
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(durationMinutes * 60);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // SVG Progress Ring Calculation
  const totalSeconds = durationMinutes * 60;
  const progressPct = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const strokeDashoffset = 565 - (565 * progressPct) / 100;

  const activeTaskObj = tasks.find(t => t.id === parseInt(selectedTaskId, 10));

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>NOVA Focus Mode 🎯</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Minimalist, distraction-free study timer with real analytics tracking and explicit permission controls.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }} className="focus-grid">
        
        {/* MAIN POMODORO TIMER PANEL */}
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', position: 'relative' }}>
          
          {/* Duration Selector Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '0.4rem',
            borderRadius: 'var(--radius-full)',
            width: 'fit-content',
            margin: '0 auto 2rem'
          }}>
            {[25, 50, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSelectDuration(mins)}
                className="btn"
                style={{
                  background: durationMinutes === mins ? 'var(--accent-cyan)' : 'transparent',
                  color: durationMinutes === mins ? '#fff' : 'var(--text-muted)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 1.1rem',
                  fontSize: '0.825rem'
                }}
              >
                {mins} Mins
              </button>
            ))}

            <form onSubmit={handleCustomSubmit} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <input
                type="number"
                min="1"
                max="300"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                style={{
                  width: '54px',
                  padding: '0.25rem 0.4rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: 'var(--accent-cyan-light)' }}>
                Set
              </button>
            </form>
          </div>

          {/* Task Target Selection */}
          <div style={{ maxWidth: '340px', margin: '0 auto 2rem' }}>
            <label className="input-label" style={{ marginBottom: '0.35rem' }}>Select Target Task (Optional)</label>
            <select
              className="form-select"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              style={{ textAlign: 'center' }}
            >
              <option value="">-- General Deep Work Session --</option>
              {tasks.filter(t => t.status !== 'completed').map(t => (
                <option key={t.id} value={t.id}>{t.title} ({t.subject || 'General'})</option>
              ))}
            </select>
          </div>

          {/* Countdown Ring Visual */}
          <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 2rem' }}>
            <svg width="220" height="220" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r="90" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="10" fill="transparent" />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="var(--accent-cyan)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="565"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s linear' }}
              />
            </svg>

            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '3.2rem', fontWeight: 800, fontFamily: 'monospace', color: '#fff', letterSpacing: '0.04em' }}>
                {formatTime(secondsLeft)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isActive ? 'Session Active' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={toggleTimer}
              className="btn btn-primary"
              style={{ padding: '0.85rem 2.25rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              {isActive ? 'Pause' : 'Start Focus'}
            </button>

            <button
              onClick={resetTimer}
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-full)' }}
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>

          {activeTaskObj && (
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan-light)', fontWeight: 600 }}>
              Focused on: {activeTaskObj.title}
            </div>
          )}
        </div>

        {/* SIDEBAR: PERMISSION-BASED DISTRACTION CONTROL & HISTORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Distraction Control Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={20} color="var(--accent-cyan-light)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Distraction Control</h3>
              </div>

              <label className="toggle-switch">
                <input type="checkbox" checked={focusProtection} onChange={toggleFocusProtection} />
                <span className="slider" />
              </label>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Enable focus protection to manage browser notifications and block online distraction sites during active sprints.
            </p>

            {focusProtection ? (
              <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-emerald-light)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} /> Focus Protection: ON ({formatTime(secondsLeft)} remaining)
              </div>
            ) : (
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Focus Protection: OFF
              </div>
            )}

            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-subtle)', lineHeight: 1.4 }}>
              ℹ️ System-level app blocking requires the optional NOVA companion/extension and user permission.
            </div>
          </div>

          {/* Focus History Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Flame size={20} color="var(--accent-rose)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Focus History</h3>
            </div>

            {history.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No completed focus sessions yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '250px', overflowY: 'auto' }}>
                {history.map((sess) => (
                  <div key={sess.id} style={{ padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: '#fff' }}>{sess.duration} Min Sprint</span>
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: 600, fontSize: '0.75rem' }}>✓ Completed</span>
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                      {new Date(sess.started_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PERMISSION MODAL */}
      {showPermissionModal && (
        <div className="modal-overlay" onClick={handleDenyPermission}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <ShieldAlert size={28} color="var(--accent-cyan-light)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Focus Protection Permission</h3>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              NOVA needs permission to manage selected distractions during your focus session.
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>Selected Protections:</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={blockSocial} onChange={(e) => setBlockSocial(e.target.checked)} />
                Mute social media notifications & browser tabs
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" checked={blockStreaming} onChange={(e) => setBlockStreaming(e.target.checked)} />
                Display distraction overlay during active timer
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={handleDenyPermission} className="btn btn-secondary">
                Not Now
              </button>
              <button onClick={handleGrantPermission} className="btn btn-primary">
                Allow & Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SESSION COMPLETION MODAL */}
      {showCompletionModal && (
        <div className="modal-overlay" onClick={() => setShowCompletionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Award size={32} color="var(--accent-emerald)" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              Focus Session Completed! 🎉
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Awesome concentration! You logged {lastCompletedSession?.duration || durationMinutes} minutes of deep study time.
            </p>

            <button onClick={() => setShowCompletionModal(false)} className="btn btn-emerald" style={{ padding: '0.65rem 2rem' }}>
              Continue
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .focus-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
