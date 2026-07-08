import React, { useState } from 'react';

export default function TicketBatchUploader({ onBatchComplete }) {
  const [csvInput, setCsvInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [log, setLog] = useState('');

  const sampleTemplate = "title,description\n\"Database Crash\",\"The production mongo instance disconnected\"\n\"Billing Error\",\"Stripe failed to charge my renewal account subscription\"";

  const executeBatchUpload = async () => {
    if (!csvInput.trim()) return;
    setProcessing(true);
    setLog('Parsing matrix boundaries... processing AI classification array...');

    try {
      const response = await fetch('/api/tickets/batch-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText: csvInput })
      });
      const data = await response.json();
      if (data.success) {
        setLog(`Success! Processed ${data.count} items into live active tickets databases cleanly.`);
        setCsvInput('');
        if (onBatchComplete) onBatchComplete();
      } else {
        setLog(`Ingestion Failure: ${data.error}`);
      }
    } catch (err) {
      setLog('Network error executing ingestion pipeline.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl my-6 font-sans shadow-xl text-slate-100">
      <h3 className="text-sm font-bold tracking-tight text-white mb-1 flex items-center gap-1.5">
        <span>📦</span> Bulk Ingestion CSV Pipeline
      </h3>
      <p className="text-[11px] text-slate-500 font-mono mb-3">Submit tabular raw lines. Standard parser will chunk rows, poll ML classification models, and isolate routes automatically.</p>

      <div className="mb-3">
        <label className="text-[10px] block text-slate-400 uppercase font-mono mb-1">CSV Structured Content Source</label>
        <textarea
          rows={5}
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
          placeholder={sampleTemplate}
          className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono rounded-xl p-3 focus:outline-none focus:border-indigo-500 placeholder-slate-600"
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[10px] font-mono text-indigo-400/80">{log}</span>
        <button
          onClick={executeBatchUpload}
          disabled={processing || !csvInput.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing Pipelines...' : 'Run Bulk Classify'}
        </button>
      </div>
    </div>
  );
}
