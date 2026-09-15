import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const HeaderGreeting = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.name || 'Student';

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
        {getGreeting()}, {displayName} 👋
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>
        Here's what your day looks like today. Nova is ready to assist.
      </p>
    </div>
  );
};
