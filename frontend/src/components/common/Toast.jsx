import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="var(--accent-emerald)" />,
    error: <AlertCircle size={18} color="var(--accent-rose)" />,
    info: <Info size={18} color="var(--accent-cyan)" />
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 10000,
      background: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-color)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#fff',
      fontSize: '0.9rem',
      fontWeight: 500,
      animation: 'slideIn 0.25s ease-out'
    }}>
      {icons[toast.type] || icons.info}
      <span>{toast.message}</span>
    </div>
  );
};
