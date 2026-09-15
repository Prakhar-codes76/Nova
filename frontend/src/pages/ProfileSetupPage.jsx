import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, BookOpen, GraduationCap, Award } from 'lucide-react';

export const ProfileSetupPage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast, refreshAll } = useApp();
  const navigate = useNavigate();

  const [college, setCollege] = useState(user?.college || '');
  const [course, setCourse] = useState(user?.course || '');
  const [year, setYear] = useState(user?.year || '');
  const [studyGoal, setStudyGoal] = useState(user?.study_goal || '');
  const [dailyHours, setDailyHours] = useState(user?.daily_study_hours || 3.0);
  const [language, setLanguage] = useState(user?.preferred_language || 'Hinglish');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        college,
        course,
        year,
        study_goal: studyGoal,
        daily_study_hours: parseFloat(dailyHours),
        preferred_language: language
      });
      showToast('Nova personalized successfully! Launching Dashboard...', 'success');
      await refreshAll();
      navigate('/');
    } catch (err) {
      showToast('Failed to save profile choices', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cinematic-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div className="cinematic-orb" />

      <div className="glass-panel glass-panel-glow" style={{ maxWidth: '650px', width: '100%', padding: '2.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-primary))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>Personalize Nova</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Tell Nova about your college, degree, and study habits so it can tailor your routine.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">College / University</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. IIT Kanpur / Delhi University"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Course / Degree</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. B.Tech CSE / B.Sc Maths"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Academic Year / Semester</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2nd Year / 4th Sem"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
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
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Maintain 9.0+ GPA and master algorithms"
              value={studyGoal}
              onChange={(e) => setStudyGoal(e.target.value)}
            />
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem' }} disabled={loading}>
            {loading ? 'Saving Profile...' : 'Complete Personalization & Launch Dashboard'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
