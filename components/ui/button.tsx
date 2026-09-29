// NEWLY CONSTRUCTED: not present in the specification document.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
