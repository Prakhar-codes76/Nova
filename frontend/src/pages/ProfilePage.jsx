import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { User, Save, LogOut } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast, refreshAll } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [college, setCollege] = useState(user?.college || '');
  const [course, setCourse] = useState(user?.course || '');
  const [year, setYear] = useState(user?.year || '');
  const [studyGoal, setStudyGoal] = useState(user?.study_goal || '');
  const [dailyHours, setDailyHours] = useState(user?.daily_study_hours || 3.0);
  const [language, setLanguage] = useState(user?.preferred_language || 'Hinglish');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCollege(user.college || '');
      setCourse(user.course || '');
      setYear(user.year || '');
      setStudyGoal(user.study_goal || '');
      setDailyHours(user.daily_study_hours || 3.0);
      setLanguage(user.preferred_language || 'Hinglish');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name,
        email,
        college,
        course,
        year,
        study_goal: studyGoal,
        daily_study_hours: parseFloat(dailyHours),
        preferred_language: language
      });
      showToast('Profile updated successfully.', 'success');
      await refreshAll();
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Student Profile & Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Edit your profile. Changes persist directly in the database.</p>
        </div>

        <button onClick={logout} className="btn btn-danger">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', maxWidth: '680px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">College / University</label>
            <input type="text" className="form-input" value={college} onChange={(e) => setCollege(e.target.value)} />
          </div>

          <div className="input-group">
            <label className="input-label">Course / Major</label>
            <input type="text" className="form-input" value={course} onChange={(e) => setCourse(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Academic Year / Sem</label>
            <input type="text" className="form-input" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>

          <div className="input-group">
            <label className="input-label">Daily Study Target (Hours)</label>
            <select className="form-select" value={dailyHours} onChange={(e) => setDailyHours(e.target.value)}>
              <option value="1.0">1 Hour / Day</option>
              <option value="2.0">2 Hours / Day</option>
              <option value="3.0">3 Hours / Day</option>
              <option value="4.0">4 Hours / Day</option>
              <option value="5.0">5+ Hours / Day</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Primary Study Goal</label>
          <input type="text" className="form-input" value={studyGoal} onChange={(e) => setStudyGoal(e.target.value)} />
        </div>

        <div className="input-group">
          <label className="input-label">Preferred Assistant Language</label>
          <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="Hinglish">Hinglish</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Bhojpuri">Bhojpuri</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
