'use client';
import React, { useState } from 'react';
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, contactId: 'demo-contact-uuid' }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error querying memory engine.' },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col h-[calc(100vh-3.5rem)]">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Conversational Memory Recall</h1>
      
      <div className="flex-1 bg-slate-50 border rounded-lg p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xl p-3 rounded-lg text-sm ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-xs text-slate-400 italic">Searching cognitive store...</p>}
      </div>
      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything about your past interactions..."
          className="flex-1 p-2 border border-slate-300 rounded text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
        >
          Query
        </button>
      </div>
    </div>
  );
}
