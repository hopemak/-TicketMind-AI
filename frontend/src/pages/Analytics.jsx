import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/analytics/dashboard-summary')
      .then(res => {
        if (!res.ok) throw new Error("Analytics stream connection dropped.");
        return res.json();
      })
      .then(payload => {
        if (payload.success) setData(payload.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-xs font-mono text-slate-400">Processing platform trends...</div>;
  if (error) return <div className="p-6 text-rose-500 font-mono">⚠️ Error: {error}</div>;
  if (!data) return null;

  // Premium color palettes for the slices
  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'];
  
  // Format the Status Data array dynamically for the status breakdown chart
  const statusData = [
    { name: 'Open', value: data.openTickets || 0 },
    { name: 'In Progress', value: data.inProgressTickets || 0 },
    { name: 'Resolved', value: data.resolvedTickets || 0 },
    { name: 'Closed', value: data.closedTickets || 0 }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-900 text-slate-100 min-h-screen font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Analytics Suite</h1>
        <p className="text-xs text-slate-400 mt-1">Deep insights and trends from your AI-classified support tickets.</p>
      </div>

      {/* Grid Display Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tickets', val: data.totalTickets, color: 'text-indigo-400' },
          { label: 'Open Status', val: data.openTickets, color: 'text-emerald-400' },
          { label: 'Resolved Tickets', val: data.resolvedTickets, color: 'text-amber-400' },
          { label: 'Closed Records', val: data.closedTickets, color: 'text-slate-500' }
        ].map((card, i) => (
          <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 block">{card.label}</span>
            <span className={`text-2xl font-bold font-mono mt-1 block ${card.color}`}>{card.val}</span>
          </div>
        ))}
      </div>

      {/* 2x2 Chart Cluster Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Category Distribution PIE CHART */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl min-h-[320px] flex flex-col">
          <h2 className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-2">Category Distribution Matrix</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.categories} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {data.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc', fontFamily: 'monospace', fontSize: '11px' }}/>
                <Legend formatter={(value, entry, index) => <span className="text-xs text-slate-300 font-mono">{data.categories[index].name}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Priority Distribution BAR CHART */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl min-h-[320px] flex flex-col">
          <h2 className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-2">Priority Distribution Metrics</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.priorities}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(30, 41, 59, 0.1)' }} contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc', fontFamily: 'monospace', fontSize: '11px' }}/>
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {data.priorities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'High' ? '#ef4444' : entry.name === 'Medium' ? '#f59e0b' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Status Overview BAR CHART */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl min-h-[320px] flex flex-col">
          <h2 className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-2">Status Backlog Overview</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc', fontFamily: 'monospace', fontSize: '11px' }}/>
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Monthly Ticket Volume LINE CHART */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl min-h-[320px] flex flex-col">
          <h2 className="text-xs uppercase tracking-wider font-mono text-slate-400 mb-2">Monthly Operational Ticket Volume (Trend)</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrends}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc', fontFamily: 'monospace', fontSize: '11px' }}/>
                <Legend />
                <Line type="monotone" dataKey="volume" name="Incoming Tickets" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
