import React, { useState } from 'react';
import { Send, Sparkles, User, Bot, CheckCircle2, Mic, Volume2 } from 'lucide-react';
import { aiService } from '../services/aiService';
import { useApp } from '../context/AppContext';

export const AIChatPage = () => {
  const { refreshAll, showToast, setIsVoiceOpen } = useApp();
  const [messages, setMessages] = useState([
    {
      sender: 'nova',
      text: "Hi! I'm Nova, your AI Student Life Assistant. How can I help you today?",
      action: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Plan my day",
    "Create study plan",
    "Show my tasks",
    "What's next?",
    "Start focus mode",
    "How productive was I?",
    "Show my timetable"
  ];

  const handleSend = async (msgText) => {
    const textToSend = msgText || input;
    if (!textToSend.trim()) return;

    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setLoading(true);

    try {
      const res = await aiService.chat(textToSend);
      setMessages((prev) => [...prev, {
        sender: 'nova',
        text: res.response,
        action: res.action_performed
      }]);

      if (res.action_performed) {
        showToast(`Action Confirmation: Executed ${res.action_performed}`, 'success');
      }
      await refreshAll();
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'nova', text: 'I faced a temporary issue processing that action.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      
      {/* Header Bar with NOVA Avatar & Online Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            border: '2px solid var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)'
          }}>
            <Bot size={24} color="var(--accent-cyan-light)" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>NOVA AI Assistant</h1>
              <span className="badge badge-emerald" style={{ fontSize: '0.675rem' }}>● Online</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>
              Conversational AI powered by Gemini 2.5 & ElevenLabs tool routing
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVoiceOpen(true)}
          className="btn btn-primary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.825rem', borderRadius: 'var(--radius-full)' }}
        >
          <Mic size={16} /> Voice Assistant
        </button>
      </div>

      {/* Suggested Quick Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)' }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            {m.sender === 'nova' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={18} color="#fff" />
              </div>
            )}

            <div
              style={{
                background: m.sender === 'user' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                color: '#fff',
                fontSize: '0.875rem',
                whiteSpace: 'pre-line',
                lineHeight: 1.5
              }}
            >
              {m.text}
              {m.action && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-emerald-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={12} /> Executed: {m.action}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', alignItems: 'center', padding: '0.5rem' }}>
            <Sparkles size={16} color="var(--accent-cyan)" /> NOVA is processing intent & calling tools...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Ask Nova or type a quick command e.g. 'Plan my day'..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
