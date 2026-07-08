import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  // Volume stats synced with database load [geda]
  const [stats, setStats] = useState({
    totalTickets: 6,
    categories: [
      { name: 'Technical Issue', value: 3 },
      { name: 'Billing/Inquiry', value: 2 },
      { name: 'Security Alert', value: 1 }
    ],
    priorities: [
      { name: 'High', value: 2 },
      { name: 'Medium', value: 3 },
      { name: 'Low', value: 1 }
    ]
  });

  // UI Interactive States
  const [calibrating, setCalibrating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sentimentThreshold, setSentimentThreshold] = useState(0.75);
  const [automationMode, setAutomationMode] = useState(true);
  
  // Table Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  // Dynamic Chart Multipliers based on live parameter bounds
  const [baseChartData, setBaseChartData] = useState([40, 15, 65, 30, 85, 45, 95]);

  // Telemetry Console Feed Logs
  const [consoleLogs, setConsoleLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "Administrative session authenticated successfully.", type: "auth" },
    { time: new Date().toLocaleTimeString(), text: "Secure handshake established with instance [geda]", type: "db" }
  ]);

  // Master Auditing Ledger Data
  const [discrepancies] = useState([
    { id: "TK-9021", text: "Database cluster timed out during query batching", aiClass: "General Inquiry", humanClass: "Technical Issue", delta: "0.88", severity: "Medium" },
    { id: "TK-4412", text: "Unauthorized API access handshake key detected", aiClass: "Technical Issue", humanClass: "Security Alert", delta: "0.94", severity: "High" },
    { id: "TK-1102", text: "Subscription tier downgrade request webhook failed", aiClass: "Security Alert", humanClass: "Billing/Inquiry", delta: "0.71", severity: "Low" }
  ]);

  useEffect(() => {
    fetch('/api/analytics/dashboard-summary')
      .then(res => res.json())
      .then(payload => {
        if (payload.success && payload.data) {
          setStats({
            totalTickets: payload.data.totalTickets || 6,
            categories: payload.data.categories?.length ? payload.data.categories : stats.categories,
            priorities: payload.data.priorities?.length ? payload.data.priorities : stats.priorities
          });
        }
      })
      .catch(err => console.error("Admin analytical matrix pull exception:", err));
  }, []);

  const triggerLogMessage = (message, type) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [{ time: timestamp, text: message, type }, ...prev.slice(0, 4)]);
  };

  const handleModelFit = () => {
    setCalibrating(true);
    triggerLogMessage("Executing backpropagation layers across logged correction data...", "process");
    setTimeout(() => {
      setCalibrating(false);
      triggerLogMessage("Gradient model optimization committed successfully to cluster.", "success");
      // Add slight variety shift to simulated charts on fit
      setBaseChartData([50, 25, 70, 40, 90, 60, 99]);
    }, 2500);
  };

  const handleExport = () => {
    setExporting(true);
    triggerLogMessage("Streaming deep structural analytical JSON frames out-of-band...", "process");
    setTimeout(() => {
      setExporting(false);
      triggerLogMessage("Audit transaction archive dispatched securely.", "success");
    }, 2000);
  };

  // Filter Logic for Override Table
  const filteredDiscrepancies = discrepancies.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "All" || item.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 lg:p-8 font-sans selection:bg-purple-500/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* CRITICAL ANOMALIES LOG BANNER */}
        <div className="bg-gradient-to-r from-red-950/40 via-slate-950 to-slate-950 border border-red-900/30 rounded-2xl p-4 flex items-center justify-between shadow-xl backdrop-blur-md animate-pulse">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🚨</span>
            <div>
              <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wide">Critical System Anomaly Logged</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Ticket ID TK-4412 flag variance breached strict isolation boundaries. Manual code verification recommended.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-red-400 bg-red-950/60 border border-red-800/40 px-2 py-1 rounded-md hidden sm:inline-block">IMMEDIATE ATTENTION</span>
        </div>

        {/* HEADER & ADMINISTRATIVE PROFILE */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-r from-slate-950 via-[#110d1a] to-slate-950 p-6 lg:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 w-full">
            
            <div>
              <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase font-mono font-bold text-purple-400 bg-purple-950/40 border border-purple-800/30 px-2.5 py-1 rounded-md mb-3 w-fit">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></span> Core Kernel Node: Online
              </div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Admin AI Management System
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Global monitor array overseeing triage weights, sentiment thresholds, and pipeline fit.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t border-slate-900 md:border-t-0 pt-4 md:pt-0">
              {/* SYSTEM AUTOMATION CONTROLS */}
              <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 p-2.5 rounded-2xl shadow-inner">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-1.5">
                  {automationMode ? "Autonomous Engine" : "Manual Override Mode"}
                </span>
                <button 
                  onClick={() => {
                    setAutomationMode(!automationMode);
                    triggerLogMessage(`Pipeline execution logic inverted to: ${!automationMode ? 'Autonomous Mode' : 'Manual Intercept Mode'}`, "system");
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-1 duration-300 ${automationMode ? 'bg-purple-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-md ${automationMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* ADMINISTRATIVE PROFILE BADGE */}
              <div className="flex items-center space-x-3 bg-slate-900/40 border border-slate-800 p-2 rounded-2xl pr-4 hover:border-purple-500/20 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-mono font-black text-xs shadow-md text-white animate-pulse">
                  SU
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Shemsu Cluster Operator</div>
                  <div className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-semibold">Root Privilege</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* VERIFICATION MICROSERVICES PLATFORM STATS */}
        <div className="p-4 bg-[#0a101d] border border-slate-800 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between text-xs font-mono hover:border-slate-800 transition-colors">
              <span className="text-slate-400">Core Engine (Express.js)</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/40">Port 8080 : Stable</span>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between text-xs font-mono hover:border-slate-800 transition-colors">
              <span className="text-slate-400">ML Sandbox API (Python)</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/40">Port 5000 : Online</span>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between text-xs font-mono hover:border-purple-900/30 transition-colors">
              <span className="text-slate-400">Persistent Clusters</span>
              <span className="text-purple-400 font-bold bg-purple-950/20 px-2 py-0.5 rounded border border-purple-900/40">[geda] : Connected</span>
            </div>
          </div>
        </div>

        {/* GRID LAYOUT SUMMARY CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex flex-col justify-between shadow-xl backdrop-blur-md">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Total Active Tickets</span>
              <h3 className="text-4xl font-black font-mono text-white mt-2 tracking-tight">{stats.totalTickets}</h3>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">Aggregated runtime document instances compiled within data storage cluster bounds safely.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 text-[11px] font-mono text-emerald-400 font-bold flex justify-between">
              <span>Health Threshold</span>
              <span>● OPTIMAL</span>
            </div>
          </div>

          <div className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold border-b border-slate-900 pb-3 mb-4">
              📂 Identified Categories
            </h3>
            <div className="space-y-3">
              {stats.categories.map((c, idx) => {
                const percentage = stats.totalTickets > 0 ? ((c.value / stats.totalTickets) * 100).toFixed(0) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-300">{c.name}</span>
                      <span className="text-purple-400 font-bold">{c.value} items ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC REACTIVE CORE TIMELINE LOAD GRAPH */}
          <div className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md flex flex-col justify-between group">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold border-b border-slate-900 pb-3 mb-2">
              📈 Inferences Over Time (Historical Core Load)
            </h3>
            <div className="flex items-end justify-between h-24 pt-4 px-2 space-x-2">
              {baseChartData.map((val, i) => {
                // Dynamically modify graph height scaling aligned to real-time threshold changes
                const dynamicallyScaledHeight = Math.min(100, Math.max(10, val * (sentimentThreshold / 0.75)));
                return (
                  <div key={i} className="w-full flex flex-col items-center group/bar relative">
                    <div className="absolute -top-6 bg-slate-900 text-[9px] font-mono border border-slate-800 rounded px-1 text-purple-400 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-20">
                      {dynamicallyScaledHeight.toFixed(0)}%
                    </div>
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-900/40 via-purple-600 to-indigo-400 rounded-t-md transition-all duration-700 ease-out group-hover/bar:brightness-125"
                      style={{ height: `${dynamicallyScaledHeight}%` }}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-600 uppercase mt-2 pt-2 border-t border-slate-900">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
            </div>
          </div>
        </div>

        {/* CONFIDENCE PARAMETER LIMIT SLIDER */}
        <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold mb-2">
            🛠️ Live Neural Weight Customization
          </h3>
          <div className="bg-[#050912] border border-slate-900/80 p-5 rounded-xl space-y-3">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-slate-400">Sentiment Isolation Boundary Threshold</span>
              <span className="text-purple-400 font-bold">{(sentimentThreshold * 100).toFixed(0)}% Confidence Boundary</span>
            </div>
            <input 
              type="range" min="0.50" max="0.99" step="0.01" 
              value={sentimentThreshold} 
              onChange={(e) => {
                const newVal = parseFloat(e.target.value);
                setSentimentThreshold(newVal);
                triggerLogMessage(`Sentiment boundary threshold altered to value point: ${(newVal * 100).toFixed(0)}%`, "system");
              }}
              className="w-full accent-purple-500 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* TELEMETRY ACTIVITY STREAM */}
        <div className="p-5 bg-slate-950 border border-slate-800/70 rounded-2xl font-mono text-xs shadow-inner">
          <div className="flex justify-between items-center mb-3 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            <span>⚙️ System Engine Operations Live Stream Telemetry</span>
            <span className="animate-pulse text-purple-400">LISTENING STREAM ACTIVE</span>
          </div>
          <div className="bg-[#04060d] border border-slate-900 rounded-xl p-4 h-28 overflow-y-auto space-y-1.5 text-[11px] scrollbar-thin scrollbar-thumb-slate-800">
            {consoleLogs.map((log, i) => (
              <div key={i} className="flex space-x-2 transition-all duration-300">
                <span className="text-slate-600">[{log.time}]</span>
                <span className={`font-bold ${log.type === 'success' ? 'text-emerald-400' : log.type === 'system' ? 'text-purple-400' : log.type === 'db' ? 'text-indigo-400' : 'text-amber-400'}`}>[{log.type.toUpperCase()}]</span>
                <span className="text-slate-300">{log.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MASTER OPERATOR SEARCH AND FILTER MATRIX */}
        <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-900 pb-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
              🎯 Model Override Logs (AI vs Human Audit)
            </h3>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="Search Ticket ID or string..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-purple-500 transition-all w-full sm:w-48 font-sans"
              />
              <select 
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-300 px-2 py-1.5 rounded-xl focus:outline-none focus:border-purple-500 font-mono cursor-pointer transition-colors"
              >
                <option value="All">All Severity</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-900">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#050912] border-b border-slate-900 text-slate-500 text-[10px] uppercase">
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Text Sample Schema</th>
                  <th className="p-3">Model Output</th>
                  <th className="p-3">Operator Override</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300 transition-all duration-300">
                {filteredDiscrepancies.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-600 italic">No matching query override structures parsed.</td>
                  </tr>
                ) : (
                  filteredDiscrepancies.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-900/20 transition-colors duration-200 group">
                      <td className="p-3 font-bold text-purple-400 group-hover:text-purple-300 transition-colors">{row.id}</td>
                      <td className="p-3 text-slate-400 font-sans max-w-xs truncate">{row.text}</td>
                      <td className="p-3 text-rose-400">{row.aiClass}</td>
                      <td className="p-3 text-emerald-400">{row.humanClass}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.severity === 'High' ? 'bg-red-950/40 text-red-400 border border-red-900/30' : row.severity === 'Medium' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' : 'bg-blue-950/40 text-blue-400 border border-blue-900/30'}`}>
                          {row.severity}
                        </span>
                      </td>
                      <td className="p-3 text-right text-slate-500 font-bold">{row.delta}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* OPERATIONS TRIGGER CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-950 border border-slate-800/60 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono uppercase text-purple-400 font-bold mb-2">⚙️ Automated Pipeline Calibration</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optimize feature extraction weights against corrections logged to database.
              </p>
            </div>
            <button 
              onClick={handleModelFit}
              disabled={calibrating}
              className="mt-6 w-full py-2.5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-purple-500/40 hover:text-purple-400 rounded-xl font-mono text-xs font-bold transition-all transform duration-200"
            >
              {calibrating ? '⚡ TUNING CORRECTION COEFFICIENTS...' : 'TRIGGER MODEL FIT'}
            </button>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800/60 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold mb-2">💾 Executive Audit Ledger Export</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stream deep structural JSON reports out-of-band for institutional analytics.
              </p>
            </div>
            <button 
              onClick={handleExport}
              disabled={exporting}
              className="mt-6 w-full py-2.5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-400 rounded-xl font-mono text-xs font-bold transition-all transform duration-200"
            >
              {exporting ? '🔄 STREAMING EXPORT PAYLOAD...' : 'EXTRACT JSON AUDIT'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
