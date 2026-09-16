import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { User, Save, LogOut, CheckCircle2, GraduationCap, BookOpen } from 'lucide-react';

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

  const displayName = name || 'Student';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Student Profile 🎓</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Manage your academic identity, college course details, and study preferences.
          </p>
        </div>

        <button onClick={logout} className="btn btn-danger">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' }} className="profile-grid">
        
        {/* Profile Avatar Card */}
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '1rem',
            boxShadow: '0 0 25px rgba(14, 165, 233, 0.4)'
          }}>
            {displayName.charAt(0)}
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>{displayName}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan-light)', marginTop: '0.2rem' }}>{email}</p>
          
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', width: '100%', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            <div>{college || 'Nova Academy'}</div>
            <div style={{ marginTop: '0.25rem', fontWeight: 600, color: 'var(--text-main)' }}>{course || 'B.Tech CSE'} • {year || '2nd Year'}</div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>Personal & Academic Details</h3>

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
              <input type="text" className="form-input" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="e.g. IIT Kanpur" />
            </div>

            <div className="input-group">
              <label className="input-label">Course / Degree Major</label>
              <input type="text" className="form-input" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. B.Tech CSE" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Academic Year / Semester</label>
              <input type="text" className="form-input" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2nd Year / 4th Sem" />
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
            <input type="text" className="form-input" value={studyGoal} onChange={(e) => setStudyGoal(e.target.value)} placeholder="e.g. Maintain 9.0+ GPA and master algorithms" />
          </div>

          <div className="input-group">
            <label className="input-label">Preferred AI Assistant Language</label>
            <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="Hinglish">Hinglish</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
