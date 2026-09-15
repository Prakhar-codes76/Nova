import React from 'react';
import { VOICE_STATES } from '../../services/elevenlabsService';
import { Sparkles, Mic, Volume2, Brain, AlertCircle } from 'lucide-react';

export const AudioVisualizer = ({ state, errorMsg }) => {
  const getSubtext = () => {
    if (errorMsg) return errorMsg;
    switch (state) {
      case VOICE_STATES.CONNECTING: return 'Establishing encrypted WebRTC voice bridge with Nova AI...';
      case VOICE_STATES.CONNECTED: return 'Connected! Say "Nova, what is my schedule today?" or ask a question.';
      case VOICE_STATES.LISTENING: return 'Listening to your voice command... 🎙️';
      case VOICE_STATES.THINKING: return 'Nova is processing & executing backend tools... 🧠';
      case VOICE_STATES.SPEAKING: return 'Nova AI is responding... 🔊';
      case VOICE_STATES.ERROR: return errorMsg || 'Voice connection error or microphone permission denied.';
      default: return 'Ready to activate voice connection.';
    }
  };

  const getOrbGradient = () => {
    if (errorMsg || state === VOICE_STATES.ERROR) {
      return 'linear-gradient(135deg, #f43f5e, #e11d48)';
    }
    switch (state) {
      case VOICE_STATES.SPEAKING:
        return 'linear-gradient(135deg, #10b981, #06b6d4)';
      case VOICE_STATES.THINKING:
        return 'linear-gradient(135deg, #8b5cf6, #ec4899)';
      case VOICE_STATES.LISTENING:
        return 'linear-gradient(135deg, #6366f1, #06b6d4)';
      case VOICE_STATES.CONNECTING:
        return 'linear-gradient(135deg, #f59e0b, #6366f1)';
      default:
        return 'linear-gradient(135deg, #6366f1, #3b82f6)';
    }
  };

  const getIcon = () => {
    if (errorMsg || state === VOICE_STATES.ERROR) return <AlertCircle size={36} color="#fff" />;
    switch (state) {
      case VOICE_STATES.SPEAKING: return <Volume2 size={36} color="#fff" />;
      case VOICE_STATES.THINKING: return <Brain size={36} color="#fff" />;
      case VOICE_STATES.LISTENING: return <Mic size={36} color="#fff" />;
      default: return <Sparkles size={36} color="#fff" />;
    }
  };

  const isAnimated = state === VOICE_STATES.LISTENING || state === VOICE_STATES.SPEAKING || state === VOICE_STATES.THINKING;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem 1rem' }}>
      {/* VFX Orb Container */}
      <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Orbital Energy Rings */}
        <div style={{
          position: 'absolute',
          inset: '-10px',
          borderRadius: '50%',
          border: '1.5px dashed rgba(6, 182, 212, 0.4)',
          animation: isAnimated ? 'ringRotate 8s linear infinite' : 'none'
        }} />

        <div style={{
          position: 'absolute',
          inset: '-22px',
          borderRadius: '50%',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          animation: isAnimated ? 'ringPulse 2.5s ease-in-out infinite alternate' : 'none'
        }} />

        {/* Ambient Glow */}
        <div style={{
          position: 'absolute',
          inset: '0px',
          borderRadius: '50%',
          background: getOrbGradient(),
          filter: 'blur(25px)',
          opacity: 0.6,
          transition: 'all 0.4s ease'
        }} />

        {/* Center Orb Core */}
        <div className={`pulse-circle ${isAnimated ? 'pulse-active' : ''}`} style={{
          width: '100px',
          height: '100px',
          background: getOrbGradient(),
          position: 'relative',
          zIndex: 5,
          boxShadow: '0 0 35px rgba(99, 102, 241, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          {getIcon()}
        </div>
      </div>

      {/* State Info */}
      <div style={{ textAlign: 'center', zIndex: 5 }}>
        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem', letterSpacing: '-0.01em' }}>
          {errorMsg ? 'CONNECTION FAILED' : state}
        </h4>
        <p style={{ fontSize: '0.85rem', color: errorMsg ? '#f43f5e' : 'var(--text-muted)', maxWidth: '380px', margin: '0 auto' }}>
          {getSubtext()}
        </p>
      </div>
    </div>
  );
};
