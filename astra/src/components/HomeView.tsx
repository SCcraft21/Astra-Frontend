import React, { useState } from "react";
import { AppTab } from "../types";
import AstraLogo from "./AstraLogo";

interface HomeViewProps {
  onNavigate: (tab: AppTab) => void;
  onLaunchPrompt: (prompt: string) => void;
}

export default function HomeView({ onNavigate, onLaunchPrompt }: HomeViewProps) {
  const [quickPrompt, setQuickPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPrompt.trim()) {
      onLaunchPrompt(quickPrompt);
      setQuickPrompt("");
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Hero Image Focus Section with interactive glow */}
      <div className="relative mb-10 flex justify-center items-center">
        <div className="absolute inset-0 bg-[#c0c1ff]/20 blur-3xl rounded-full scale-150 opacity-45"></div>
        <AstraLogo className="w-36 h-36 md:w-52 md:h-52 relative z-10 logo-pulse" />
      </div>

      {/* Typography Main Cluster */}
      <div className="max-w-4xl text-center mb-16 px-2">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6">
          Intelligence that <span className="text-[#ffb95f] font-semibold">Breathes.</span>
        </h1>
        <p className="text-lg md:text-xl text-[#c7c4d7]/90 max-w-2xl mx-auto leading-relaxed mb-10">
          Experience the next evolution of human-AI collaboration. ASTRA translates complex data into organic insights, moving beyond computation into true atmospheric partnership.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => onNavigate("chat")}
            className="w-full sm:w-auto bg-[#ffb95f] text-[#2a1700] hover:bg-[#ffddb8] font-semibold px-10 py-3.5 rounded-full shadow-[0_0_35px_rgba(255,185,95,0.25)] hover:scale-[1.03] transition-all cursor-pointer"
          >
            Get Started
          </button>
          <button
            onClick={() => onNavigate("memory")}
            className="w-full sm:w-auto glass-card text-white hover:bg-white/5 font-medium px-10 py-3.5 rounded-full transition-all cursor-pointer"
          >
            Explore Memorics
          </button>
        </div>
      </div>

      {/* Bento Grid Showcase Panels */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 pb-12">
        
        {/* Core Card: Contextual Fluidity */}
        <div className="md:col-span-8 glass-card p-8 rounded-3xl flex flex-col justify-end min-h-[350px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/40 to-transparent z-10"></div>
          <img
            alt="Fluid dynamic flow background representing neural pathways"
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNYD9-Kp2eOcEF-CTJaZF4yPyzLE61FtxtJMYh2YxY_khP0aDI0hHpGwKzYdzoCr2OKAvqCwkimzBEw4JBU167yUJsnZqlY4Qb4Lw6azkX7XqfSyOBVes_hht8Mt8pxMFaVQDoqn45M-B5vzniDIVimqfRv0zogkyp3X6oE2Qdlhkz16wDNYseMyms2ge0OstXZ900nQYZSPfbYFuTSInOdqUMRXpgD-H9RZrfXGy6jzhtCEIhmiB51BRr3zrzYeGChrWxo0d7nx0"
          />
          <div className="relative z-20">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#ffb95f] mb-2 block">
              The Contextual Engine
            </span>
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2">
              Contextual Fluidity
            </h3>
            <p className="text-sm text-[#c7c4d7] max-w-md">
              Our neural architecture adapts directly to your unique workflow, absorbing context layers and creating highly personalized workspace calibration.
            </p>
          </div>
        </div>

        {/* Ethics Card */}
        <div className="md:col-span-4 glass-card p-8 rounded-3xl flex flex-col justify-between border-[#c0c1ff]/20">
          <div className="w-12 h-12 rounded-full bg-[#c0c1ff]/10 flex items-center justify-center border border-[#c0c1ff]/20 mb-6">
            <span className="material-symbols-outlined text-[#c0c1ff] text-2xl">gavel</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Ethics-First Core</h3>
            <p className="text-sm text-[#c7c4d7]/80 leading-relaxed">
              Every analytical generation is structured with carbon-transparency and deep human agency in mind, prioritizing safety and auditability above pure inference.
            </p>
          </div>
        </div>

        {/* System Optimal Status */}
        <div className="md:col-span-4 glass-card p-6 rounded-3xl flex flex-col justify-between bg-[#222a3d]/20 border-l-4 border-l-[#ffb95f]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb95f] thinking-pulse"></span>
            <span className="text-xs font-semibold uppercase text-[#ffb95f]">System Optimal</span>
          </div>
          <div className="mt-4">
            <p className="text-lg font-medium text-white leading-tight">
              Real-time calibration across all environment logs.
            </p>
            <p className="text-xs text-[#c7c4d7]/70 mt-1">
              Active models and nodes evaluated: 100% compliant.
            </p>
          </div>
        </div>

        {/* Developer Sandbox Card */}
        <div className="md:col-span-8 glass-card p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-br from-[#222a3d]/60 to-transparent">
          <div className="flex-1">
            <span className="text-xs font-semibold text-[#c0c1ff] uppercase tracking-wider block mb-1">
              ACCESS PORTAL
            </span>
            <h3 className="text-2xl font-semibold text-white mb-2">Developer Sandbox</h3>
            <p className="text-sm text-[#c7c4d7]/80 mb-6">
              Create customized contextual workflows, manage API endpoints, and monitor deep neural tokens using our secure API terminal.
            </p>
            <button
              onClick={() => onNavigate("tools")}
              className="text-xs font-semibold text-[#c0c1ff] flex items-center gap-2 hover:translate-x-2 transition-transform duration-300"
            >
              EXPLORE DEV TOOLS <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="hidden sm:block w-36 h-36 bg-[#2d3449]/40 border border-white/5 rounded-2xl p-4 shrink-0 shadow-inner rotate-2">
            <div className="w-full h-full flex flex-col justify-between font-mono text-[10px] text-[#c0c1ff]/60">
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span>terminal.log</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f]"></span>
              </div>
              <p className="text-[9px] text-[#c7c4d7]/50 mt-1 leading-tight">
                $ astra --init<br />
                [OK] Loaded Core<br />
                [OK] Active Contexts
              </p>
              <div className="flex items-center gap-1 text-[#ffb95f]">
                <span className="material-symbols-outlined text-xs">key</span>
                <span>Active Keys: 3</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Persistent Bottom Prompt Field */}
      <div className="w-full max-w-2xl mt-12 mb-6">
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="absolute inset-0 bg-[#c0c1ff]/10 blur-3xl -z-10 rounded-full"></div>
          <div className="glass-card-light rounded-full p-2 pl-6 pr-2 flex items-center gap-4 border border-white/20 shadow-xl focus-within:scale-[1.01] transition-all duration-300">
            <span className="material-symbols-outlined text-[#c0c1ff] select-none">auto_awesome</span>
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="Ask ASTRA to start a session or make a projection..."
              className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder-[#c7c4d7]/40 text-sm font-medium py-3"
            />
            <button
              type="submit"
              className="bg-[#c0c1ff] hover:bg-white text-[#1000a9] p-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
