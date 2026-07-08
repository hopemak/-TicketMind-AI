import React, { useState } from 'react';

export default function TicketFilterConsole({ onFilterResults }) {
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [minConf, setMinConf] = useState('0.0');
  const [loading, setLoading] = useState(false);

  const triggerFilterSync = async () => {
    setLoading(true);
    try {
      const url = `/api/tickets/advanced-filter?category=${category}&priority=${priority}&minConfidence=${minConf}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success && onFilterResults) {
        onFilterResults(data.data);
      }
    } catch (err) {
      console.error("Advanced query pipeline issue:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl my-6 font-sans shadow-xl text-slate-100">
      <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase block mb-3">
        🎛️ Advanced Multi-Facet Filter Console
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-[10px] block text-slate-400 uppercase font-mono mb-1">Category Isolation</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-300 font-mono border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Security">Security</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] block text-slate-400 uppercase font-mono mb-1">Queue Priority</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-300 font-mono border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] block text-slate-400 uppercase font-mono mb-1">Min AI Confidence: {Math.round(minConf * 100)}%</label>
          <input 
            type="range" 
            min="0.0" 
            max="1.0" 
            step="0.05"
            value={minConf} 
            onChange={(e) => setMinConf(e.target.value)}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-3accent-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={triggerFilterSync}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs px-5 py-2 rounded-xl transition-all active:scale-95 disabled:bg-slate-800"
        >
          {loading ? 'Sifting...' : 'Apply Filters'}
        </button>
      </div>
    </div>
  );
}
