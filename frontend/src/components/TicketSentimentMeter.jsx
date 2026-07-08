import React from 'react';

export default function TicketSentimentMeter({ sentimentScore }) {
  if (sentimentScore === undefined || sentimentScore === null) return null;

  // Determine sentiment state ranges
  const isFrustrated = sentimentScore <= 0.5;
  const stateColor = isFrustrated ? 'text-rose-400 bg-rose-950/40 border-rose-900/60' : 'text-emerald-400 bg-emerald-950/30 border-emerald-900/40';
  const label = isFrustrated ? 'Frustrated / High Attrition Risk' : 'Calm / Standard Response Mood';

  return (
    <div className={`p-3 rounded-xl my-3 font-sans border flex justify-between items-center text-xs font-mono shadow-sm ${stateColor}`}>
      <span className="flex items-center gap-1.5">
        <span>{isFrustrated ? '🤬' : '😇'}</span>
        <span>Account Sentiment Context: <strong className="uppercase">{label}</strong></span>
      </span>
      <span className="bg-slate-950 text-[11px] px-2 py-0.5 rounded border border-slate-800 font-bold">
        Score: {sentimentScore}
      </span>
    </div>
  );
}
