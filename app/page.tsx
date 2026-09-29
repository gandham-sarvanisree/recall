// NEWLY CONSTRUCTED: not present in the specification document.
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const sections = [
  { href: '/meeting-assistant', title: 'Live Meeting Assistant', description: 'Speak into your mic and watch memories get classified in real time.' },
  { href: '/chat', title: 'Memory Recall Chat', description: 'Ask questions about your past interactions with a contact.' },
  { href: '/evolution', title: 'Memory Evolution', description: 'A timeline of how your knowledge of a contact has grown.' },
  { href: '/graph', title: 'Relationship Graph', description: 'People, companies and topics extracted from your memories.' },
];

export default function HomePage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Recall</h1>
        <p className="text-slate-600">AI Relationship Intelligence Agent: never forget what was discussed, promised or left unfinished.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="block transition hover:-translate-y-0.5">
            <Card className="h-full hover:border-blue-500">
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm font-semibold text-blue-600">Open →</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
