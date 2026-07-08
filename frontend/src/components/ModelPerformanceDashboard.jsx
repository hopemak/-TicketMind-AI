import React, { useEffect, useState } from 'react';

export default function ModelPerformanceDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/model-performance')
      .then(res => res.json())
      .then(data => {
        if (data.success) setMetrics(data.metrics);
        setLoading(false);
      })
      .catch(err => console.error("Error pulling production evaluation metrics:", err));
  }, []);

  if (loading) return <div className="text-xs font-mono text-slate-400 p-4">Awaiting analytics sync pipeline telemetry...</div>;
  if (!metrics) return null;

  return (
    <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl my-6 font-sans shadow-xl text-slate-100">
      <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-3">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            <span>📈</span> ML Core Validation Telemetry
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">Live validation metric matrices matched against human feedback overrides.</p>
        </div>
        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
          metrics.accuracyRate >= 0.85 
            ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
            : 'bg-amber-950 text-amber-400 border-amber-800'
        }`}>
          {metrics.modelStatus}
        </span>
      </div>

      {/* Metric Grid Display Panels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/60">
          <span className="text-[10px] block text-slate-500 uppercase font-mono">Evaluated Sample Window</span>
          <span className="text-xl font-bold font-mono tracking-tight text-slate-200">{metrics.totalEvaluated}</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/60">
          <span className="text-[10px] block text-slate-500 uppercase font-mono">True Predictions (TP)</span>
          <span className="text-xl font-bold font-mono tracking-tight text-emerald-400">{metrics.truePositives}</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/60">
          <span className="text-[10px] block text-slate-500 uppercase font-mono">Human Overrides (FP)</span>
          <span className="text-xl font-bold font-mono tracking-tight text-rose-400">{metrics.falsePositives}</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/60">
          <span className="text-[10px] block text-slate-500 uppercase font-mono">Core Precision Index</span>
          <span className="text-xl font-bold font-mono tracking-tight text-indigo-400">{Math.round(metrics.accuracyRate * 100)}%</span>
        </div>
      </div>

      {/* Drift Progress Indicator Line */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>System Stability Score</span>
          <span>Inference Error Rate: {Math.round(metrics.errorRate * 100)}%</span>
        </div>
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" 
            style={{ width: `${Math.round(metrics.accuracyRate * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
