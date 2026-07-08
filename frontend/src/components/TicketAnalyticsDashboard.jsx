import React, { useState, useEffect } from 'react';

export default function TicketAnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Corrected target path from /api/dashboard/stats to /api/analytics/dashboard-summary
    fetch('/api/analytics/dashboard-summary')
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned status code: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        } else {
          setError("Malformed data payload structure.");
        }
      })
      .catch((err) => {
        console.error("Dashboard engine stream fault:", err);
        setError("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-xs font-mono text-slate-400">Syncing analytics database matrices...</div>;
  if (error) return <div className="p-4 bg-rose-950/40 border border-rose-900 text-rose-400 rounded-xl text-xs font-mono mb-4">⚠️ {error}</div>;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 font-sans">
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-lg">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Total Active Tickets</span>
        <span className="text-3xl font-black text-white block mt-1 font-mono">{stats.totalTickets}</span>
      </div>

      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-lg">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Identified Categories</span>
        <div className="mt-2 space-y-1">
          {stats.categories?.map((c, i) => (
            <div key={i} className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">{c.label}:</span>
              <span className="text-indigo-400 font-bold">{c.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-lg">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Priority Volumes</span>
        <div className="mt-2 space-y-1">
          {stats.priorities?.map((p, i) => (
            <div key={i} className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">{p.label}:</span>
              <span className="text-amber-400 font-bold">{p.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
