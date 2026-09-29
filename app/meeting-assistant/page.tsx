'use client';
import React, { useState, useEffect, useRef } from 'react';
interface LiveMemory {
  type: 'episodic' | 'semantic' | 'procedural';
  content: string; // restored: this line was corrupted in the source document
  confidence: number;
}
export default function MeetingAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [liveMemories, setLiveMemories] = useState<LiveMemory[]>([]);
  const [scenario, setScenario] = useState<string>('Contract Negotiation');
  const [simulationResult, setSimulationResult] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = async (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (event.results[event.results.length - 1].isFinal) {
          await processLiveChunk(currentTranscript);
        }
      };
    }
  }, []);
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };
  const processLiveChunk = async (text: string) => {
    try {
      const res = await fetch('/api/memory/live-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcriptChunk: text, contactId: 'demo-contact-uuid' }),
      });
      const data = await res.json();
      if (data.memories) {
        setLiveMemories((prev) => [...data.memories, ...prev]);
      }
    } catch (err) {
      console.error('Failed to classify live memory:', err);
    }
  };
  const runSimulation = async () => {
    setSimulationResult('Simulating strategic counter-responses based on historical relationship memories...');
    setTimeout(() => {
      setSimulationResult(
        `Scenario: [${scenario}]\nRecommended Strategy: Pivot to long-term licensing discount. Historical memory indicates the contact values predictability over upfront margin.`
      );
    }, 1200);
  };
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <header className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Meeting Intelligence & Simulator</h1>
          <p className="text-sm text-slate-500">Real-time Web Speech classification & strategic memory synthesis</p>
        </div>
        <button
          onClick={toggleListening}
          className={`px-4 py-2 rounded-md font-semibold text-white transition ${
            isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isListening ? 'Stop Listening' : 'Start Live Stream'}
        </button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h2 className="font-semibold text-slate-800 mb-2">Live Speech Stream</h2>
          <div className="h-48 overflow-y-auto p-3 bg-white border rounded text-sm text-slate-700">
            {transcript || 'Click "Start Live Stream" and begin speaking...'}
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h2 className="font-semibold text-slate-800 mb-2">Classified Memories (Real-Time)</h2>
          <div className="h-48 overflow-y-auto space-y-2">
            {liveMemories.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No structured memories captured yet.</p>
            ) : (
              liveMemories.map((mem, idx) => (
                <div key={idx} className="p-2 bg-white border border-slate-200 rounded text-xs">
                  <span className="font-bold uppercase tracking-wider text-blue-600 me-2">[{mem.type}]</span>
                  <span>{mem.content}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
        <h2 className="font-semibold text-slate-800">Relationship Scenario Simulator</h2>
        <div className="flex gap-4">
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="p-2 border rounded text-sm bg-white text-slate-800"
          >
            <option>Contract Negotiation</option>
            <option>Project Delay Disclosure</option>
            <option>Executive Escalation</option>
          </select>
          <button
            onClick={runSimulation}
            className="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-semibold hover:bg-emerald-700"
          >
            Run Simulation
          </button>
        </div>
        {simulationResult && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-sm whitespace-pre-line">
            {simulationResult}
          </div>
        )}
      </div>
    </div>
  );
}
