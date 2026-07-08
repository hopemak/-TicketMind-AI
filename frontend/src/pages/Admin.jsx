import React, { useState } from 'react';

export default function Admin() {
  const [stats] = useState({
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

  const [calibrating, setCalibrating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sentimentThreshold, setSentimentThreshold] = useState(0.75);
  const [automationMode, setAutomationMode] = useState(true);
  
  const [discrepancies] = useState([
    { id: "TK-9021", text: "Database cluster timed out during query batching", aiClass: "General Inquiry", humanClass: "Technical Issue", delta: "0.88" },
    { id: "TK-4412", text: "Unauthorized API access handshake key detected", aiClass: "Technical Issue", humanClass: "Security Alert", delta: "0.94" }
  ]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 lg:p-8 font-sans selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER CONTROL AREA */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-r from-slate-950 via-[#110d1a] to-slate-950 p-6 lg:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase font-mono font-bold text-purple-400 bg-purple-950/40 border border-purple-800/30 px-2.5 py-1 rounded-md mb-3 w-fit">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span> Security Clearance: Active
              </div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                Admin AI Management System
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Global monitor array overseeing triage weights, sentiment thresholds, and pipeline fit.
              </p>
            </div>
            
            {/* TOGGLE ENGINE SYSTEM SWITCH */}
            <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 p-2.5 rounded-2xl shadow-inner">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-1.5">
                {automationMode ? "Autonomous Engine" : "Human Approval Mode"}
              </span>
              <button 
                onClick={() => setAutomationMode(!automationMode)}
                className={`w-11 h-6 rounded-full transition-colors relative p-1 duration-300 ${automationMode ? 'bg-purple-600' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-md ${automationMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* METRIC SUMMARIES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Total Active Tickets</span>
              <h3 className="text-4xl font-black font-mono text-white mt-2 tracking-tight">{stats.totalTickets}</h3>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 text-[11px] font-mono text-emerald-400 font-bold">
              ● CLUSTER RUNNING
            </div>
          </div>

          <div className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold border-b border-slate-900 pb-3 mb-4">
              📂 Identified Categories
            </h3>
            <div className="space-y-2">
              {stats.categories.map((c, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-slate-900/30 border border-slate-900/60 rounded-xl text-xs font-mono">
                  <span className="text-slate-300">{c.name}</span>
                  <span className="text-purple-400 font-bold bg-purple-950/40 border border-purple-900/30 px-2 py-0.5 rounded">{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold border-b border-slate-900 pb-3 mb-4">
              ⚖️ Priority Volumes
            </h3>
            <div className="space-y-2">
              {stats.priorities.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-slate-900/30 border border-slate-900/60 rounded-xl text-xs font-mono">
                  <span className="text-slate-300">{p.name} Severity</span>
                  <span className="text-rose-400 font-bold bg-rose-950/40 border border-rose-900/30 px-2 py-0.5 rounded">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* THRESHOLD SLIDER TUNER */}
        <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl shadow-2xl">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold mb-2">
            🛠️ Live Neural Weight Customization
          </h3>
          <div className="bg-[#050912] border border-slate-900/80 p-5 rounded-xl space-y-3">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-slate-400">Sentiment Isolation Boundary</span>
              <span className="text-purple-400 font-bold">{(sentimentThreshold * 100).toFixed(0)}% Confidence</span>
            </div>
            <input 
              type="range" min="0.50" max="0.99" step="0.01" 
              value={sentimentThreshold} 
              onChange={(e) => setSentimentThreshold(parseFloat(e.target.value))}
              className="w-full accent-purple-500 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* RECENT DISCREPANCIES LOG TABLE */}
        <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl shadow-2xl">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold mb-4 border-b border-slate-900 pb-3">
            🎯 Model Override Logs (AI vs Human Audit)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-900">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-[#050912] border-b border-slate-900 text-slate-500 text-[10px] uppercase">
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Text Sample Schema</th>
                  <th className="p-3">Model Output</th>
                  <th className="p-3">Operator Override</th>
                  <th className="p-3 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {discrepancies.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-900/20 transition-colors">
                    <td className="p-3 font-bold text-purple-400">{row.id}</td>
                    <td className="p-3 text-slate-400 font-sans max-w-xs truncate">{row.text}</td>
                    <td className="p-3 text-rose-400">{row.aiClass}</td>
                    <td className="p-3 text-emerald-400">{row.humanClass}</td>
                    <td className="p-3 text-right text-slate-500 font-bold">{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* OPERATIONS EXECUTION BLOCK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-950 border border-slate-800/60 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono uppercase text-purple-400 font-bold mb-2">⚙️ Automated Pipeline Calibration</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optimize feature extraction weights against corrections logged to database.
              </p>
            </div>
            <button 
              onClick={() => { setCalibrating(true); setTimeout(() => setCalibrating(false), 2000); }}
              disabled={calibrating}
              className="mt-6 w-full py-2.5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-purple-500/40 hover:text-purple-400 rounded-xl font-mono text-xs font-bold transition-all"
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
              onClick={() => { setExporting(true); setTimeout(() => setExporting(false), 2000); }}
              disabled={exporting}
              className="mt-6 w-full py-2.5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-400 rounded-xl font-mono text-xs font-bold transition-all"
            >
              {exporting ? '🔄 STREAMING EXPORT PAYLOAD...' : 'EXTRACT JSON AUDIT'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
