import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const p = (priority || 'medium').toLowerCase();
  const classes = {
    high: 'badge badge-high',
    medium: 'badge badge-medium',
    low: 'badge badge-low'
  };
  const labels = {
    high: '🔴 High',
    medium: '🟡 Medium',
    low: '🟢 Low'
  };
  return <span className={classes[p] || classes.medium}>{labels[p] || labels.medium}</span>;
};

export const StatusBadge = ({ status }) => {
  const s = (status || 'pending').toLowerCase();
  const classes = {
    completed: 'badge badge-completed',
    delayed: 'badge badge-delayed',
    pending: 'badge'
  };
  const labels = {
    completed: '✓ Completed',
    delayed: '⚠️ Delayed',
    pending: '⏳ Pending'
  };
  return (
    <span className={classes[s] || 'badge'} style={s === 'pending' ? { background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' } : {}}>
      {labels[s] || s}
    </span>
  );
};
