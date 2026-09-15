import React from 'react';

export const SkeletonCard = ({ height = '120px' }) => (
  <div className="glass-panel" style={{
    height,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-pulse 1.5s infinite ease-in-out',
    borderRadius: 'var(--radius-md)'
  }} />
);
