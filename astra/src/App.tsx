import React, { useState, useEffect } from "react";
import { AppTab, Message, ContextLayer, LearnedInsight, DeveloperKey } from "./types";
import HomeView from "./components/HomeView";
import ChatView from "./components/ChatView";
import MemoryView from "./components/MemoryView";
import ToolsView from "./components/ToolsView";
import AuthOverlay from "./components/AuthOverlay";
import AstraLogo from "./components/AstraLogo";
import { supabase, supabaseDb, isSupabaseConfigured } from "./lib/supabase";

// Initial dummy data for fallback / first-time user initialization
const initialDeveloperKeys = [
  {
    id: "1",
    name: "Main Dashboard V2",
    scope: "Full Access (Read/Write)",
    token: "astra_live_6f00be8083ffc0c1ff39k1",
    created: "May 12, 2026"
  },
  {
    id: "2",
    name: "iOS Client - Beta",
    scope: "Context-Only Extraction",
    token: "astra_test_ca8100ffbddb8ffb95fr92m",
    created: "Apr 28, 2026"
  },
  {
    id: "3",
    name: "External Analytics Sync",
    scope: "Read-Only Analytics",
    token: "astra_read_171f332d3449dae2fdx21l",
    created: "Mar 15, 2026"
  }
];

const initialContexts = [
  {
    id: "layer_1",
    title: "Design Preferences",
    description: "Preference for soft-tech aesthetic, asymmetric layouts, violet/indigo accenting, and minimal card views.",
    updated: "2h ago",
    active: true
  },
  {
    id: "layer_2",
    title: "Project Constraints",
    description: "Project aligns with eco-conscious standards, vertical bio-mimicry, and quantum UI optimization.",
    updated: "5d ago",
    active: true
  },
  {
    id: "layer_3",
    title: "External API Specs",
    description: "Requires exposing secure ASTRA endpoints to mobile clients and dashboard controllers with JWT scopes.",
    updated: "Hibernating",
    active: false
  }
];

