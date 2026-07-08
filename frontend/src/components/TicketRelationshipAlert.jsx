import React from 'react';

export default function TicketRelationshipAlert({ aiMetadata }) {
  if (!aiMetadata || !aiMetadata.similarTicketId) return null;

  const { isDuplicate, similarTicketId } = aiMetadata;

  return (
    <div className={`p-4 rounded-xl my-3 font-sans border shadow-sm ${
      isDuplicate 
        ? 'bg-amber-950/40 text-amber-300 border-amber-800' 
        : 'bg-slate-900 text-indigo-300 border-slate-800'
    }`}>
      <div className="flex items-start gap-2.5">
        <span className="text-base">{isDuplicate ? '⚠️' : '🔗'}</span>
        <div className="text-xs">
          <p className="font-semibold uppercase tracking-wider mb-0.5">
            {isDuplicate ? 'Potential Duplicate Detected' : 'Semantic Connection Logged'}
          </p>
          <p className="text-slate-400 font-mono">
            This issue shares a strong semantic overlay profile matching historical incident{' '}
            <span className="text-indigo-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
              #{similarTicketId}
            </span>.
          </p>
          {isDuplicate && (
            <p className="mt-2 text-[11px] text-amber-400/90 font-mono">
              ⚡ Action Recommended: Consolidate active timelines to mitigate duplicate task management.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
