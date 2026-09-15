import React, { useState } from 'react';
import { BrainCircuit, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { aiService } from '../services/aiService';
import { useApp } from '../context/AppContext';

export const StudyPlannerPage = () => {
  const { showToast } = useApp();
  const [subject, setSubject] = useState('Data Structures');
  const [examDate, setExamDate] = useState('2026-09-25');
  const [topicsStr, setTopicsStr] = useState('Graph Algorithms, Dynamic Programming, Trees & Heaps, Sorting & Searching');
  const [hoursPerDay, setHoursPerDay] = useState(2.0);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const topics = topicsStr.split(',').map(t => t.trim()).filter(Boolean);
      const res = await aiService.generateStudyPlan({
        subject,
        exam_date: examDate,
        topics,
        available_hours_per_day: parseFloat(hoursPerDay),
        difficulty
      });
      setPlan(res);
      showToast('Custom Study Roadmap generated!', 'success');
    } catch (err) {
      showToast('Failed to generate study plan', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>AI Study Roadmap Generator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Input your upcoming exams, available hours, and difficulty for a realistic, non-overloading study schedule.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
        {/* Form Container */}
        <form onSubmit={handleGeneratePlan} className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Plan Parameters</h3>

          <div className="input-group">
            <label className="input-label">Subject / Exam Name</label>
            <input
              type="text"
              className="form-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Exam Date</label>
            <input
              type="date"
              className="form-input"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Topics to Cover (Comma Separated)</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={topicsStr}
              onChange={(e) => setTopicsStr(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Available Hours / Day</label>
              <select className="form-select" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)}>
                <option value="1.0">1 Hour / Day</option>
                <option value="2.0">2 Hours / Day</option>
                <option value="3.0">3 Hours / Day</option>
                <option value="4.0">4 Hours / Day</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Subject Difficulty</label>
              <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            <BrainCircuit size={18} />
            {loading ? 'Generating Roadmap...' : 'Generate AI Study Plan'}
          </button>
        </form>

        {/* Results Container */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          {!plan ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <BrainCircuit size={48} color="var(--accent-primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <p>Configure parameters on the left and click "Generate AI Study Plan".</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  Study Roadmap: {plan.subject}
                </h3>
                <span className="badge badge-low">{plan.total_days} Days Plan</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {plan.study_blocks.map((block) => (
                  <div
                    key={block.day}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                        Day {block.day} ({block.date})
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>
                        {block.duration_minutes} mins • {block.session_type}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                      {block.topic}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}>
                  NOVA SMART STUDY TIPS:
                </h4>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {plan.tips.map((tip, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{tip}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
