import React, { useState } from 'react';

export default function SystemExportConsole() {
  const [downloading, setDownloading] = useState(false);

  const fetchAndTriggerDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/analytics/export-insights');
      const data = await response.json();
      
      if (data.success) {
        // Create an active local memory string asset payload download channel
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(data.payload, null, 2)
        )}`;
        
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', data.reportName || 'TicketMind_Report.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err) {
      console.error("System audit compilation stream failure:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl my-6 font-sans shadow-xl text-slate-100">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            <span>💾</span> Executive Audit Ledger Export
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">Stream deep structural JSON reports out-of-band for institutional analytics.</p>
        </div>
        <button
          onClick={fetchAndTriggerDownload}
          disabled={downloading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-semibold px-4 py-2 rounded-xl transition-all active:scale-95 disabled:bg-slate-800"
        >
          {downloading ? 'Compiling Dump...' : 'Extract JSON Audit'}
        </button>
      </div>
    </div>
  );
}
