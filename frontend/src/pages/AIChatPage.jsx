import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, CheckCircle2, Mic, Volume2, Paperclip, ArrowUp, Home, MessageSquare, CheckSquare, Compass, Settings } from 'lucide-react';
import { aiService } from '../services/aiService';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const AIChatPage = () => {
  const { refreshAll, showToast, setIsVoiceOpen } = useApp();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([
    {
      sender: 'nova',
      text: "I'm here to help you learn, plan, create, and get things done. What would you like to start with? 😊",
      action: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    { title: "Get answers", desc: "to your questions", icon: Sparkles, color: "var(--accent-indigo)" },
    { title: "Stay organized", desc: "with tasks & reminders", icon: CheckCircle2, color: "var(--accent-cyan)" },
    { title: "Explore ideas", desc: "and discover new things", icon: Compass, color: "var(--accent-emerald)" },
    { title: "Get things done", desc: "with smart assistance", icon: Volume2, color: "var(--accent-amber)" },
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
        showToast(`Action Executed: ${res.action_performed}`, 'success');
      }
      await refreshAll();
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'nova', text: 'I faced a temporary issue processing that request.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 80px)',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-primary)'
    }}>
      
      {/* Background AI Avatar (Large & Realistic) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.6,
        zIndex: 0,
        filter: 'brightness(0.7) contrast(1.1)',
        mixBlendMode: 'luminosity'
      }}></div>

      {/* Gradient Overlay to make text readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(11, 15, 23, 0.95) 0%, rgba(11, 15, 23, 0.6) 40%, rgba(11, 15, 23, 0.4) 100%)',
        zIndex: 1
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        background: 'linear-gradient(to top, rgba(11, 15, 23, 1) 0%, rgba(11, 15, 23, 0.8) 40%, transparent 100%)',
        zIndex: 1
      }}></div>

      {/* Main Content Area */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '2rem'
      }}>
        
        {/* Top Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          
          {/* Left Greeting */}
          <div style={{ maxWidth: '400px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem', boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fff' }}></div>
            </div>
            
            <h3 style={{ color: 'var(--accent-indigo)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Hello!
            </h3>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              I'm your AI<br/>assistant.
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 400 }}>
              How can I help<br/>you today? <span style={{ color: 'var(--accent-cyan)' }}>💙</span>
            </p>
          </div>

          {/* Right Floating Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
            {quickPrompts.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} 
                  onClick={() => handleSend(p.title)}
                  className="glass-panel-interactive"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)',
                    background: 'rgba(30, 41, 59, 0.65)',
                    backdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer', minWidth: '240px', transition: 'all 0.2s ease'
                  }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 15px ${p.color}40`
                  }}>
                    <Icon size={18} color="#fff" />
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{p.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat Area (Bottom half) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          
          {/* Messages Container */}
          <div style={{ 
            maxHeight: '40vh', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            marginBottom: '1.5rem',
            paddingRight: '1rem'
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  background: m.sender === 'user' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                  backdropFilter: 'blur(16px)',
                  border: m.sender === 'user' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '1rem 1.25rem',
                  borderRadius: m.sender === 'user' ? '1.25rem 1.25rem 0 1.25rem' : '1.25rem 1.25rem 1.25rem 0',
                  color: '#fff',
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}>
                  {m.text}
                </div>
                {m.action && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-emerald-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={12} /> Executed: {m.action}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '1.25rem 1.25rem 1.25rem 0', display: 'flex', gap: '0.5rem', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Sparkles size={16} color="var(--accent-cyan)" className="nova-avatar-ring ring-speaking" />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-muted)' }} onClick={() => setIsVoiceOpen(true)}>
              <Mic size={22} />
            </button>
            <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-muted)' }}>
              <Paperclip size={20} />
            </button>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Message your assistant..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%', background: 'transparent', border: 'none', color: '#fff',
                  fontSize: '1.05rem', outline: 'none', padding: '0.5rem'
                }}
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                style={{
                  background: input.trim() ? 'var(--accent-indigo)' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff', border: 'none', borderRadius: '50%',
                  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: input.trim() ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  marginLeft: '0.5rem'
                }}
              >
                <ArrowUp size={20} />
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

