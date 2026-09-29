'use client';
import React from 'react';
interface GraphNode {
  id: string;
  label: string;
  type: 'Person' | 'Company' | 'Topic';
}
const nodes: GraphNode[] = [
  { id: '1', label: 'Sarah Jenkins', type: 'Person' },
  { id: '2', label: 'Apex Global', type: 'Company' },
  { id: '3', label: 'LLM Fine-Tuning', type: 'Topic' },
];
export default function GraphPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Interactive Relationship Network Graph</h1>
        <p className="text-sm text-slate-500">Entity relationship visualization derived from memory graph extractions</p>
      </div>
      <div className="h-96 border border-slate-200 rounded-lg bg-slate-900 p-6 flex items-center justify-center relative overflow-hidden">
        <div className="text-slate-400 text-xs absolute top-4 left-4">Canvas Render Engine (SVG/D3 Node Map)</div>
        
        <div className="flex gap-12 items-center justify-center">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="p-4 bg-slate-800 border border-slate-700 rounded-full text-center text-white space-y-1 shadow-lg hover:border-blue-500 cursor-pointer transition"
            >
              <div className="text-xs text-blue-400 uppercase font-semibold">{node.type}</div>
              <div className="text-sm font-bold">{node.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
