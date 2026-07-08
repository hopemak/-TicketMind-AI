import React, { useEffect, useState } from 'react';

export default function ManagerInsightsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/executive-insights')
      .then(res => res.json())
      .then(resData => {
        if (resData.success) setData(resData.summary);
        setLoading(false);
      })
      .catch(err => console.error("Error drawing manager analytics pipeline:", err));
  }, []);

  if (loading) return <div className="text-xs font-mono text-slate-400 p-4">Syncing operational health indices...</div>;
  if (!data) return null;

  return (
    <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl my-6 font-sans shadow-xl text-slate-100">
      <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-3">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            <span>🛡️</span> Support Service SLA Analytics
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">Real-time risk scoring and operational bottleneck mitigation trackers.</p>
        </div>
        <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
          data.operationalHealthScore >= 80 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
        }`}>
          Health: {data.operationalHealthScore}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/60">
          <span className="text-[10px] block text-slate-400 uppercase font-mono">Active Backlog State</span>
          <span className="text-lg font-bold font-mono text-slate-200">{data.totalOutstandingOpen} Open Documents</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/60">
          <span className="text-[10px] block text-slate-400 uppercase font-mono">SLA Breach Vulnerabilities</span>
          <span className={`text-lg font-bold font-mono ${data.atRiskCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {data.atRiskCount} Tickets At Risk
          </span>
        </div>
      </div>

      {data.alerts.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold tracking-wider text-rose-400 uppercase font-mono">⚠️ Escalation Target Registry</p>
          {data.alerts.map((alert, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 flex justify-between items-center text-xs font-mono">
              <div className="truncate pr-4">
                <span className="text-indigo-400 font-bold mr-1.5">#{alert.ticketId}</span>
                <span className="text-slate-300 truncate inline-block max-w-[200px] align-bottom">{alert.title}</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase ${
                alert.riskLevel === 'BREACHED' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {alert.hoursOpen}h Elapsed
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-emerald-400 font-mono bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-xl text-center">
          ✓ All operating segments securely clear baseline service performance parameters.
        </p>
      )}
    </div>
  );
}
