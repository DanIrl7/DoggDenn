'use client';

import { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'pending';
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const Toast = ({ toast, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    pending: 'bg-yellow-500',
  }[toast.type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    pending: '⏳',
  }[toast.type];

  return (
    <div
      className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in-up`}
      style={{
        animation: 'fadeInDown 0.3s ease-out, fadeOutUp 0.3s ease-out 2.7s forwards',
      }}
    >
      <span className="text-3xl font-bold">{icon}</span>
      <span className="font-medium text-lg">{toast.message}</span>
    </div>
  );
};

export default Toast;
