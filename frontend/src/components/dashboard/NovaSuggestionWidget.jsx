import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export const NovaSuggestionWidget = () => {
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get('/users/me/suggestions');
        setSuggestions(res.data.suggestions || []);
      } catch (err) {
        console.warn("Could not load suggestions.");
      }
    };
    fetchSuggestions();
  }, []);

  if (!suggestions || suggestions.length === 0) return null;

  const topSuggestion = suggestions[0];

  const handleAction = () => {
    if (topSuggestion.action === 'reschedule' || topSuggestion.action === 'start_task') {
      navigate('/tasks');
    } else if (topSuggestion.action === 'focus') {
      navigate('/focus');
    } else if (topSuggestion.action === 'view_timetable') {
      navigate('/timetable');
    }
  };

  return (
    <div className="glass-panel glass-panel-glow" style={{
      padding: '1.25rem 1.5rem',
      marginBottom: '1.75rem',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.12))',
      borderLeft: '4px solid var(--accent-primary)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              NOVA'S INTELLIGENT SUGGESTION
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0.2rem 0' }}>
              {topSuggestion.title}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {topSuggestion.message}
            </p>
          </div>
        </div>

        <button onClick={handleAction} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
          Take Action <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
