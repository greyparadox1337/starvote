import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'px-4 py-2 rounded-xl font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20',
          variant === 'outline' && 'border border-white/20 hover:bg-white/10 text-white',
          variant === 'danger' && 'bg-error/20 text-error hover:bg-error/30 border border-error/50',
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <span className="animate-spin mr-2 border-2 border-white/20 border-t-white rounded-full w-4 h-4" /> : null}
        {children as React.ReactNode}
      </motion.button>
    );
  }
);
