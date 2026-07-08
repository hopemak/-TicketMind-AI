import React, { useState } from 'react';

export default function ModelRetrainControl() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const executePipelineFit = async () => {
    setRunning(true);
    setResult(null);
    try {
      const response = await fetch('/api/analytics/trigger-retrain', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setResult(data.metrics);
      } else {
        alert(data.error || "Retraining failed due to small dataset volume.");
      }
    } catch (err) {
      console.error("Pipeline failure executing fit optimization loop:", err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl my-6 font-sans shadow-xl text-slate-100">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            <span>⚙️</span> Automated Pipeline Calibration
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">Optimize feature extraction weights against corrections logged to database.</p>
        </div>
        <button
          onClick={executePipelineFit}
          disabled={running}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-semibold px-4 py-2 rounded-xl transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-600"
        >
          {running ? 'Optimizing Vectors...' : 'Trigger Model Fit'}
        </button>
      </div>

      {result && (
        <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between text-xs font-mono">
          <span className="text-emerald-400">✓ Optimization Phase Complete: {result.status || 'Success'}</span>
          <span className="text-slate-400">Delta: {result.accuracyDelta} | Build: {result.version}</span>
        </div>
      )}
    </div>
  );
}
