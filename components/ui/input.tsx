// NEWLY CONSTRUCTED: not present in the specification document.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full p-2 border border-slate-300 rounded text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
