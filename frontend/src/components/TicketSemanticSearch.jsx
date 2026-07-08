import React, { useState } from 'react';

export default function TicketSemanticSearch({ onSearchResults }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const triggerSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);

    try {
      const response = await fetch(`/api/tickets/semantic-search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success && onSearchResults) {
        onSearchResults(data.data);
      }
    } catch (err) {
      console.error("Semantic search operational mapping issue:", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl my-4 font-sans shadow-md">
      <form onSubmit={triggerSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔎 Describe problem here (e.g., database loading timeout exceptions)..."
          className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder-slate-600"
        />
        <button
          type="submit"
          disabled={searching || !query.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-500"
        >
          {searching ? 'Parsing...' : 'Context Search'}
        </button>
      </form>
      <p className="text-[10px] text-slate-500 font-mono mt-1.5 px-1">
        💡 AI Engine uses token overlap profiling to match intent across descriptive synonyms instantly.
      </p>
    </div>
  );
}
