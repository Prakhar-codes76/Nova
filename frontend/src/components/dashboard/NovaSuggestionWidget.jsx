import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Mic, MessageSquare, ArrowRight, Volume2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

export const NovaSuggestionWidget = () => {
  const { setIsVoiceOpen } = useApp();
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get('/users/me/suggestions');
        if (res.data.suggestions && res.data.suggestions.length > 0) {
          setSuggestion(res.data.suggestions[0]);
        }
      } catch (err) {
        console.warn("Could not load suggestions.");
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="glass-panel" style={{
      padding: '1.75rem',
      marginBottom: '1.75rem',
      background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(15, 23, 42, 0.95))',
      border: '1px solid rgba(14, 165, 233, 0.25)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        
        {/* Left Side: Avatar & Assistant Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          
          {/* Fictional NOVA AI Avatar */}
          <div style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0 }} className="nova-avatar-container">
            <div className="nova-avatar-ring ring-idle" style={{ inset: '-8px' }} />
            
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              border: '2px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)'
            }}>
              <Bot size={34} color="var(--accent-cyan-light)" />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>NOVA AI ASSISTANT</span>
              <span className="badge badge-cyan">● NOVA is ready</span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '480px', lineHeight: 1.5 }}>
              {suggestion ? suggestion.message : "Plan smarter, focus deeper, and streamline your study routine today."}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Voice & Chat Triggers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setIsVoiceOpen(true)}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-full)' }}
          >
            <Mic size={16} /> Talk to Nova
          </button>

          <button
            onClick={() => navigate('/ai-chat')}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.1rem', borderRadius: 'var(--radius-full)' }}
          >
            <MessageSquare size={16} /> Open Chat
          </button>
        </div>
      </div>
    </div>
  );
};
