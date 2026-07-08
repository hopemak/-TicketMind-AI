import React from 'react';

export default function TicketAiExplanation({ explanation }) {
  if (!explanation || !explanation.primaryReason) return null;

  return (
    <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl my-4 text-slate-200 font-sans shadow-inner">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase font-mono">
          🔍 Decision Attribution Model (XAI)
        </span>
      </div>
      
      <p className="text-xs font-mono text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 leading-relaxed mb-3">
        {explanation.primaryReason}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-slate-500 uppercase font-mono tracking-tight">Active weights:</span>
        {explanation.topImpactTokens.map((token, idx) => (
          <span key={idx} className="bg-indigo-950 text-indigo-400 text-[10px] px-2 py-0.5 rounded border border-indigo-900/60 font-mono">
            {token} (+α weight)
          </span>
        ))}
      </div>
    </div>
  );
}
