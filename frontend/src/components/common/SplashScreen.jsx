import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export const SplashScreen = ({ onComplete }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Hold splash screen for 2.5 seconds, then start 0.5s fade out
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`splash-screen ${exiting ? 'splash-exit' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#07090e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Cinematic Glowing Background Orbs */}
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />

      {/* Energy Rings Animation */}
      <div className="splash-ring-container">
        <div className="splash-energy-ring ring-1" />
        <div className="splash-energy-ring ring-2" />
        <div className="splash-energy-ring ring-3" />

        {/* Center Glowing Logo Core */}
        <div className="splash-logo-core">
          <Sparkles size={48} color="#ffffff" className="splash-sparkle-icon" />
        </div>
      </div>

      {/* Brand Typography */}
      <div style={{ textAlign: 'center', zIndex: 10, marginTop: '2.5rem' }}>
        <h1 className="splash-title">
          NOVA
        </h1>
        <p className="splash-subtitle">
          AI STUDENT LIFE ASSISTANT
        </p>

        {/* Soft Loading Energy Bar */}
        <div className="splash-bar-outer">
          <div className="splash-bar-inner" />
        </div>
      </div>
    </div>
  );
};
