import React, { useState } from "react";
import { DeveloperKey } from "../types";

interface ToolsViewProps {
  keys: DeveloperKey[];
  onGenerateKey: (name: string, scope: string) => void;
  onRevokeKey: (id: string) => void;
  isKeysLoading: boolean;
}

export default function ToolsView({
  keys,
  onGenerateKey,
  onRevokeKey,
  isKeysLoading
}: ToolsViewProps) {
  const [keyName, setKeyName] = useState("");
  const [scopes, setScopes] = useState("Full Access (Read/Write)");
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    onGenerateKey(keyName, scopes);
    setKeyName("");
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Simulated metrics
  const tokensRemaining = 85022;
  const totalLimit = 100000;
  const percentageRemaining = Math.round((tokensRemaining / totalLimit) * 100);

  // SVG parameters for circular indicator
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentageRemaining / 100) * circumference;

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-6 space-y-12">
      
      {/* Upper Title Cluster */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <span className="text-[10px] font-bold text-[#ffb95f] tracking-widest uppercase">
            Developer Sandbox
          </span>
          <h2 className="text-3xl font-light text-white tracking-tight">
            API Access & Credentials
          </h2>
          <p className="text-sm text-[#c7c4d7]/70 mt-1 max-w-xl">
            Provision secure gateway keys to inject ASTRA's cognitive logic, contextual memory layers, and diagnostic parameters directly into external applications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: API Key Generation Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-[40px] p-8 space-y-6">
            <div>
              <span className="text-[10px] font-semibold text-[#c0c1ff] uppercase tracking-widest block mb-1">
                Security Provisioning
              </span>
              <h3 className="text-xl font-light text-white tracking-tight">Generate Gateway Key</h3>
            </div>

            <form onSubmit={handleGenerateSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#c7c4d7]/80 uppercase tracking-wider mb-2">
                  Key Label Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Web App Client Integration"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="w-full bg-[#20273a]/50 text-white rounded-2xl py-3 px-4 text-xs font-medium border border-white/10 focus:outline-none focus:border-[#c0c1ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c7c4d7]/80 uppercase tracking-wider mb-2">
                  Access Authorization Scope
                </label>
                <div className="space-y-2">
                  {[
                    "Full Access (Read/Write)",
                    "Context-Only Extraction",
                    "Read-Only Analytics"
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setScopes(s)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        scopes === s 
                          ? "bg-[#c0c1ff]/15 text-white border-[#c0c1ff]/50" 
                          : "bg-[#161d2d]/25 text-[#c7c4d7]/80 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <span>{s}</span>
                      {scopes === s && (
                        <span className="material-symbols-outlined text-[#ffb95f] text-sm">check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isKeysLoading || !keyName.trim()}
                className="w-full bg-[#c0c1ff] hover:bg-white disabled:bg-white/10 text-[#1000a9] font-semibold py-3.5 rounded-full text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm font-bold">vpn_key</span>
                Generate Core Credentials
              </button>
            </form>
          </div>

          {/* Connected Token Quota and limit metrics dial (Mockup 2 side panel alignment) */}
          <div className="glass-card rounded-[40px] p-8 flex items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#c0c1ff]/5 to-transparent pointer-events-none"></div>
            
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-bold text-[#ffb95f] tracking-widest uppercase block">
                API TOKEN QUOTA
              </span>
              <p className="text-2xl font-light text-white tracking-tight">
                {tokensRemaining.toLocaleString()} <span className="text-xs text-[#c7c4d7]/60">rem.</span>
              </p>
              <div className="text-[10px] text-[#c7c4d7]/70 leading-relaxed font-mono">
                Daily Limit: 100,000<br />
                Reset: 14h 22m<br />
                Usage status: <strong className="text-emerald-400">Excellent</strong>
              </div>
            </div>

            {/* Circular progress SVG */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  fill="transparent"
                  stroke="url(#gradient-ring)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c0c1ff" />
                    <stop offset="100%" stopColor="#ddb7ff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <span className="text-sm font-bold text-white leading-none">{percentageRemaining}%</span>
                <span className="text-[8px] text-[#c7c4d7]/50 uppercase font-bold tracking-wider mt-0.5">Avail</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Keys List with revocation controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xl font-light text-white tracking-tight">Activated Client Gateways</h3>
            <span className="text-xs text-[#c7c4d7]/70 font-medium">
              Total Active: <strong>{keys.length}</strong>
            </span>
          </div>

          <div className="space-y-4">
            {keys.map((key) => {
              const isRevealed = revealedIds[key.id] || false;
              // Format token to obfuscate unless revealed
              const visibleToken = isRevealed 
                ? key.token.replace(/••••••••/, "") 
                : key.token;

              return (
                <div key={key.id} className="glass-card rounded-3xl p-6.5 border border-white/5 relative overflow-hidden group/key flex flex-col justify-between gap-4 fade-in-up">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-white">{key.name}</h4>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" title="Key is Active and operational"></span>
                      </div>
                      <p className="text-xs text-[#c7c4d7]/70 font-medium">{key.scope}</p>
                    </div>

                    <button
                      onClick={() => onRevokeKey(key.id)}
                      className="text-xs text-[#ef4444] bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.02]"
                    >
                      <span className="material-symbols-outlined text-[13px] font-bold">delete_forever</span>
                      Revoke
                    </button>
                  </div>

                  {/* Token presentation field with reveal eye */}
                  <div className="flex items-center justify-between gap-3 bg-[#111827]/40 border border-white/5 rounded-2xl p-3">
                    <div className="font-mono text-xs text-[#c0c1ff]/90 overflow-x-auto whitespace-nowrap no-scrollbar flex-1">
                      {visibleToken}
                    </div>

                    <button
                      onClick={() => toggleReveal(key.id)}
                      title={isRevealed ? "Obfuscate credential" : "Reveal full token key"}
                      className="text-[#c7c4d7] hover:text-white transition-colors shrink-0 p-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isRevealed ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>

                  <div className="text-[10px] text-[#c7c4d7]/50 flex justify-between items-center bg-white/5 px-4 py-1.5 rounded-full">
                    <span>Provisioned: {key.created}</span>
                    <span className="font-mono uppercase text-[#ffb95f] tracking-wider text-[9px] font-semibold">Active Socket</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
