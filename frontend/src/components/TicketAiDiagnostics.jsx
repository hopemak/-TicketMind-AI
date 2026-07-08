import React from 'react';

export default function TicketAiDiagnostics({ aiMetadata }) {
  if (!aiMetadata || !aiMetadata.categoryProbabilities) return null;

  const { confidenceScore, categoryProbabilities, autoPrioritized } = aiMetadata;
  const percentage = Math.round(confidenceScore * 100);

  return (
    <div className="p-4 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl my-4 font-sans shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase flex items-center gap-1">
          <span>🤖</span> AI Diagnostic Matrix
        </span>
        <span className="text-xs font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
          Confidence: {percentage}%
        </span>
      </div>

      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-1.5">
        {categoryProbabilities.map((item, index) => (
          <div key={index} className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">{item.category}</span>
            <span className="text-slate-300">{Math.round(item.probability * 100)}%</span>
          </div>
        ))}
      </div>

      {autoPrioritized && (
        <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono">
          ✓ Triage bypass activated: priority auto-escalated out-of-band.
        </div>
      )}
    </div>
  );
}
