import React, { useState, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { useApp } from '../../context/AppContext';
import { VOICE_STATES, DEFAULT_AGENT_ID } from '../../services/elevenlabsService';
import { AudioVisualizer } from './AudioVisualizer';
import { X, MicOff, Send, Sparkles, RefreshCw } from 'lucide-react';
import { aiService } from '../../services/aiService';
import api from '../../services/api';

export const VoiceAgentModal = () => {
  const { isVoiceOpen, setIsVoiceOpen, refreshAll, showToast } = useApp();
  const [errorMsg, setErrorMsg] = useState(null);
  const [messages, setMessages] = useState([
    { source: 'ai', text: "Hi, I'm Nova. I'm here to help you manage your student life." }
  ]);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExecutingTool, setIsExecutingTool] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('[ElevenLabs] Voice session connected successfully');
      setErrorMsg(null);
    },
    onDisconnect: () => {
      console.log('[ElevenLabs] Voice session disconnected');
    },
    onMessage: (msg) => {
      console.log('[ElevenLabs] Message received:', msg);
      if (msg && msg.message) {
        setMessages((prev) => [...prev, { source: msg.source === 'user' ? 'user' : 'ai', text: msg.message }]);
        refreshAll();
      }
    },
    onError: (err) => {
      console.error('[ElevenLabs] Error callback:', err);
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

  // Handle session connection when modal opens/closes
  useEffect(() => {
    let mounted = true;

    if (isVoiceOpen) {
      const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID || DEFAULT_AGENT_ID;
      setErrorMsg(null);

      // Check mic permissions first
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            // Stop temporary stream track used for permission checking
            stream.getTracks().forEach(t => t.stop());
            if (mounted) {
              try {
                conversation.startSession({ agentId });
              } catch (e) {
                console.error('Session start error:', e);
                setErrorMsg('Failed to initiate ElevenLabs session: ' + e.message);
              }
            }
          })
          .catch((err) => {
            console.error('Mic permission denied:', err);
            if (mounted) {
              const micErr = 'Microphone permission denied. Please allow microphone access in your browser settings to talk to Nova.';
              setErrorMsg(micErr);
              showToast(micErr, 'error');
            }
          });
      } else {
        if (mounted) {
          setErrorMsg('Microphone access is not supported by your browser.');
        }
      }
    } else {
      if (conversation.status === 'connected' || conversation.status === 'connecting') {
        conversation.endSession();
      }
      setErrorMsg(null);
    }

    return () => {
      mounted = false;
      if (conversation.status === 'connected' || conversation.status === 'connecting') {
        conversation.endSession();
      }
    };
  }, [isVoiceOpen]);

  if (!isVoiceOpen) return null;

  // Determine actual visual state
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
  } else {
    currentVoiceState = VOICE_STATES.DISCONNECTED;
  }

  const handleRetryConnection = async () => {
    setErrorMsg(null);
    const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID || DEFAULT_AGENT_ID;
    try {
      if (conversation.status === 'connected' || conversation.status === 'connecting') {
        await conversation.endSession();
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      await conversation.startSession({ agentId });
    } catch (err) {
      const msg = 'Retry failed: ' + (err.message || 'Microphone access denied or network error.');
      setErrorMsg(msg);
      showToast(msg, 'error');
    }
  };

  const handleSendTextCommand = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const userText = textInput.trim();
    setTextInput('');
    setMessages((prev) => [...prev, { source: 'user', text: userText }]);
    setIsProcessing(true);

    try {
      if (conversation.status === 'connected') {
        // Send message to live ElevenLabs conversation session
        conversation.sendUserMessage(userText);
      } else {
        // Fallback to standard AI chat endpoint
        const res = await aiService.chat(userText);
        setMessages((prev) => [...prev, { source: 'ai', text: res.response }]);
        if (res.action_performed) {
          showToast(`Action executed: ${res.action_performed}`, 'success');
        }
        await refreshAll();
      }
    } catch (err) {
      setMessages((prev) => [...prev, { source: 'ai', text: 'Sorry, I encountered an issue fulfilling that action.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = async () => {
    if (conversation.status === 'connected' || conversation.status === 'connecting') {
      await conversation.endSession();
    }
    setIsVoiceOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content glass-panel-glow" 
        style={{ maxWidth: '600px', background: 'rgba(15, 23, 42, 0.98)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Talk to Nova 🎙️</h3>
          </div>
          <button 
            onClick={handleClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Voice Visualizer */}
        <AudioVisualizer state={currentVoiceState} errorMsg={errorMsg} />

        {/* Live Conversation Stream */}
        <div style={{
          padding: '0 1.5rem',
          maxHeight: '200px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          marginBottom: '1rem'
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.source === 'user' ? 'flex-end' : 'flex-start',
                background: m.source === 'user' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 0.9rem',
                fontSize: '0.85rem',
                color: '#fff',
                maxWidth: '85%'
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Text Input & Disconnect Footer */}
        <div style={{ padding: '1rem 1.5rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <form onSubmit={handleSendTextCommand} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Or type a voice command e.g. 'Add Maths at 8 PM'..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isProcessing}
            />
            <button type="submit" className="btn btn-primary" disabled={isProcessing}>
              <Send size={16} />
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            {errorMsg ? (
              <button 
                onClick={handleRetryConnection} 
                className="btn btn-primary" 
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                <RefreshCw size={16} /> Retry Voice Connection
              </button>
            ) : (
              <button 
                onClick={handleClose} 
                className="btn btn-danger" 
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                <MicOff size={16} /> End Conversation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
