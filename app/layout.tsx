// NEWLY CONSTRUCTED: not present in the specification document.
import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/navigation';

export const metadata: Metadata = {
  title: 'Recall – AI Relationship Intelligence Agent',
  description: 'Remember every conversation, promise and follow-up with the Hindsight memory engine.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
