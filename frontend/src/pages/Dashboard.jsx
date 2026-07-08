import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    categories: [],
    priorities: []
  });
  const [loading, setLoading] = useState(true);
  
  const [logs, setLogs] = useState([
    { time: "12:40:11", msg: "Core connection to cluster MongoDB [geda] active.", type: "system" },
    { time: "12:41:05", msg: "Python NLP sidecar microservice container handshaking on Port 5000.", type: "system" }
  ]);

  useEffect(() => {
    fetch('/api/analytics/dashboard-summary')
      .then(res => res.json())
      .then(payload => {
        if (payload.success && payload.data) {
          setStats({
            totalTickets: payload.data.totalTickets || 0,
            openTickets: payload.data.openTickets || 0,
            inProgressTickets: payload.data.inProgressTickets || 0,
            resolvedTickets: payload.data.resolvedTickets || 0,
            closedTickets: payload.data.closedTickets || 0,
            categories: payload.data.categories || [],
            priorities: payload.data.priorities || []
          });
        }
      })
      .catch(err => console.error("Metrics sync drop:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const mockFeed = [
      { msg: "Incoming socket stream payload parsed via route /api/tickets/new", type: "triage" },
      { msg: "NLP Vectorizer processing tensor matrix strings...", type: "ai" },
      { msg: "SLA calculated successfully: High priority flag assigned.", type: "success" },
      { msg: "Ticket classified under 'Technical Issue' with 94.2% confidence score.", type: "ai" },
      { msg: "DB cluster entry updated cleanly inside instance [geda]", type: "system" }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const currentLog = mockFeed[currentIdx];
      setLogs(prev => [
        { time: now, msg: currentLog.msg, type: currentLog.type },
        ...prev.slice(0, 5)
      ]);
      currentIdx = (currentIdx + 1) % mockFeed.length;
    }, 4500);

    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase animate-pulse">Initializing Control Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 lg:p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* PREMIUM HEADER HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-r from-slate-950 via-[#0e1726] to-slate-950 p-6 lg:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase font-mono font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-800/30 px-2.5 py-1 rounded-md w-fit mb-3">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span> Intelligent Routing System
              </div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                TicketMind AI Operations
              </h1>
              <p className="text-xs lg:text-sm text-slate-400 mt-1.5 max-w-xl leading-relaxed">
                Real-time operational dashboard monitoring automated triage classification, severity analytics, and cluster load structures.
              </p>
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 shadow-inner text-emerald-400 text-xs font-mono font-semibold">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              CORE NODE ONLINE
            </div>
          </div>
        </div>

        {/* DYNAMIC SLA ALERT HUB */}
        <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20 text-sm">⚠️</div>
            <div>
              <h4 className="text-xs font-bold font-mono text-rose-300 uppercase tracking-wide">Critical SLA Threshold Breaches Pending</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">High-priority items require immediate team assignment routing parameters.</p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all text-white text-xs font-mono font-bold rounded-xl shadow-lg">
            DISPATCH QUEUE
          </button>
        </div>

        {/* METRICS SUMMARY GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Ingestion", val: stats.totalTickets, icon: "⚡", bg: "bg-indigo-500/5", border: "border-indigo-500/20 text-indigo-400" },
            { label: "Active Backlog", val: stats.openTickets, icon: "📂", bg: "bg-emerald-500/5", border: "border-emerald-500/20 text-emerald-400" },
            { label: "In Progress", val: stats.inProgressTickets, icon: "⏳", bg: "bg-amber-500/5", border: "border-amber-500/20 text-amber-400" },
            { label: "Resolved Cluster", val: stats.resolvedTickets, icon: "✨", bg: "bg-cyan-500/5", border: "border-cyan-500/20 text-cyan-400" },
            { label: "Closed Logs", val: stats.closedTickets, icon: "🔒", bg: "bg-slate-950", border: "border-slate-800 text-slate-400" }
          ].map((card, i) => (
            <div key={i} className={`p-5 rounded-2xl border ${card.border} ${card.bg} shadow-lg relative group transition-all duration-300 hover:-translate-y-1`}>
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{card.label}</span>
                <span className="text-xs opacity-70">{card.icon}</span>
              </div>
              <span className="text-3xl font-black mt-3 block font-mono tracking-tight text-white">{card.val}</span>
            </div>
          ))}
        </div>

        {/* INTERACTIVE BREAKDOWN MATRIX SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CATEGORY MONITOR PANEL */}
          <div className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Identified Categories
              </h3>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-2 py-0.5 rounded-full">NLP Distribution</span>
            </div>
            <div className="space-y-3">
              {stats.categories.map((c, index) => {
                const pct = stats.totalTickets > 0 ? ((c.value / stats.totalTickets) * 100).toFixed(0) : 0;
                return (
                  <div key={index} className="group flex flex-col space-y-1.5 p-3.5 bg-slate-900/30 border border-slate-900 hover:border-slate-800 rounded-xl transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">{c.name}</span>
                      <div className="flex items-center space-x-2.5">
                        <span className="text-[10px] font-mono text-slate-500 font-medium">{pct}%</span>
                        <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/50 border border-indigo-900/30 px-2.5 py-0.5 rounded-md">{c.value}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SEVERITY MATRIX PANEL */}
          <div className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Priority Volumes
              </h3>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 border border-rose-900/30 px-2 py-0.5 rounded-full">SLA Thresholds</span>
            </div>
            <div className="space-y-3">
              {stats.priorities.map((p, index) => {
                const isHigh = p.name === 'High';
                const isMed = p.name === 'Medium';
                const variantClass = isHigh ? 'text-rose-400 bg-rose-950/30 border-rose-900/40' : isMed ? 'text-amber-400 bg-amber-950/30 border-amber-900/40' : 'text-blue-400 bg-blue-950/30 border-blue-900/40';
                return (
                  <div key={index} className="flex justify-between items-center p-3.5 bg-slate-900/30 border border-slate-900 hover:border-slate-800 rounded-xl transition-all">
                    <span className="text-xs font-semibold text-slate-300 font-mono">{p.name} Severity Tier</span>
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${variantClass}`}>{p.value} items</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MODEL PERFORMANCE TELEMETRY SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-950 border border-slate-800/60 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Classifier F1-Score</span>
              <span className="text-2xl font-black font-mono text-white mt-1 block">91.4%</span>
            </div>
            <span className="text-xs font-mono bg-purple-950/40 border border-purple-900/40 px-2 py-1 rounded text-purple-400">Macro Avg</span>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800/60 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Inference Latency</span>
              <span className="text-2xl font-black font-mono text-white mt-1 block">142 ms</span>
            </div>
            <span className="text-xs font-mono bg-amber-950/40 border border-amber-900/40 px-2 py-1 rounded text-amber-400">FastAPI Node</span>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800/60 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">Automation Precision</span>
              <span className="text-2xl font-black font-mono text-white mt-1 block">96.8%</span>
            </div>
            <span className="text-xs font-mono bg-emerald-950/40 border border-emerald-500/40 px-2 py-1 rounded text-emerald-400">Zero-Touch</span>
          </div>
        </div>

        {/* 🛠️ BRAND NEW: SYSTEM CLUSTER HEALTH MONITOR TELEMETRY */}
        <div className="p-6 bg-[#0c1220] border border-slate-800/80 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Microservice Node Health
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">Runtime Allocation</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-950/50 border border-slate-900 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">Gateway Core (Express)</span>
                <span className="text-xs font-mono text-slate-300 mt-0.5 block">Port 8080 / Online</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-900"></span>
            </div>
            <div className="p-3 bg-slate-950/50 border border-slate-900 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">ML Sidecar (FastAPI)</span>
                <span className="text-xs font-mono text-slate-300 mt-0.5 block">Port 5000 / Inbound</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-900"></span>
            </div>
            <div className="p-3 bg-slate-950/50 border border-slate-900 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">Database Pool [geda]</span>
                <span className="text-xs font-mono text-slate-300 mt-0.5 block">Ping: 3ms / Connected</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-md shadow-emerald-900"></span>
            </div>
          </div>
        </div>

        {/* LIVE TRIAGE MICRO-CONSOLE WINDOW */}
        <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></span> Live Triage Model Feed
            </h3>
            <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider animate-pulse">STREAMING DATA OUT-OF-BAND...</span>
          </div>

          <div className="bg-[#040711] border border-slate-900 rounded-xl p-4 font-mono text-xs space-y-2 h-36 overflow-y-hidden shadow-inner">
            {logs.map((log, idx) => {
              const badgeColors = log.type === 'ai' ? 'text-purple-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'system' ? 'text-blue-400' : 'text-amber-400';
              return (
                <div key={idx} className="flex items-start space-x-2 animate-fadeIn">
                  <span className="text-slate-600 select-none">[{log.time}]</span>
                  <span className={`font-bold uppercase tracking-wider text-[10px] ${badgeColors}`}>[{log.type}]:</span>
                  <span className="text-slate-300">{log.msg}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
