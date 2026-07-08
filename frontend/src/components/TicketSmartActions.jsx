import React, { useState } from 'react';

export default function TicketSmartActions({ aiMetadata }) {
  if (!aiMetadata) return null;
  const { keywords = [], suggestedReply = "" } = aiMetadata;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(suggestedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl my-4 text-slate-100 font-sans shadow-md">
      {/* Keywords Section */}
      <div className="mb-4">
        <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase block mb-2">
          🏷️ Extracted Entity Tokens
        </span>
        <div className="flex flex-wrap gap-2">
          {keywords.map((tag, idx) => (
            <span key={idx} className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700 font-mono">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Suggested Response Section */}
      {suggestedReply && (
        <div className="mt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
              ✍️ AI Suggested Assistant Response
            </span>
            <button 
              onClick={copyToClipboard}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition-colors duration-150 active:scale-95"
            >
              {copied ? '✓ Copied!' : 'Copy Draft'}
            </button>
          </div>
          <div className="p-3 bg-slate-950 text-slate-300 text-xs rounded-lg border border-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
            {suggestedReply}
          </div>
        </div>
      )}
    </div>
  );
}
