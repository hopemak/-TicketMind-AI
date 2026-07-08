import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function MyTickets() {
  const [allTickets, setAllTickets] = useState([]);
  const [displayedTickets, setDisplayedTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- MODAL & FILTER STATES ---
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [minConfidence, setMinConfidence] = useState(10);
  
  const ticketRef = useRef(null);

  // Fetch data
  useEffect(() => {
    fetch('/api/tickets')
      .then(res => res.json())
      .then(payload => {
        if (payload.success && payload.data) {
          setAllTickets(payload.data);
          setDisplayedTickets(payload.data);
        } else {
          const fallback = [
            { _id: "TKT-ZTE5NYKY", title: "Whope Core Error", category: "General Inquiry", priority: "Low", status: "In Progress", confidence: 85, createdAt: "2026-07-06" },
            { _id: "TKT-A92B3C", title: "Production Mongo cluster disconnected", category: "Technical Issue", priority: "High", status: "In Progress", confidence: 98, createdAt: "2026-07-06" },
            { _id: "TKT-C72Z4M", title: "Unauthorized leak configuration attempt warning", category: "Security", priority: "High", status: "Open", confidence: 95, createdAt: "2026-07-05" },
            { _id: "TKT-D11D11", title: "Database connection dropping out", category: "Technical Issue", priority: "High", status: "Open", confidence: 97, createdAt: "2026-07-04" }
          ];
          setAllTickets(fallback);
          setDisplayedTickets(fallback);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleApplyFilters = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const filtered = allTickets.filter(ticket => {
      const matchesCategory = categoryFilter === "All" || ticket.category?.toLowerCase() === categoryFilter.toLowerCase();
      const matchesPriority = priorityFilter === "All" || 
        ticket.priority?.toLowerCase() === priorityFilter.toLowerCase() ||
        (priorityFilter === "Low Priority" && ticket.priority?.toLowerCase() === "low") ||
        (priorityFilter === "Medium Priority" && ticket.priority?.toLowerCase() === "medium") ||
        (priorityFilter === "High Priority" && ticket.priority?.toLowerCase() === "high");
      const ticketConfidence = ticket.confidence !== undefined ? ticket.confidence : 90;
      return matchesCategory && matchesPriority && (ticketConfidence >= minConfidence);
    });
    setDisplayedTickets(filtered);
  };

  // --- IMAGE GENERATION FUNCTION ---
  const downloadTicketImage = async () => {
    if (!ticketRef.current) return;
    try {
      const element = ticketRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: '#090d16',
        useCORS: true,
        scale: 2 // Boost resolution quality
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${selectedTicket._id}-passcard.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Canvas export failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 lg:p-8 font-sans relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Online: Ticket Master Queue</h1>
          <p className="text-xs text-slate-400 mt-1">Manage and track all support requests equipped with real-time AI metrics.</p>
        </div>

        {/* FILTER FORM */}
        <form onSubmit={handleApplyFilters} className="p-5 bg-slate-950 border border-slate-800/80 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">🎛️ Advanced Multi-Facet Filter Console</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Category Isolation</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full bg-[#050811] border border-slate-800 text-xs text-slate-300 px-3 py-2 rounded-xl focus:outline-none focus:border-purple-500">
                <option value="All">All Categories</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Security">Security</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Queue Priority</label>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-full bg-[#050811] border border-slate-800 text-xs text-slate-300 px-3 py-2 rounded-xl focus:outline-none focus:border-purple-500">
                <option value="All">All Priorities</option>
                <option value="Low Priority">Low Priority</option>
                <option value="Medium Priority">Medium Priority</option>
                <option value="High Priority">High Priority</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                <span>Min AI Confidence</span>
                <span className="text-purple-400">{minConfidence}%</span>
              </div>
              <input type="range" min="10" max="100" value={minConfidence} onChange={(e) => setMinConfidence(parseInt(e.target.value))} className="w-full accent-purple-500 h-1.5 bg-slate-900 rounded-lg cursor-pointer mt-2" />
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-900">
            <button type="button" onClick={handleApplyFilters} className="px-5 py-2 text-xs font-mono font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all">Apply Filters</button>
          </div>
        </form>

        {/* DATA TABLE */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#050912] border-b border-slate-900 text-slate-500 text-[10px] uppercase">
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 text-slate-300">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center animate-pulse text-slate-500">Syncing data matrix...</td></tr>
              ) : displayedTickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="p-3.5 font-bold text-purple-400">{ticket._id.substring(0, 12)}</td>
                  <td className="p-3.5 text-slate-200 font-sans font-medium">{ticket.title}</td>
                  <td className="p-3.5">{ticket.category}</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded text-[10px] bg-purple-950/40 text-purple-400 border border-purple-900/30">{ticket.priority}</span></td>
                  <td className="p-3.5">
                    <button 
                      type="button"
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-purple-500 rounded text-[11px] text-purple-400 font-bold transition-all"
                    >
                      Inspect Ticket 🎫
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- REAL-STYLE PREMIUM EXPEDITION MODAL --- */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div className="max-w-md w-full space-y-4">
            
            {/* TICKET ARTWORK CONTAINER */}
            <div 
              ref={ticketRef} 
              className="w-full bg-[#0d1527] border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-sans text-slate-200"
              style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(147, 51, 234, 0.15), transparent)' }}
            >
              {/* Futuristic Design Lines */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl"></div>
              
              {/* Header Badge */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
                <div>
                  <h2 className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">TIKTMIND CLUSTER PASS</h2>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">SECURE VERIFICATION TOKEN</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-purple-950">
                  AI
                </div>
              </div>

              {/* Core Ticket Content Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-mono uppercase text-slate-500 tracking-wider block">INCIDENT DESCRIPTION</label>
                  <p className="text-sm font-semibold text-white tracking-tight mt-0.5 leading-snug">{selectedTicket.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-3 rounded-2xl border border-slate-900">
                  <div>
                    <label className="text-[9px] font-mono uppercase text-slate-500 tracking-wider block">TICKET ID</label>
                    <span className="text-xs font-mono font-bold text-purple-300">{selectedTicket._id}</span>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono uppercase text-slate-500 tracking-wider block">TIER SECTOR</label>
                    <span className="text-xs font-mono text-slate-300">{selectedTicket.category}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-b border-slate-800/80 py-3 font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 block">PRIORITY</span>
                    <span className="text-rose-400 font-bold">{selectedTicket.priority}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">CONFIDENCE</span>
                    <span className="text-emerald-400 font-bold">{selectedTicket.confidence || 91}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">STATUS</span>
                    <span className="text-amber-400 font-bold">{selectedTicket.status || 'Open'}</span>
                  </div>
                </div>

                {/* Real Mock Image Asset Design Layer */}
                <div className="flex items-center justify-between pt-1">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 tracking-wider block">AUTHORIZED METRIC STAMP</span>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">👤</div>
                      <span className="text-[11px] text-slate-400 font-medium">Operator Core: Shemsu</span>
                    </div>
                  </div>
                  {/* Decorative AI Fingerprint / Matrix Barcode */}
                  <div className="bg-white p-1 rounded-lg shadow-inner opacity-80">
                    <div className="w-10 h-10 bg-slate-950 flex flex-col gap-0.5 p-0.5 justify-between">
                      <div className="h-1 bg-white w-full"></div>
                      <div className="h-1 bg-white w-2/3"></div>
                      <div className="h-1 bg-white w-5/6"></div>
                      <div className="h-1 bg-white w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION TRIGGERS */}
            <div className="flex gap-3 font-mono">
              <button 
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="w-1/3 py-2.5 text-xs font-bold bg-slate-900 text-slate-400 rounded-xl hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                DISMISS
              </button>
              <button 
                type="button"
                onClick={downloadTicketImage}
                className="w-2/3 py-2.5 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-950/30 transition-all active:scale-[0.98]"
              >
                DOWNLOAD PNG CARD 📥
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
