import React, { useState } from 'react';

export default function TicketFeedbackLoop({ ticketId, currentCategory, onFeedbackSubmitted }) {
  const [selectedCat, setSelectedCat] = useState(currentCategory);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const options = ["Technical Issue", "General Inquiry", "Security"];

  const handleCorrection = async () => {
    if (selectedCat === currentCategory) return;
    setIsSubmitting(true);
    try {
      // Direct axios/fetch handshake to update AI verification record
      const response = await fetch(`/api/tickets/${ticketId}/feedback`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correctedCategory: selectedCat })
      });
      const data = await response.json();
      if (data.success) {
        setSaved(true);
        if (onFeedbackSubmitted) onFeedbackSubmitted(selectedCat);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to register model correction evaluation metric:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl my-4 text-slate-100 font-sans shadow-md">
      <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase block mb-2">
        🎯 Verify AI Classification Accuracy
      </span>
      <p className="text-[11px] text-slate-400 font-mono mb-3 leading-relaxed">
        Is this ticket category incorrect? Adjusting it logs the correction to our dataset pool to improve model retraining accuracy.
      </p>

      <div className="flex gap-2 items-center">
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-slate-950 text-xs text-slate-300 font-mono border border-slate-800 rounded-md px-2 py-1.5 focus:outline-none focus:border-indigo-500"
        >
          {options.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        <button
          onClick={handleCorrection}
          disabled={isSubmitting || selectedCat === currentCategory}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-150 active:scale-95 ${
            selectedCat === currentCategory
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isSubmitting ? 'Saving...' : saved ? '✓ Correction Logged' : 'Submit Override'}
        </button>
      </div>
    </div>
  );
}
