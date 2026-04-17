import React from 'react';
import { cn } from '../../lib/utils';

export const GlassCard = ({ children, className, hover = false }: { children: React.ReactNode, className?: string, hover?: boolean }) => {
  return (
    <div className={cn('glass rounded-2xl p-6', hover && 'glass-hover', className)}>
      {children}
    </div>
  );
};
