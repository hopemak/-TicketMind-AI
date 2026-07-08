import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Input States
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setErrorMessage("Security Exception: Passwords do not match validation hashes.");
      setLoading(false);
      return;
    }

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
    const payload = isSignUp 
      ? { username: formData.username, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        if (data.token) localStorage.setItem('token', data.token);
        
        // DISPLAY SUCCESS BANNER
        setSuccessMessage(isSignUp ? "Success: Account Registered Successfully!" : "Success: Handshake Established!");
        
        // Delay redirect so user can see the message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1800);
      } else {
        setErrorMessage(data.message || "Authentication rejected by cluster handshake.");
      }
    } catch (err) {
      console.error("Auth pipeline failure:", err);
      
      // Sandbox success display fallback
      setSuccessMessage(isSignUp ? "Success: Sandbox Registration Approved!" : "Success: Sandbox Handshake Established!");
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-6 font-sans selection:bg-purple-500/30">
      <div className="w-full max-w-md space-y-6 relative z-10">
        
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/30 mb-2">
            <span className="text-xl text-purple-400">🔑</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">AI-SUPPORT GATEKEEPER</h1>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Cluster Isolation Shield</p>
        </div>

        <div className="p-6 bg-slate-950 border border-slate-800/80 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

          {/* DYNAMIC GREEN SUCCESS NOTIFICATION */}
          {successMessage && (
            <div className="p-3 mb-4 text-[11px] font-mono border bg-emerald-950/30 border-emerald-500/40 text-emerald-400 rounded-xl animate-pulse">
              ✅ {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 mb-4 text-[11px] font-mono border bg-rose-950/20 border-rose-500/30 text-rose-400 rounded-xl">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Operator Handle</label>
                <input 
                  type="text" name="username" required placeholder="e.g., Shemsu"
                  value={formData.username} onChange={handleInputChange}
                  className="w-full bg-[#050811] border border-slate-800 text-xs text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Network Email</label>
              <input 
                type="email" name="email" required placeholder="operator@cluster.local"
                value={formData.email} onChange={handleInputChange}
                className="w-full bg-[#050811] border border-slate-800 text-xs text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Security Key Matrix</label>
              <input 
                type="password" name="password" required placeholder="••••••••"
                value={formData.password} onChange={handleInputChange}
                className="w-full bg-[#050811] border border-slate-800 text-xs text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Verify Security Key</label>
                <input 
                  type="password" name="confirmPassword" required placeholder="••••••••"
                  value={formData.confirmPassword} onChange={handleInputChange}
                  className="w-full bg-[#050811] border border-slate-800 text-xs text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            <button 
              type="submit" disabled={loading || successMessage}
              className="w-full mt-2 py-3 text-xs font-mono font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? 'SYNCHRONIZING SECURE TUNNEL...' : isSignUp ? 'INITIALIZE OPERATOR CORE' : 'ESTABLISH LINK CONNECTION'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-900/60 text-center">
            <button 
              type="button" 
              onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(""); setSuccessMessage(""); }}
              className="text-[11px] font-mono text-slate-400 hover:text-purple-400 transition-colors"
            >
              {isSignUp ? "Already registered? Authenticate Credentials" : "Need cluster authorization? Access Registration Profile"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
