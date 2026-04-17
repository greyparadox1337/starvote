import React from 'react';
import { cn } from '../../lib/utils';

export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warn' | 'error', className?: string }) => {
  const variants = {
    default: 'bg-white/10 text-white border-white/20',
    success: 'bg-success/20 text-success border-success/30',
    warn: 'bg-warning/20 text-warning border-warning/30',
    error: 'bg-error/20 text-error border-error/30',
  };
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm flex items-center gap-1.5', variants[variant], className)}>
      {children}
    </span>
  );
};
