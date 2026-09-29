'use client';
// NEWLY CONSTRUCTED: not present in the specification document.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/meeting-assistant', label: 'Meeting Assistant' },
  { href: '/chat', label: 'Chat' },
  { href: '/evolution', label: 'Evolution' },
  { href: '/graph', label: 'Graph' },
];

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="h-14 border-b border-slate-200 bg-white flex items-center px-8 gap-6">
      <Link href="/" className="font-bold text-slate-900 me-4">Recall</Link>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            'text-sm font-medium transition',
            pathname === l.href ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          )}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