const initialInsights = [
  {
    id: "insight_1",
    title: "Asymmetric Layout Preference",
    content: "Detected recurring pattern of user engagement with offset grid structures, prioritizing dynamic asymmetry for generative visual elements.",
    match: 98,
    type: "insight",
    date: "Oct 24, 2026 • 14:22"
  },
  {
    id: "insight_2",
    title: "Color Palette Calibration",
    content: "Learned preference for rich indigo-navy layouts with vibrant violet accents for interactive paths, and warm peach for notifications or alerts.",
    match: 82,
    type: "insight",
    date: "Oct 22, 2026 • 09:10"
  },
  {
    id: "insight_3",
    title: "Semantic Logic Pattern",
    content: "Understands the strict design boundaries: layout structure first, then modular component injection, keeping visual style pure and clean.",
    match: 65,
    type: "insight",
    date: "Oct 19, 2026 • 18:45"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isMemoryLoading, setIsMemoryLoading] = useState(false);
  const [isKeysLoading, setIsKeysLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dynamic entity lists
  const [contexts, setContexts] = useState<ContextLayer[]>(initialContexts);
  const [insights, setInsights] = useState<LearnedInsight[]>(initialInsights);
  const [developerKeys, setDeveloperKeys] = useState<DeveloperKey[]>(initialDeveloperKeys);

  // User details & Auth modal state
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState("Elena Vance");
  const [userRole, setUserRole] = useState("Developer Core");
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  // Quick prompt launched from Home view
  const [lunchedPromptText, setLunchedPromptText] = useState("");

  // Check if system is missing API Key locally
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  // Render Backend connection proxy states
  const [backendStatus, setBackendStatus] = useState<{
    proxyEnabled: boolean;
    url: string;
    status: "online" | "connecting" | "offline";
    latency: number;
    outboundIps: string[];
  } | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [showIps, setShowIps] = useState(false);

  // Auth observer sync
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Offline fallback state checks
      const simulated = localStorage.getItem("supa_simulated_user");
      if (simulated) {
        try {
          const userObj = JSON.parse(simulated);
          setSupabaseUser(userObj);
          setCurrentUser(userObj.displayName || "Simulated Operator");
          setUserRole("Simulated Local Operator");
        } catch {
          // Reset
        }
      }
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      setSupabaseUser(user);
      if (user) {
        const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Operator";
        setCurrentUser(displayName);
        setUserRole("Registered Operator");
      } else {
        setCurrentUser("Guest");
        setUserRole("Uncalibrated");
        setContexts(initialContexts);
        setInsights(initialInsights);
        setDeveloperKeys(initialDeveloperKeys);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real-time Database sync & Auto-population
  useEffect(() => {
    if (!supabaseUser) return;

    // Retrieve unique identifier (fallback to simulated email/ID)
    const rawId = supabaseUser.id || supabaseUser.email || "local_guest";
    const cleanId = rawId.replace(/[^a-zA-Z0-9]/g, "_");

    const loadData = async () => {
      // 1. Contexts Load
      let fetchedContexts = await supabaseDb.getContexts(cleanId);
      if (fetchedContexts.length === 0) {
        // Auto-populate
        for (const c of initialContexts) {
          await supabaseDb.saveContext(cleanId, c);
        }
        fetchedContexts = initialContexts;
      }
      setContexts(fetchedContexts);

      // 2. Insights Load
      let fetchedInsights = await supabaseDb.getInsights(cleanId);
      if (fetchedInsights.length === 0) {
        // Auto-populate
        for (const i of initialInsights) {
          await supabaseDb.saveInsight(cleanId, i);
        }
        fetchedInsights = initialInsights;
      }
      fetchedInsights.sort((a, b) => b.id.localeCompare(a.id));
      setInsights(fetchedInsights);

      // 3. Developer Keys Load
      let fetchedKeys = await supabaseDb.getDeveloperKeys(cleanId);
      if (fetchedKeys.length === 0) {
        // Auto-populate
        for (const k of initialDeveloperKeys) {
          await supabaseDb.saveDeveloperKey(cleanId, k);
        }
        fetchedKeys = initialDeveloperKeys;
      }
      setDeveloperKeys(fetchedKeys);
    };

    loadData();
  }, [supabaseUser]);

  // Initial Rest fetch for proxy status
  useEffect(() => {
    fetchBackendStatus();
    // Set up polling to check Render backend warming and connection health
    const interval = setInterval(fetchBackendStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchBackendStatus = async () => {
    try {
      const res = await fetch("/api/backend/status");
      if (res.ok) {
        const data = await res.json();
        setBackendStatus(data);
      }
    } catch (err) {
      console.warn("Error fetching Custom Render API gateway status:", err);
    }
  };

  const handleToggleBackend = async () => {
    setIsPinging(true);
    try {
      const res = await fetch("/api/backend/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        // Retrieve fresh status & sync state databases
        const statusRes = await fetch("/api/backend/status");
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setBackendStatus(statusData);
        }
      }
    } catch (err) {
      console.error("Failed to update Render API integration mapping:", err);
    } finally {
      setIsPinging(false);
    }
  };

  // Toggle dynamic context layer switches online/offline
  const handleToggleContext = async (id: string) => {
    const context = contexts.find((c) => c.id === id);
    if (!context) return;
    const toggled = { ...context, active: !context.active, updated: "Just now" };

    if (supabaseUser) {
      const rawId = supabaseUser.id || supabaseUser.email || "local_guest";
      const cleanId = rawId.replace(/[^a-zA-Z0-9]/g, "_");
      await supabaseDb.saveContext(cleanId, toggled);
    }
    setContexts(contexts.map((c) => (c.id === id ? toggled : c)));
  };

  // Inject a brand new customized Context Layer boundary
  const handleInjectContext = async (title: string, description: string) => {
    const newLayer: ContextLayer = {
      id: `layer_${Date.now()}`,
      title,
      description,
      updated: "Just now",
      active: true
    };

    if (supabaseUser) {
      const rawId = supabaseUser.id || supabaseUser.email || "local_guest";
      const cleanId = rawId.replace(/[^a-zA-Z0-9]/g, "_");
      await supabaseDb.saveContext(cleanId, newLayer);
    }
    setContexts([...contexts, newLayer]);
  };

  // Send feedback parameters to modify memory dynamically via Gemini intelligence
  const handleModifyMemory = async (feedback: string) => {
    setIsMemoryLoading(true);
    try {
      const res = await fetch("/api/memories/modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback })
      });
      if (res.ok) {
        const data = await res.json();
        if (supabaseUser) {
          const rawId = supabaseUser.id || supabaseUser.email || "local_guest";
          const cleanId = rawId.replace(/[^a-zA-Z0-9]/g, "_");
          await supabaseDb.saveInsight(cleanId, data.insight);
          setInsights([data.insight, ...insights.filter(i => i.id !== data.insight.id)]);
        } else {
          setInsights(data.insights);
        }
      } else {
        const errData = await res.json();
        if (errData.error && errData.error.includes("API key")) {
          setApiKeyError("Memory calibration utilizes the Gemini API. Please set up GEMINI_API_KEY inside the Secrets panel.");
        }
      }
    } catch (err) {
      console.error("Memory modify error:", err);
    } finally {
      setIsMemoryLoading(false);
    }
  };

  // Provision customized client gateways Developer Keys
  const handleGenerateKey = async (name: string, scope: string) => {
    setIsKeysLoading(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, scope })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (supabaseUser) {
            const rawId = supabaseUser.id || supabaseUser.email || "local_guest";
            const cleanId = rawId.replace(/[^a-zA-Z0-9]/g, "_");
            await supabaseDb.saveDeveloperKey(cleanId, data.key);
          }
          setDeveloperKeys([data.key, ...developerKeys]);
        }
      }
    } catch (err) {
      console.error("Failed to generate developer key:", err);
    } finally {
      setIsKeysLoading(false);
    }
  };

  // Revoke security developer access key of target id
  const handleRevokeKey = async (id: string) => {
    if (supabaseUser) {
      const rawId = supabaseUser.id || supabaseUser.email || "local_guest";
      const cleanId = rawId.replace(/[^a-zA-Z0-9]/g, "_");
      await supabaseDb.deleteDeveloperKey(cleanId, id);
    }
    setDeveloperKeys(developerKeys.filter((key) => key.id !== id));
  };

  // Send message on active Discussion tab through server proxy 
  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: "user",
      text
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);
    setApiKeyError(null);

    // Build immediate chat history up to last 15 messages for model efficiency
    const historyPayload = messages.slice(-15).map((m) => ({
      sender: m.sender,
      text: m.text
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMessage: Message = {
          id: `msg_${Date.now() + 1}`,
          sender: "ai",
          text: data.text,
          chartData: data.chartData,
          citations: data.citations
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorData = await res.json();
        if (errorData.isConfigured === false || (errorData.error && errorData.error.includes("API key"))) {
          setApiKeyError("Gemini API is not configured. Please supply your API key within the Secrets menu to enable interactive chat responses.");
        }
        
        // Push safe mock response in case of API Key error so design mock remains gorgeous & functional
        const mockFallbackText = `[DEMO WORKSPACE WARNING]: Gemini API credentials are required for live text responses.

Below is ASTRA's calibrated design logic overview for: "${text.substring(0, 45)}..."

1. Organic Microstructures: Our system is analyzing decentralized bio-timber templates dynamically.
2. Symmetrical Compliance: Current logs project high carbon-balance offsets when utilizing vertical fungal concrete designs.

Please update the GEMINI_API_KEY parameter in your environment variables config.`;

        const failMessage: Message = {
          id: `msg_err_${Date.now()}`,
          sender: "ai",
          text: mockFallbackText,
          chartData: [
            { label: "2024", value: 30 },
            { label: "2026", value: 55 },
            { label: "2028", value: 70 },
            { label: "2030", value: 95 }
          ],
          citations: [
            { title: "Sustainable Urban Design Standards V4", url: "https://example.com/urbanics-sustainability" },
            { title: "ASTRA Interface Specs & System Parameters", url: "https://example.com/astra-interface" }
          ]
        };
        setMessages((prev) => [...prev, failMessage]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      // Fallback
    } finally {
      setIsChatLoading(false);
    }
  };

  // Automatically transition and process home input triggers
  const handleLaunchPromptFromHome = (prompt: string) => {
    setLunchedPromptText(prompt);
    setActiveTab("chat");
    handleSendMessage(prompt);
  };

  const clearQuickPrompt = () => {
    setLunchedPromptText("");
  };

  // Auth Overlay updates profile name
  const handleAuthenticate = (username: string) => {
    setCurrentUser(username);
    setUserRole("Registered Operator");
  };

  return (
    <div className="min-h-screen bg-[#0b1326] flex text-[#dae2fd] overflow-x-hidden relative">
      
      {/* 1. Left Side Control Panel Workspace (Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#12192a]/95 border-r border-white/5 p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:flex`}>
        
        {/* Upper Brand panel & Tab Lists */}
        <div className="space-y-10">
          
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <AstraLogo size={38} className="shrink-0 scale-105" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-widest leading-none flex items-center gap-1.5 font-mono">
                ASTRA
              </h1>
              <p className="text-[10px] text-[#c7c4d7]/50 uppercase tracking-widest font-semibold mt-1 font-mono">
                node v1.4 • online
              </p>
            </div>
          </div>

          {/* Navigation Items Map */}
          <nav className="space-y-2">
            {[
              { id: "home", label: "Overview", icon: "space_dashboard" },
              { id: "chat", label: "Discussion Core", icon: "forum" },
              { id: "memory", label: "Memory Nexus", icon: "psychology" },
              { id: "tools", label: "Developer Sandbox", icon: "api" }
            ].map((navTab) => {
              const isSelected = activeTab === navTab.id;
              return (
                <button
                  key={navTab.id}
                  onClick={() => {
                    setActiveTab(navTab.id as AppTab);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? "bg-[#c0c1ff]/15 text-white border border-white/10 [text-shadow:_0_0_8px_rgba(255,255,255,0.15)] shadow-[0_0_20px_rgba(192,193,255,0.06)] scale-[1.01]" 
                      : "text-[#c7c4d7]/65 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-lg ${isSelected ? 'text-[#ffb95f] material-symbols-fill' : ''}`}>
                      {navTab.icon}
                    </span>
                    <span>{navTab.label}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] animate-ping"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Render API Connection Port */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4.5 space-y-3 relative overflow-hidden group hover:border-[#c0c1ff]/15 transition-all duration-300">
            {backendStatus?.status === "online" && (
              <div className="absolute -right-8 -bottom-8 w-20 h-20 rounded-full bg-[#c0c1ff]/5 blur-xl pointer-events-none group-hover:bg-[#c0c1ff]/10 transition-all duration-300"></div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#c7c4d7]/50 uppercase tracking-widest font-mono">Render API Link</span>
              <button 
                onClick={fetchBackendStatus} 
                title="Force Status Connection Handshake"
                disabled={isPinging}
                className="p-1 rounded-lg hover:bg-white/5 text-[#c7c4d7]/70 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[14px] ${isPinging ? 'animate-spin' : ''}`}>sync</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    backendStatus?.proxyEnabled
                      ? (backendStatus?.status === "online" ? "bg-emerald-400" : backendStatus?.status === "connecting" ? "bg-amber-400" : "bg-red-400")
                      : "bg-white/20"
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    backendStatus?.proxyEnabled
                      ? (backendStatus?.status === "online" ? "bg-emerald-500" : backendStatus?.status === "connecting" ? "bg-amber-500" : "bg-red-500")
                      : "bg-white/30"
                  }`}></span>
                </span>
                <span className="text-xs font-semibold text-white tracking-wide">
                  {backendStatus?.proxyEnabled ? (
                    backendStatus?.status === "online" ? "Authenticated" :
                    backendStatus?.status === "connecting" ? "Warming Node..." : "Gateway Offline"
                  ) : (
                    "Local Core Only"
                  )}
                </span>
              </div>
              
              {backendStatus?.proxyEnabled && backendStatus?.status === "online" && backendStatus.latency > 0 && (
                <span className="text-[9px] font-mono text-[#ffb95f] bg-[#ffb95f]/10 px-1.5 py-0.5 rounded-md font-bold">
                  {backendStatus.latency}ms
                </span>
              )}
            </div>

            <div className="text-[10px] text-[#c7c4d7]/40 truncate font-mono select-all">
              astra-api-02el.onrender.com
            </div>

            {/* Connection Switch Toggle */}
            <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
              <span className="text-[9px] font-bold text-white uppercase tracking-widest font-mono">Proxy Tunnel</span>
              <button
                onClick={handleToggleBackend}
                disabled={isPinging}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 cursor-pointer disabled:opacity-50 ${
                  backendStatus?.proxyEnabled ? "bg-[#c0c1ff]" : "bg-white/10"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-[#0b1326] shadow-md transform transition-transform duration-300 ${
                  backendStatus?.proxyEnabled ? "translate-x-4" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* Whitelisted Outbound IPs section */}
            <div className="border-t border-white/5 pt-2.5">
              <button
                onClick={() => setShowIps(!showIps)}
                className="w-full flex items-center justify-between text-[9px] font-bold text-[#c7c4d7]/60 uppercase tracking-widest font-mono hover:text-white transition-colors cursor-pointer"
              >
                <span>Tunnel IP Rules (CIDR)</span>
                <span className="material-symbols-outlined text-[13px]">{showIps ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
              </button>
              
              {showIps && (
                <div className="mt-2 space-y-1.5 bg-[#0b1326]/50 p-2 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-[#c7c4d7]/40 leading-normal mb-1">
                    Whitelisted on outbound Render servers:
                  </p>
                  {["74.220.49.0/24", "74.220.57.0/24"].map((ip) => (
                    <div key={ip} className="flex items-center justify-between text-[9px] font-mono text-white/90 bg-white/5 py-0.5 px-1.5 rounded-lg border border-white/5">
                      <span>{ip}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ip);
                        }}
                        title="Copy to clipboard"
                        className="text-[#c7c4d7]/40 hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[11px]">content_copy</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Sidebar Footer: Current user metadata */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-[#c0c1ff]/15 border border-[#c0c1ff]/30 flex items-center justify-center font-bold text-white uppercase text-sm shadow-inner relative overflow-hidden">
              <span className="material-symbols-outlined text-[#c0c1ff]">person</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{currentUser}</h4>
              <p className="text-[10px] text-[#c7c4d7]/50 uppercase font-bold tracking-wider truncate">{userRole}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowAuthOverlay(true)}
              className="text-[10px] font-bold uppercase tracking-wider bg-[#c0c1ff]/10 hover:bg-[#c0c1ff]/20 text-[#c0c1ff] py-2 px-3 rounded-xl transition-all cursor-pointer text-center"
            >
              Sign In
            </button>
            <button
              onClick={async () => {
                if (isSupabaseConfigured && supabase) {
                  try {
                    await supabase.auth.signOut();
                  } catch (err) {
                    console.error("Supabase Signout Error", err);
                  }
                } else {
                  localStorage.removeItem("supa_simulated_user");
                  setSupabaseUser(null);
                  setCurrentUser("Guest");
                  setUserRole("Uncalibrated");
                  setContexts(initialContexts);
                  setInsights(initialInsights);
                  setDeveloperKeys(initialDeveloperKeys);
                }
              }}
              className="text-[10px] font-bold uppercase tracking-wider text-[#c7c4d7]/40 hover:text-red-400 py-2 px-3 rounded-xl transition-all cursor-pointer text-center"
            >
              Log Out
            </button>
          </div>
        </div>

      </aside>

      {/* Screen Backdrop Click dismiss for mobile side navigation Drawer */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#0b1326]/60 backdrop-blur-sm md:hidden pointer-events-auto"
        />
      )}

      {/* 2. Primary Page workspace (Right of Sidebar) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Main Header Controller */}
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between shrink-0 relative z-30 bg-[#0b1326]/60 backdrop-blur-md">
          
          <div className="flex items-center gap-3">
            {/* Hamburger button icon */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-[#c7c4d7] md:hidden cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">menu</span>
            </button>
            
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#c7c4d7]/70 font-bold uppercase tracking-widest font-mono">
              <span className="w-2 h-2 rounded-full bg-[#ffb95f] thinking-pulse"></span>
              <span>ASTRA.Core System Live</span>
            </div>
          </div>

          {/* Current Page descriptive title block */}
          <div className="text-right">
            <span className="text-[10px] font-bold text-[#c0c1ff] uppercase tracking-widest font-mono block">Active Module</span>
            <span className="text-xs font-semibold text-white tracking-wider">
              {activeTab === "home" && "System Overview"}
              {activeTab === "chat" && "Calibrating Discussion Workspace"}
              {activeTab === "memory" && "Neural Memory Core"}
              {activeTab === "tools" && "Developer Access Portals"}
            </span>
          </div>

        </header>

        {/* Dynamic warning banners alerts if API Key is uninitialized */}
        {apiKeyError && (
          <div className="mx-6 mt-4 p-4.5 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl flex items-start gap-3.5 z-20 shadow-md fade-in-up">
            <span className="material-symbols-outlined text-yellow-500 text-xl font-bold shrink-0">warning</span>
            <div>
              <p className="text-xs font-bold text-yellow-500 uppercase tracking-wider font-mono">Credentials Offline Warning</p>
              <p className="text-xs text-yellow-100/90 leading-relaxed mt-1">{apiKeyError}</p>
            </div>
            <button
              onClick={() => setApiKeyError(null)}
              className="text-[#c7c4d7] hover:text-white ml-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Core dynamic content router panels */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          
          {activeTab === "home" && (
            <HomeView
              onNavigate={(tab) => {
                setActiveTab(tab);
              }}
              onLaunchPrompt={handleLaunchPromptFromHome}
            />
          )}

          {activeTab === "chat" && (
            <ChatView
              messages={messages}
              isChatLoading={isChatLoading}
              onSendMessage={handleSendMessage}
              quickPrompt={lunchedPromptText}
              onClearQuickPrompt={clearQuickPrompt}
            />
          )}

          {activeTab === "memory" && (
            <MemoryView
              contexts={contexts}
              insights={insights}
              onToggleContext={handleToggleContext}
              onInjectContext={handleInjectContext}
              onModifyMemory={handleModifyMemory}
              isMemoryLoading={isMemoryLoading}
            />
          )}

          {activeTab === "tools" && (
            <ToolsView
              keys={developerKeys}
              onGenerateKey={handleGenerateKey}
              onRevokeKey={handleRevokeKey}
              isKeysLoading={isKeysLoading}
            />
          )}

        </main>

      </div>

      {/* Secure Identification Login overlay modal */}
      {showAuthOverlay && (
        <AuthOverlay
          onClose={() => setShowAuthOverlay(false)}
          onAuthenticate={handleAuthenticate}
        />
      )}

    </div>
  );
}
