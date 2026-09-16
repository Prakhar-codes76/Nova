import React, { useState } from 'react';
import { 
  User, 
  Palette, 
  Bell, 
  Timer, 
  ShieldAlert, 
  Mic, 
  Sparkles, 
  Lock, 
  Save, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState('account');

  // Preference states
  const [browserAlerts, setBrowserAlerts] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [voicePrompts, setVoicePrompts] = useState(true);
  const [defaultFocusDuration, setDefaultFocusDuration] = useState('25');
  const [distractionProtection, setDistractionProtection] = useState(false);
  const [aiLanguage, setAiLanguage] = useState(user?.preferred_language || 'Hinglish');

  const handleSaveSettings = () => {
    showToast('Systematic settings updated successfully!', 'success');
  };

  const tabs = [
    { id: 'account', label: 'ACCOUNT', icon: User },
    { id: 'appearance', label: 'APPEARANCE', icon: Palette },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: Bell },
    { id: 'focus', label: 'FOCUS MODE', icon: Timer },
    { id: 'distraction', label: 'DISTRACTION CONTROL', icon: ShieldAlert },
    { id: 'voice', label: 'VOICE ASSISTANT', icon: Mic },
    { id: 'ai', label: 'AI ASSISTANT', icon: Sparkles },
    { id: 'privacy', label: 'PRIVACY', icon: Lock },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>System Settings ⚙️</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Customize your Nova assistant preferences, notification rules, focus protection, and AI voice controls.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }} className="settings-grid">
        {/* Settings Navigation */}
        <div className="glass-panel" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', height: 'fit-content' }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan-light)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {activeTab === 'account' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Account Information</h3>
              <div className="input-group">
                <label className="input-label">Student Name</label>
                <input type="text" className="form-input" defaultValue={user?.name || ''} readOnly />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input type="email" className="form-input" defaultValue={user?.email || ''} readOnly />
              </div>
              <div className="input-group">
                <label className="input-label">Institution / College</label>
                <input type="text" className="form-input" defaultValue={user?.college || 'IIT Kanpur'} readOnly />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Visual Theme & Aesthetics</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Nova utilizes an optimized high-contrast dark navy theme tailored for reduced eye strain during late-night study sessions.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Dark Navy Charcoal (Startup Edition)</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Active system theme</div>
                </div>
                <span className="badge badge-cyan">Active</span>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Notification Preferences</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Browser Push Notifications</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Alerts when focus timer completes or study sessions start</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={browserAlerts} onChange={(e) => setBrowserAlerts(e.target.checked)} />
                    <span className="slider" />
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Smart Study Reminders</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Receive 15-minute advance alerts before scheduled classes</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={studyReminders} onChange={(e) => setStudyReminders(e.target.checked)} />
                    <span className="slider" />
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Voice Assistant Audio Prompts</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Allow Nova to speak session startup alerts</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={voicePrompts} onChange={(e) => setVoicePrompts(e.target.checked)} />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'focus' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Focus Mode Defaults</h3>
              <div className="input-group">
                <label className="input-label">Default Focus Sprint Duration</label>
                <select 
                  className="form-select"
                  value={defaultFocusDuration}
                  onChange={(e) => setDefaultFocusDuration(e.target.value)}
                >
                  <option value="25">25 Minutes (Standard Pomodoro)</option>
                  <option value="50">50 Minutes (Deep Work Sprint)</option>
                  <option value="90">90 Minutes (Ultradian Cycle)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'distraction' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Distraction Control</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Permission-Based Focus Protection</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Prompt for explicit user permission before blocking web distractions</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={distractionProtection} onChange={(e) => setDistractionProtection(e.target.checked)} />
                  <span className="slider" />
                </label>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(14, 165, 233, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(14, 165, 233, 0.2)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ℹ️ System-level application blocking requires the optional NOVA companion/extension and explicit user permission.
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Voice Assistant (ElevenLabs Integration)</h3>
              <div className="input-group">
                <label className="input-label">Voice Agent Status</label>
                <input type="text" className="form-input" defaultValue="Agent Active (agent_2201m2getr0yep3tzmck70abvye9)" readOnly />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Underlying voice synthesis powered by ElevenLabs Conversational AI with custom student life tool hooks.
              </p>
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>AI Assistant Controls (Gemini 2.5)</h3>
              <div className="input-group">
                <label className="input-label">Preferred Response Language</label>
                <select className="form-select" value={aiLanguage} onChange={(e) => setAiLanguage(e.target.value)}>
                  <option value="Hinglish">Hinglish (Hindi + English)</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Privacy & Security</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Nova strictly safeguards student records. API keys, ElevenLabs credentials, and database secrets are isolated securely on the backend server and never exposed in client bundles.
              </p>
            </div>
          )}

          <div style={{ marginTop: '2rem', pt: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSaveSettings} className="btn btn-primary">
              <Save size={16} /> Save Settings
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
