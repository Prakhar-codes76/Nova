import React, { useState } from 'react';
import { Send, Sparkles, User, Bot, CheckCircle2 } from 'lucide-react';
import { aiService } from '../services/aiService';
import { useApp } from '../context/AppContext';

export const AIChatPage = () => {
  const { refreshAll, showToast } = useApp();
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
    "What is my schedule today?",
    "What tasks are pending?",
    "Add Python practice tomorrow at 7 PM",
    "Mark DSA assignment complete",
    "I have a Maths exam next Friday. Make me a study plan.",
    "Start a 25 minute focus session"
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
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Nova AI Assistant 🧠</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Real backend tool integration — ask Nova to read or modify your actual tasks, schedule & study plans.
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)' }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '0.85rem',
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            {m.sender === 'nova' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={16} color="#fff" />
              </div>
            )}

            <div
              style={{
                background: m.sender === 'user' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.1rem',
                color: '#fff',
                fontSize: '0.9rem',
                whiteSpace: 'pre-line'
              }}
            >
              {m.text}
              {m.action && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={12} /> Tool Executed: {m.action}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', alignItems: 'center' }}>
            <Sparkles size={16} className="pulse-active" /> Nova is analyzing intent & calling backend tools...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Ask Nova or give an action command..."
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
