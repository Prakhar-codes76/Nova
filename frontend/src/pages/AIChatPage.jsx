import React, { useState, useEffect, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Compass, 
  CheckCircle2, 
  Volume2, 
  ArrowUp, 
  RefreshCw, 
  Globe, 
  Bot, 
  Radio, 
  ShieldCheck,
  VolumeX
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { VOICE_STATES, DEFAULT_AGENT_ID } from '../services/elevenlabsService';
import { AudioVisualizer } from '../components/voice/AudioVisualizer';
import api from '../services/api';

export const AIChatPage = () => {
  const { refreshAll, showToast } = useApp();
  const { user } = useAuth();
  
  const [errorMsg, setErrorMsg] = useState(null);
  const [messages, setMessages] = useState([
    {
      source: 'ai',
      text: "Namaste! I'm Nova, your AI assistant. I can speak Hindi, Hinglish, English, Bhojpuri, Tamil, Telugu, and more. How can I help you today? 🎙️"
    }
  ]);
  const [input, setInput] = useState('');
  const [isExecutingTool, setIsExecutingTool] = useState(false);
  const messagesEndRef = useRef(null);

  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID || DEFAULT_AGENT_ID;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const conversation = useConversation({
    onConnect: () => {
      console.log('[ElevenLabs] Agent session connected:', agentId);
      setErrorMsg(null);
    },
    onDisconnect: () => {
      console.log('[ElevenLabs] Agent session disconnected');
    },
    onMessage: (msg) => {
      console.log('[ElevenLabs] Message received:', msg);
      if (msg && msg.message) {
        setMessages((prev) => [
          ...prev,
          { source: msg.source === 'user' ? 'user' : 'ai', text: msg.message }
        ]);
        refreshAll();
      }
    },
    onError: (err) => {
      console.error('[ElevenLabs] Error:', err);
      let message = 'Voice connection error occurred.';
      if (typeof err === 'string') {
        message = err;
      } else if (err && err.message) {
        message = err.message;
      }
      setErrorMsg(message);
      showToast(message, 'error');
    },
    clientTools: {
      get_today_schedule: async () => {
        setIsExecutingTool(true);
        try {
          const res = await api.post('/voice/get-today-schedule');
          return res.data.voice_response || 'Schedule retrieved.';
        } catch (e) {
          return 'Failed to retrieve schedule.';
        } finally {
          setIsExecutingTool(false);
        }
      },
      get_pending_tasks: async () => {
        setIsExecutingTool(true);
        try {
          const res = await api.post('/voice/get-pending-tasks');
          return res.data.voice_response || 'Pending tasks retrieved.';
        } catch (e) {
          return 'Failed to retrieve pending tasks.';
        } finally {
          setIsExecutingTool(false);
        }
      },
      add_task: async (params) => {
        setIsExecutingTool(true);
        try {
          const res = await api.post('/voice/add-task', params);
          await refreshAll();
          return res.data.voice_response || 'Task added successfully.';
        } catch (e) {
          return 'Failed to add task.';
        } finally {
          setIsExecutingTool(false);
        }
      },
      complete_task: async (params) => {
        setIsExecutingTool(true);
        try {
          const res = await api.post('/voice/complete-task', params);
          await refreshAll();
          return res.data.voice_response || 'Task marked as completed.';
        } catch (e) {
          return 'Failed to mark task as completed.';
        } finally {
          setIsExecutingTool(false);
        }
      },
      start_focus_session: async (params) => {
        setIsExecutingTool(true);
        try {
          const res = await api.post('/voice/start-focus-session', params);
          return res.data.voice_response || 'Focus session initiated.';
        } catch (e) {
          return 'Failed to start focus session.';
        } finally {
          setIsExecutingTool(false);
        }
      }
    }
  });

  const handleStartSession = async () => {
    setErrorMsg(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errStr = 'Microphone access is not supported by your browser.';
      setErrorMsg(errStr);
      showToast(errStr, 'error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      if (conversation.status === 'connected' || conversation.status === 'connecting') {
        await conversation.endSession();
      }

      await conversation.startSession({ agentId });
      showToast('Connected to ElevenLabs Voice Agent 🎙️', 'success');
    } catch (err) {
      console.error('Session start failed:', err);
      const msg = 'Microphone permission denied or connection issue: ' + (err.message || '');
      setErrorMsg(msg);
      showToast(msg, 'error');
    }
  };

  const handleEndSession = async () => {
    if (conversation.status === 'connected' || conversation.status === 'connecting') {
      await conversation.endSession();
      showToast('Voice session ended', 'info');
    }
  };

  const handleSendText = async (customText) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMsg = textToSend.trim();
    if (!customText) setInput('');

    setMessages((prev) => [...prev, { source: 'user', text: userMsg }]);

    if (conversation.status === 'connected') {
      try {
        await conversation.sendUserMessage(userMsg);
      } catch (err) {
        console.error('Failed to send text to ElevenLabs conversation:', err);
      }
    } else {
      // Auto-connect and then send or notify
      showToast('Connecting to voice agent to send your query...', 'info');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        await conversation.startSession({ agentId });
        setTimeout(() => {
          conversation.sendUserMessage(userMsg);
        }, 800);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { source: 'ai', text: "Please click 'Start Voice Session' to enable live conversation." }
        ]);
      }
    }
  };

  // Determine current voice visual state
  let currentVoiceState = VOICE_STATES.DISCONNECTED;
  if (errorMsg) {
    currentVoiceState = VOICE_STATES.ERROR;
  } else if (conversation.status === 'connecting') {
    currentVoiceState = VOICE_STATES.CONNECTING;
  } else if (conversation.status === 'connected') {
    if (isExecutingTool) {
      currentVoiceState = VOICE_STATES.THINKING;
    } else if (conversation.isSpeaking) {
      currentVoiceState = VOICE_STATES.SPEAKING;
    } else if (conversation.isListening) {
      currentVoiceState = VOICE_STATES.LISTENING;
    } else {
      currentVoiceState = VOICE_STATES.CONNECTED;
    }
  }

  const quickPrompts = [
    { title: "Kaisa ho? Aaj ka kya plan hai?", desc: "Ask in Hindi / Hinglish", icon: Globe, color: "var(--accent-indigo)" },
    { title: "What are my tasks for today?", desc: "Task & Schedule check", icon: CheckCircle2, color: "var(--accent-cyan)" },
    { title: "Add Maths revision at 8 PM", desc: "Voice Command", icon: Mic, color: "var(--accent-emerald)" },
    { title: "Start 25 min focus timer", desc: "Pomodoro session", icon: Volume2, color: "var(--accent-amber)" },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 80px)',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-primary)'
    }}>
      
      {/* Background AI Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.25,
        zIndex: 0,
        filter: 'brightness(0.6) contrast(1.2)',
        mixBlendMode: 'luminosity'
      }} />

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(11, 15, 23, 0.96) 0%, rgba(15, 23, 42, 0.92) 50%, rgba(11, 15, 23, 0.96) 100%)',
        zIndex: 1
      }} />

      {/* Main Content Area */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '1.75rem',
        gap: '1.5rem'
      }}>
        
        {/* Top Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          {/* Left Greeting */}
          <div style={{ maxWidth: '460px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
              }}>
                <Sparkles size={22} color="#fff" />
              </div>
              <div>
                <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                  <Radio size={12} style={{ animation: 'pulse 1.5s infinite' }} /> ElevenLabs Agent {agentId.slice(0, 10)}...
                </span>
              </div>
            </div>
            
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              NOVA Voice Assistant
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 400 }}>
              Speak naturally in <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Hindi, Hinglish, English, Bhojpuri, Tamil, Telugu</span> or any language.
            </p>
          </div>

          {/* Right Quick Prompts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', maxWidth: '520px' }}>
            {quickPrompts.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} 
                  onClick={() => handleSendText(p.title)}
                  className="glass-panel-interactive"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)',
                    background: 'rgba(30, 41, 59, 0.65)',
                    backdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer', flex: '1 1 220px', transition: 'all 0.2s ease'
                  }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 15px ${p.color}40`, flexShrink: 0
                  }}>
                    <Icon size={16} color="#fff" />
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{p.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Embedded ElevenLabs Voice Assistant Panel */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          margin: '0 auto',
          width: '100%',
          maxWidth: '960px'
        }}>
          
          {/* Panel Top Status & Controls Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(30, 41, 59, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bot size={22} color="var(--accent-cyan)" />
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  NOVA Conversational Agent
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Powered by ElevenLabs Agent: <code style={{ color: 'var(--accent-cyan-light)', background: 'rgba(14, 165, 233, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{agentId}</code>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {conversation.status === 'connected' ? (
                <button
                  onClick={handleEndSession}
                  className="btn btn-danger"
                  style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                >
                  <MicOff size={16} /> Disconnect
                </button>
              ) : (
                <button
                  onClick={handleStartSession}
                  className="btn btn-primary"
                  style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Mic size={16} /> Start Voice Session 🎙️
                </button>
              )}
            </div>
          </div>

          {/* Interactive Voice Visualizer Center */}
          <div style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(11, 15, 23, 0.4)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <AudioVisualizer state={currentVoiceState} errorMsg={errorMsg} />
          </div>

          {/* Live Multilingual Conversation Stream */}
          <div style={{
            flex: 1,
            minHeight: '220px',
            maxHeight: '340px',
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.source === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.25rem',
                  alignSelf: m.source === 'user' ? 'flex-end' : 'flex-start',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  {m.source === 'user' ? 'You' : 'Nova Agent'}
                </div>
                <div style={{
                  background: m.source === 'user' 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(79, 70, 229, 0.2))' 
                    : 'rgba(30, 41, 59, 0.6)',
                  backdropFilter: 'blur(16px)',
                  border: m.source === 'user' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.85rem 1.15rem',
                  borderRadius: m.source === 'user' ? '1.15rem 1.15rem 0 1.15rem' : '1.15rem 1.15rem 1.15rem 0',
                  color: '#fff',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Integrated Message Form Input */}
          <div style={{
            padding: '1rem 1.5rem',
            background: 'rgba(30, 41, 59, 0.5)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendText(); }} 
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <input
                type="text"
                className="form-input"
                placeholder={conversation.status === 'connected' ? "Type a message or speak into your mic in Hindi/English..." : "Type your query or click 'Start Voice Session'..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ flex: 1, background: 'rgba(15, 23, 42, 0.7)', fontSize: '0.95rem' }}
              />
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!input.trim()}
                style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-md)' }}
              >
                <Send size={16} /> Send
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AIChatPage;
