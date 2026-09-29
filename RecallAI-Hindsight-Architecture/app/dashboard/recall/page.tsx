'use client';
import { useState } from 'react';

export default function HindsightRecallPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRecall = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/hindsight/recall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Hindsight Intelligence Search</h1>
      <form onSubmit={handleRecall} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do I know about Sarah's project commitments?"
          className="flex-1 border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
          {loading ? 'Searching...' : 'Recall'}
        </button>
      </form>

      {result && (
        <div className="space-y-6">
          <div className="p-4 bg-white border rounded-xl shadow-sm">
            <h2 className="font-semibold text-lg text-gray-800 mb-2">Synthesized Answer</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{result.answer}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 border rounded-xl">
              <h3 className="font-medium text-sm text-gray-500 mb-2">Active Memories</h3>
              <ul className="space-y-2 text-sm">
                {result.sources.memories.map((m: any, i: number) => (
                  <li key={i} className="bg-white p-2 rounded border">• {m.content}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-gray-50 border rounded-xl">
              <h3 className="font-medium text-sm text-gray-500 mb-2">Reflective Insights</h3>
              <ul className="space-y-2 text-sm">
                {result.sources.reflections.map((r: any, i: number) => (
                  <li key={i} className="bg-white p-2 rounded border font-medium text-amber-700">
                    [{r.reflection_type.toUpperCase()}] {r.content}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
