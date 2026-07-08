import React from 'react';

export default function TicketAssigneeBadge({ assignedTo, status }) {
  const isRouted = assignedTo !== null;

  return (
    <div className={`p-3 rounded-xl my-3 font-sans border text-xs font-mono flex justify-between items-center ${
      isRouted 
        ? 'bg-slate-900 text-indigo-300 border-slate-800' 
        : 'bg-amber-950/20 text-amber-400 border-amber-900/40'
    }`}>
      <span className="flex items-center gap-1.5">
        <span>{isRouted ? '🧑‍💻' : '⏳'}</span>
        <span>
          Queue Dispatch Status:{' '}
          <strong className="uppercase">{isRouted ? 'Auto-Assigned to Specialist' : 'Awaiting Agent Dispatch'}</strong>
        </span>
      </span>
      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-bold">
        State: {status}
      </span>
    </div>
  );
}
