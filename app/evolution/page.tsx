'use client';
import React from 'react';
interface TimelineEvent {
  date: string;
  category: 'Episodic' | 'Semantic' | 'Procedural';
  title: string;
  details: string;
}
const mockEvents: TimelineEvent[] = [
  {
    date: '2025-01-15',
    category: 'Episodic',
    title: 'Initial Discovery Call',
    details: 'Met at Tech Summit. Discussed Enterprise AI deployment targets.',
  },
  {
    date: '2025-01-22',
    category: 'Semantic',
    title: 'Budget Preference Identified',
    details: 'Learned contact operates on strict quarterly allocation cycles.',
  },
  {
    date: '2025-02-05',
    category: 'Procedural',
    title: 'Security Review Workflow',
    details: 'Established custom escalation protocol through Vendor Risk team.',
  },
];
export default function EvolutionPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Memory Evolution Timeline</h1>
        <p className="text-sm text-slate-500">Longitudinal cognitive trajectory across interaction milestones</p>
      </div>
      <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
        {mockEvents.map((evt, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-9 top-0 w-6 h-6 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center" />
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400">{evt.date}</span>
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {evt.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800">{evt.title}</h3>
              <p className="text-sm text-slate-600">{evt.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
