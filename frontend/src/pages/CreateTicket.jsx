import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FEATURE 4: DUAL-THEME STATE BRIDGE (true = Cyberpunk, false = Minimal Slate)
  const [cyberpunkTheme, setCyberpunkTheme] = useState(true);

  // Advanced Interactive NLP Simulation States
  const [tokens, setTokens] = useState([]);
  const [embeddingVector, setEmbeddingVector] = useState([]);
  
  // FEATURE 2: ML ACCURACY DATA MATRICES
  const [predictedCategory, setPredictedCategory] = useState("Awaiting text...");
  const [confidenceScore, setConfidenceScore] = useState(0);

  // FEATURE 3: LOCAL APPLICATION CALIBRATION LEDGER LOGS
  const [auditLedger, setAuditLedger] = useState([
    { id: "LOG-102", action: "Pipeline Init", target: "Token Sandbox", result: "Ready", time: "14:02" },
    { id: "LOG-101", action: "Handshake Check", target: "Cluster [geda]", result: "OK", time: "14:01" }
  ]);

  // Simulate Live Machine Learning Tokenization & Confidence Metrics on text change
  useEffect(() => {
    if (!description.trim()) {
      setTokens([]);
      setEmbeddingVector([]);
      setPredictedCategory("Awaiting text...");
      setConfidenceScore(0);
      return;
    }

    // Split text into simulated meaningful tokens
    const rawTokens = description
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter(token => token.length > 2);

    const stopWords = ['the', 'this', 'that', 'with', 'from', 'have', 'your', 'and', 'for', 'not', 'after'];
    const filteredTokens = rawTokens.filter(t => !stopWords.includes(t));
    setTokens(filteredTokens.slice(0, 8));

    // Generate simulated mock dense vector weight layer matching hashes
    const generatedVector = Array.from({ length: 6 }, (_, i) => {
      const charCodeSum = description.charCodeAt(i % description.length) || 0;
      return ((charCodeSum * 0.123) % 1).toFixed(3);
    });
    setEmbeddingVector(generatedVector);

    // FEATURE 2: Dynamic category prediction logic using input flags
    const lowercaseDesc = description.toLowerCase();
    let category = "General Inquiry";
    let baseConfidence = 78;

    if (lowercaseDesc.includes("password") || lowercaseDesc.includes("hack") || lowercaseDesc.includes("unauthorized") || lowercaseDesc.includes("access")) {
      category = "Security Alert";
      baseConfidence = 94;
    } else if (lowercaseDesc.includes("bug") || lowercaseDesc.includes("error") || lowercaseDesc.includes("crash") || lowercaseDesc.includes("fail")) {
      category = "Technical Issue";
      baseConfidence = 89;
    } else if (lowercaseDesc.includes("bill") || lowercaseDesc.includes("renew") || lowercaseDesc.includes("payment") || lowercaseDesc.includes("price")) {
      category = "Billing/Inquiry";
      baseConfidence = 91;
    }

    const fluctuation = (description.length % 6);
    setPredictedCategory(category);
    setConfidenceScore(baseConfidence + fluctuation);
  }, [description]);

  // FEATURE 1: ONE-CLICK INTERACTIVE FORCE RE-CALIBRATION RUNTIME TRIGGER
  const handleForceTriageReset = () => {
    if (!description.trim()) return;
    setConfidenceScore(99);
    setPredictedCategory("Technical Issue");
    
    setAuditLedger(prev => [
      { id: `LOG-${Math.floor(Math.random() * 800 + 200)}`, action: "Force Override", target: "ML Weight Layer", result: "Pushed Alpha", time: new Date().toLocaleTimeString().slice(0, 5) },
      ...prev
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, category: predictedCategory, confidence: confidenceScore })
    })
      .then(res => res.json())
      .then(payload => {
        if (payload.success) {
          navigate('/tickets');
        }
      })
      .catch(err => console.error("Error creating AI ticket dispatch:", err))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className={`min-h-screen p-6 lg:p-8 font-sans transition-all duration-500 ease-in-out ${
      cyberpunkTheme ? 'bg-[#090d16] text-slate-100 selection:bg-indigo-500/30' : 'bg-slate-50 text-slate-900 selection:bg-indigo-200'
    }`}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* TOP INTERACTIVE ACTION HUB AND THEME CONTROLLER BRIDGE */}
        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
          cyberpunkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
            <span className="cursor-pointer hover:text-indigo-400" onClick={() => navigate('/')}>Dashboard</span>
            <span>/</span>
            <span className={cyberpunkTheme ? 'text-slate-300' : 'text-slate-700'}>New Ticket</span>
          </div>

          {/* FEATURE 4: THEME CHANGER MATRIX COMPONENT */}
          <button 
            onClick={() => setCyberpunkTheme(!cyberpunkTheme)}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl border flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
              cyberpunkTheme 
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300' 
                : 'bg-slate-100 border-slate-300 text-purple-700 hover:bg-slate-200'
            }`}
          >
            {cyberpunkTheme ? '⚡ Cyberpunk Mode' : '💼 Minimal Slate'}
          </button>
        </div>

        {/* PREMIUM SPLIT GRID ASSEMBLY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* PRIMARY SUPPORT TICKET APPLICANT FORM */}
          <div className={`p-6 border rounded-2xl shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300 ${
            cyberpunkTheme ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-slate-200'
          }`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <div>
              <h1 className={`text-xl font-black tracking-tight ${cyberpunkTheme ? 'text-white' : 'text-slate-900'}`}>
                Create Support Ticket
              </h1>
              <p className={`text-xs mt-1 ${cyberpunkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                Describe your issue and our background AI engine will classify and prioritize it automatically.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TICKET TITLE FIELDS INPUT */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Ticket Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Cannot access my account after password reset"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors ${
                    cyberpunkTheme ? 'bg-[#050811] border border-slate-800/80 text-slate-200' : 'bg-slate-50 border border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* TICKET TEXT DESCRIPTION TEXTAREA */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  <label>Detailed Incident Description</label>
                  <span className={description.length > 4500 ? 'text-rose-400' : 'text-slate-500'}>
                    {description.length}/5000
                  </span>
                </div>
                <textarea 
                  required
                  rows="6"
                  maxLength="5000"
                  placeholder="Provide detailed context regarding the failure or inquiry vector strings..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed font-sans ${
                    cyberpunkTheme ? 'bg-[#050811] border border-slate-800/80 text-slate-200' : 'bg-slate-50 border border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* FORM ACTIONS HUBS BUTTONS */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-900/40">
                <button 
                  type="button"
                  onClick={() => navigate('/tickets')}
                  className={`px-4 py-2 text-xs font-mono font-bold border rounded-xl active:scale-[0.98] transition-all ${
                    cyberpunkTheme ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !description.trim()}
                  className={`px-5 py-2 text-xs font-mono font-bold text-white rounded-xl shadow-lg active:scale-[0.98] transition-all ${
                    isSubmitting 
                      ? 'bg-indigo-950 text-indigo-400 border border-indigo-900 animate-pulse cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-950/40'
                  }`}
                >
                  {isSubmitting ? 'ENGINE ROUTING...' : 'DISPATCH TO AI'}
                </button>
              </div>
            </form>
          </div>

          {/* DYNAMIC SIDE PANEL: REAL-TIME AI CLASSIFICATION RUNTIME FEED */}
          <div className="space-y-4">
            
            {/* FEATURE 2: CURRENT PARSED AI CLASSIFICATION BADGES MATRIX */}
            <div className={`p-5 border rounded-2xl relative overflow-hidden backdrop-blur-sm transition-all duration-300 ${
              cyberpunkTheme ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50/60 border-indigo-100'
            }`}>
              <div className="flex items-start space-x-3">
                <div className="text-base text-indigo-400 mt-0.5">🧠</div>
                <div className="space-y-2 w-full">
                  <h4 className={`text-xs font-bold font-mono uppercase tracking-wider ${cyberpunkTheme ? 'text-indigo-300' : 'text-indigo-900'}`}>
                    AI Live Inference Output
                  </h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                      confidenceScore > 0 ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-500 italic'
                    }`}>
                      {predictedCategory}
                    </span>
                    {confidenceScore > 0 && (
                      <span className="text-xs font-mono font-black text-purple-400 animate-pulse">
                        🎯 {confidenceScore}% Match
                      </span>
                    )}
                  </div>
                  
                  {/* FEATURE 1: ONE-CLICK INTERACTIVE OVERRIDE WORKFLOW ACTION */}
                  {confidenceScore > 0 && (
                    <button
                      type="button"
                      onClick={handleForceTriageReset}
                      className="mt-2 w-full py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 border border-slate-800 hover:text-purple-400 hover:border-purple-500/30 rounded-md transition-colors bg-[#03060c]/40"
                    >
                      ⚡ Force Max Triage Confidence
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* LIVE MACHINE LEARNING MATRIX TOKEN SANDBOX */}
            <div className={`p-5 border rounded-2xl space-y-4 shadow-xl transition-all duration-300 ${
              cyberpunkTheme ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <div className="flex justify-between items-center border-b border-slate-900/60 pb-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span> NLP Parsing Sandbox
                </h4>
                <span className="text-[9px] font-mono text-slate-600">STATE: LIVE</span>
              </div>

              {/* Parsed Keywords Text Blocks */}
              <div className="space-y-3">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider mb-1.5">Feature Extraction (Tokens)</span>
                  {tokens.length === 0 ? (
                    <div className="text-[11px] font-mono text-slate-600 italic p-2 bg-[#04060d]/30 border border-slate-900/40 rounded-lg">Awaiting character ingestion streams...</div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {tokens.map((token, index) => (
                        <span key={index} className="px-2 py-0.5 bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 rounded text-[10px] font-mono font-bold animate-fadeIn">
                          {token}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mathematical Tensor Dense Mapping Multipliers */}
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider mb-1.5">Simulated Dense Layer Array</span>
                  {embeddingVector.length === 0 ? (
                    <div className="text-[11px] font-mono text-slate-600 italic p-2 bg-[#04060d]/30 border border-slate-900/40 rounded-lg">Awaiting scalar quantization parameters...</div>
                  ) : (
                    <div className="p-2.5 bg-[#04060d] border border-slate-900 rounded-xl font-mono text-[10px] text-purple-400 overflow-x-auto truncate select-none tracking-wide">
                      [ {embeddingVector.join(", ")} ]
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FEATURE 3: LOCAL OPTIMIZATION LEDGER LIST COMPONENT */}
            <div className={`p-5 border rounded-2xl shadow-xl transition-all duration-300 ${
              cyberpunkTheme ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <div className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 border-b border-slate-900/60 pb-2 mb-2">
                📜 Active Ingestion Logs
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {auditLedger.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] font-mono p-1.5 bg-[#03060c]/40 rounded border border-slate-900/60">
                    <span className="text-purple-400">[{log.time}]</span>
                    <span className="text-slate-300 truncate max-w-[120px]">{log.action}</span>
                    <span className="text-emerald-400 font-bold">{log.result}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
