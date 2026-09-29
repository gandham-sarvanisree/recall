// NEWLY CONSTRUCTED: not present in the specification document.
import * as React from 'react';
import { cn } from '@/lib/utils';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return <div className={cn('rounded-lg border border-slate-200 bg-white shadow-sm', className)} {...props} />;
}
export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn('p-4 space-y-1', className)} {...props} />;
}
export function CardTitle({ className, ...props }: DivProps) {
  return <h3 className={cn('text-base font-bold text-slate-800', className)} {...props} />;
}
export function CardDescription({ className, ...props }: DivProps) {
  return <p className={cn('text-sm text-slate-600', className)} {...props} />;
}
export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn('p-4 pt-0', className)} {...props} />;
}
