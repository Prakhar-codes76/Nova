import React, { useState, useEffect, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  Globe,
  CheckCircle2,
  Volume2,
  Bot,
  Radio,
  Clock,
  Flame,
  Brain,
  MessageSquare
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
      text: "Namaste! I am NOVA, your AI Student Life Assistant. I can understand Hindi, Hinglish, and English. Ask me about your tasks, schedule, or ask me to start a focus session! 🎙️"
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
      console.log('[ElevenLabs] Connected to agent:', agentId);
      setErrorMsg(null);
    },
    onDisconnect: () => {
      console.log('[ElevenLabs] Disconnected from agent');
    },
    onMessage: (msg) => {
      console.log('[ElevenLabs] Message event:', msg);
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
      showToast('Connected to NOVA Voice Agent 🎙️', 'success');
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
      showToast('Voice session disconnected', 'info');
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
        console.error('Failed to send message to ElevenLabs:', err);
      }
    } else {
      // Send message to text AI endpoint as seamless fallback
      try {
        const res = await api.post('/ai/chat', { message: userMsg });
        if (res.data && res.data.response) {
          setMessages((prev) => [...prev, { source: 'ai', text: res.data.response }]);
          refreshAll();
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { source: 'ai', text: "Main aapki query process kar raha hoon. Voice start karne ke liye 'Connect Voice' click karein!" }
        ]);
      }
    }
  };

  // Determine visual agent state
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
    { title: "Aaj ka schedule kya hai?", desc: "Check Timetable", icon: Clock, color: "var(--accent-cyan)" },
    { title: "Mere pending tasks dikhao", desc: "View Tasks", icon: CheckCircle2, color: "var(--accent-indigo)" },
    { title: "Maths assignment task add karo", desc: "Voice Command", icon: Mic, color: "var(--accent-emerald)" },
    { title: "25 min focus timer start karo", desc: "Pomodoro Focus", icon: Flame, color: "var(--accent-amber)" },
  ];

  return (
    <div className="page-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      paddingBottom: '2rem'
    }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(124, 92, 255, 0.08))',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(14, 165, 233, 0.2)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-cyan">
              <Radio size={12} style={{ animation: 'pulseGreen 1.5s infinite' }} /> ElevenLabs Agent {agentId.slice(0, 12)}...
            </span>
            <span className="badge badge-purple">
              <Globe size={12} /> Hindi / Hinglish / English
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'var(--font-heading)' }}>
            NOVA AI Voice & Study Assistant
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {conversation.status === 'connected' ? (
            <button
              onClick={handleEndSession}
              className="btn btn-danger"
              style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.25rem' }}
            >
              <MicOff size={16} /> Disconnect Voice
            </button>
          ) : (
            <button
              onClick={handleStartSession}
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1.35rem' }}
            >
              <Mic size={16} /> Connect Voice Agent 🎙️
            </button>
          )}
        </div>
      </div>

      {/* Dual Panel Layout: Left Assistant Visual + Right Conversation Stream */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem',
        alignItems: 'stretch'
      }}>

        {/* Left Panel: NOVA Visual & Voice Orb Visualizer */}
        <div className="glass-panel" style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          padding: '2rem 1.5rem',
          minHeight: '440px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(8, 12, 25, 0.95) 100%)'
        }}>
          {/* Background Assistant Mesh Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("/assets/nova-assistant.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
            filter: 'brightness(0.5)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            {/* Visualizer Orb */}
            <AudioVisualizer state={currentVoiceState} errorMsg={errorMsg} />

            {/* Quick Intent Pills */}
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              {quickPrompts.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendText(p.title)}
                    className="glass-panel-interactive"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={16} color={p.color} style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#fff', fontSize: '0.775rem', fontWeight: 600 }}>{p.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.675rem' }}>{p.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Conversation Stream & Input Form */}
        <div className="glass-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          height: '520px',
          overflow: 'hidden'
        }}>
          {/* Transcript Top Bar */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            background: 'rgba(15, 23, 42, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Bot size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Live Transcript
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {messages.length} message(s)
            </span>
          </div>

          {/* Messages Stream */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.source === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{
                  fontSize: '0.675rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.25rem',
                  alignSelf: m.source === 'user' ? 'flex-end' : 'flex-start',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  {m.source === 'user' ? (user?.name || 'You') : 'NOVA AI'}
                </div>
                <div style={{
                  background: m.source === 'user'
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.35), rgba(14, 165, 233, 0.25))'
                    : 'rgba(30, 41, 59, 0.65)',
                  backdropFilter: 'blur(16px)',
                  border: m.source === 'user' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.85rem 1.15rem',
                  borderRadius: m.source === 'user' ? '1.15rem 1.15rem 0 1.15rem' : '1.15rem 1.15rem 1.15rem 0',
                  color: '#fff',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <div style={{
            padding: '0.85rem 1rem',
            background: 'rgba(15, 23, 42, 0.8)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendText(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}
            >
              <input
                type="text"
                className="form-input"
                placeholder={conversation.status === 'connected' ? "Ask NOVA anything in Hindi/English..." : "Type your query or click Connect Voice..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ flex: 1, background: 'rgba(8, 12, 25, 0.8)', fontSize: '0.9rem' }}
              />

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!input.trim()}
                style={{ padding: '0.65rem 1.1rem' }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIChatPage;
