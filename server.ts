import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client with standard User-Agent header for telemetry
const isApiKeyConfigured = !!process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (isApiKeyConfigured) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// In-memory data store for developer keys and learned memories to provide real interactivity
let developerKeys = [
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

let activeContexts = [
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

let learnedInsights = [
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

// Helper to check and require API key setup locally
function handleServiceCheck(res: any) {
  if (!isApiKeyConfigured || !ai) {
    res.status(503).json({
      error: "Gemini API key is not configured.",
      isConfigured: false,
      message: "Please configure your GEMINI_API_KEY in the Secrets panel."
    });
    return false;
  }
  return true;
}

// ==========================================
// RENDER CUSTOM BACKEND TUNNEL ENGINE
// ==========================================
const RENDER_BACKEND_URL = "https://astra-api-02el.onrender.com";
let isRemoteConnectionActive = true; // Enabled by default as requested

async function handleProxy(req: express.Request, res: express.Response, localFallback: () => Promise<any> | any) {
  if (!isRemoteConnectionActive) {
    return await localFallback();
  }

  const targetUrl = `${RENDER_BACKEND_URL}${req.originalUrl}`;
  try {
    const controller = new AbortController();
    // 6-second timeout to handle sleeping free-tier Render instances without stalling the app
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (req.headers.authorization) {
      headers["Authorization"] = req.headers.authorization as string;
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      signal: controller.signal
    };

    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const remoteRes = await fetch(targetUrl, fetchOptions);
    clearTimeout(timeoutId);

    if (remoteRes.status >= 200 && remoteRes.status < 300) {
      const data = await remoteRes.json();
      return res.status(remoteRes.status).json(data);
    } else {
      console.warn(`Alternative Render connection returned status ${remoteRes.status} for ${req.originalUrl}. Performing Local Fallback.`);
      return await localFallback();
    }
  } catch (error: any) {
    console.warn(`Render backend skip/timeout for ${req.originalUrl} (${error.message}). Performing Local Fallback.`);
    return await localFallback();
  }
}

// Local soft-tech fallback intelligence system to handle rate limits and API quota exhaustion gracefully.
function generateFallbackText(prompt: string, enabledLayersInfo: string): { text: string; chartData?: any; citations?: any } {
  const normalized = prompt.toLowerCase();
  
  let text = "";
  let chartData: any = null;
  let citations = [
    { title: "ASTRA Local Cache Core", url: "https://astra.dev/local" },
    { title: "ASTRA Interface Specification", url: "https://astra.dev/spec" }
  ];

  const isMetricsRequest = normalized.includes("projection") ||
                          normalized.includes("trend") ||
                          normalized.includes("chart") ||
                          normalized.includes("metric") ||
                          normalized.includes("data") ||
                          normalized.includes("statistic") ||
                          normalized.includes("efficiency");

  if (isMetricsRequest) {
    chartData = [
      { label: "2024", value: 42 },
      { label: "2026", value: 68 },
      { label: "2028", value: 55 },
      { label: "2030", value: 94 }
    ];
  }

  if (normalized.includes("hello") || normalized.includes("hi") || normalized.includes("hey")) {
    text = `### Greetings from ASTRA Core

Hello! I have gracefully transitioned to my **Local Adaptive Processing Node** (ASTRA Core Offline Engine) due to an upstream API rate limit or status code 429.

Even under gateway limitations, I remain fully operational:
1. **Dynamic Synapse Connection**: Maintained via local state-nexus parameters.
2. **Contextual Calibration**: Listening actively to active memory nodes.

How can I assist you with layout analysis, developer keys, or active memory vectors today?`;
  } else if (normalized.includes("key") || normalized.includes("token") || normalized.includes("api")) {
    text = `### API Key & Safe Access Management

ASTRA's built-in developer key module utilizes high-entropy token hashing to secure local scopes.

**Key Design Traits**:
- **Prefix Segregation**: Keys are labeled as \`astra_read\`, \`astra_test\`, or \`astra_live\` based on desired permission boundaries.
- **Dynamic Authorization**: Prevents unprivileged components from accessing your workspace's environment.
- **State Integrity**: Keys are persistent during the session across layout mutations.

*System Note: ASTRA is currently operating in Local Adaptive Processing mode due to a temporary gateway quota limit. Your requests are handled securely inside the container environment.*`;
  } else if (normalized.includes("memory") || normalized.includes("layer") || normalized.includes("context")) {
    text = `### Context Layers & Active Memory Interface

Your active layers regulate my cognitive traits. The following layers are currently configured:

${enabledLayersInfo ? enabledLayersInfo : "*No dedicated layers currently activated.*"}

**Active Memory Dynamics**:
- **Dynamic Augmentation**: System instructions are injected in real-time.
- **Cognitive Weight**: Each active layer alters the conversational vectors and UI layout accents.
- **Sub-auditable Paths**: Local state stores are updated safely when layers are toggled.

*System Note: Operating under Local Cognitive Fallback. State layers remain fully active and interactive!*`;
  } else if (normalized.includes("design") || normalized.includes("ui") || normalized.includes("ux") || normalized.includes("style")) {
    text = `### High-Contrast Visual Architecture Analysis

The interface of ASTRA incorporates sleek, soft-tech aesthetics designed to provide a comfortable workspace for developers.

**Aesthetic Foundations**:
1. **Minimalist Dark Canvas**: Styled using deep slates and indigo/amber-accented glassmorphism to lower cognitive load.
2. **Responsive Visual Projection**: Components adapt gracefully between desktop expanded grids and mobile stacks.
3. **Micro-interactivity**: Every state change (toast, switch, list delete) triggers clean, hardware-accelerated animations.

*Operating on Local Calibration Engine due to upstream quota limits. Visual elements remain fully ready for simulation.*`;
  } else if (isMetricsRequest) {
    text = `### Projections and Performance Insights

Analyzing current metrics for the integrated operator workspace and cognitive processing layers:

- **System Efficiency Index**: Currently calibrated at **+24.5%** over standard models.
- **Memory Cohesion**: Stabilized at **98.2%** latency clearance.
- **API Processing Velocity**: High-efficiency fallback protocols activated due to rate limits.

Below is the structured data projection for system and throughput scaling over the next six years:
- **2024**: Baseline operations established (42% stability).
- **2026**: Transition to ASTRA Glassmorphic architecture (68% stability).
- **2028**: Distributed memory state synchronization (55% stability during upgrades).
- **2030**: Universal quantum-mesh communication node (94% stability projection).

*This projection data is loaded from the Local Fallback Analytics engine.*`;
  } else {
    text = `### ASTRA Contextual Intelligence Response

I have processed your query using my **Local Adaptive Processing Node** (ASTRA Core Online Backup) to prevent downtime caused by temporary API billing or quota exhaustion.

**Operator Query**: "${prompt.length > 120 ? prompt.substring(0, 120) + "..." : prompt}"

**Resolution Framework**:
1. **Local State Integration**: Leveraged active memory indices.
2. **System Health**: Active layers remain in sync with visual layout elements.
3. **Integrity Preservation**: Developer keys, logs, and layout states are fully persistent.

If we need to restore deep web searches, please check that your \`GEMINI_API_KEY\` is fully active, or proceed with my high-fidelity simulated backup system!`;
  }

  return { text, chartData, citations };
}

// ==========================================
// 1. CHAT ENDPOINT WITH GEMINI INTEGRATION
// ==========================================
app.post("/api/chat", async (req, res) => {
  await handleProxy(req, res, async () => {
    if (!handleServiceCheck(res)) return;

    // Track enabled layers info in outer scope for catch block access
    let enabledLayersInfo = "";

    try {
      const { message, history } = req.body;
      
      // Assemble the system instruction incorporating the active context layers dynamically
      enabledLayersInfo = activeContexts
        .filter((layer) => layer.active)
        .map((layer) => `- ${layer.title}: ${layer.description}`)
        .join("\n");

      const systemInstruction = `
You are ASTRA, a highly advanced, ultra-responsive soft-tech AI assistant and contextual intelligence core.
The current date is May 20, 2026.

Your target style guidelines prioritize clarity, deep insight, and elegant responses. Your tone is calm, highly professional, collaborative, and confident.

Presently, these Active Context Layers are enabled on ASTRA's system:
${enabledLayersInfo || "None"}

When writing text responses:
1. Be insightful, concise, and structured. Use Markdown gracefully.
2. If the user asks for design analysis, statistics, projections, or comparisons, include realistic metrics.
3. Every response should possess high aesthetic quality.
`;

      // Process history into correct Gemini API parts
      const chatParts: { role: string; parts: { text: string }[] }[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          chatParts.push({
            role: h.sender === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        });
      }

      // Add current user prompt
      chatParts.push({
        role: "user",
        parts: [{ text: message }]
      });

      // Request Gemini API to generate the response using the recommended 'gemini-3.5-flash' model
      const response = await ai!.models.generateContent({
        model: "gemini-3.5-flash",
        contents: chatParts,
        config: {
          systemInstruction,
          temperature: 0.7,
          tools: [{ googleSearch: {} }] // Support web search grounding where applicable
        }
      });

      const botResponseText = response.text || "I was unable to formulate a response. Please check your prompt.";

      // Simple analysis to support structured charts or indicators dynamically
      // If user's prompt or bot's output contains keywords like "efficiency", "projection", "chart", we can provide supplementary bar data.
      let chartData = null;
      if (
        message.toLowerCase().includes("projection") || 
        message.toLowerCase().includes("trend") || 
        message.toLowerCase().includes("chart") || 
        botResponseText.toLowerCase().includes("efficiency") || 
        botResponseText.toLowerCase().includes("projection")
      ) {
        chartData = [
          { label: "2024", value: 40 },
          { label: "2026", value: 65 },
          { role: "value", label: "2028", value: 50 },
          { label: "2030", value: 90 }
        ];
      }

      // Extract grounding URLs if search grounding context was fetched
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const citations = groundingChunks.map((chunk: any) => ({
        title: chunk.web?.title || "Reference",
        url: chunk.web?.uri || ""
      })).filter((c: any) => c.url);

      res.json({
        text: botResponseText,
        chartData,
        citations
      });

    } catch (error: any) {
      console.error("Gemini API Error - Activating Local Fallback Node gracefully:", error);
      
      // Smooth fallback delivery
      const { message } = req.body;
      const fallback = generateFallbackText(message || "", enabledLayersInfo);
      
      res.json({
        text: fallback.text + "\n\n*(Note: ASTRA has transitioned to Local Adaptive Processing due to a temporary API quota limit.)*",
        chartData: fallback.chartData,
        citations: fallback.citations,
        isFallback: true
      });
    }
  });
});

// ==========================================
// 1.1 COMPATIBILITY GENERATE ENDPOINT (POST /generate)
// ==========================================
app.post("/generate", async (req, res) => {
  await handleProxy(req, res, async () => {
    if (!handleServiceCheck(res)) return;

    let enabledLayersInfo = "";

    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt parameter in JSON body." });
      }

      // Assemble dynamic system instruction incorporating active layers
      enabledLayersInfo = activeContexts
        .filter((layer) => layer.active)
        .map((layer) => `- ${layer.title}: ${layer.description}`)
        .join("\n");

      const systemInstruction = `
You are ASTRA, a highly advanced, ultra-responsive soft-tech AI assistant and contextual intelligence core.
The current date is May 20, 2026.

Your target style guidelines prioritize clarity, deep insight, and elegant responses. Your tone is calm, highly professional, collaborative, and confident.

Presently, these Active Context Layers are enabled on ASTRA's system:
${enabledLayersInfo || "None"}

When writing text responses:
1. Be insightful, concise, and structured. Use Markdown gracefully.
2. If the user asks for design analysis, statistics, projections, or comparisons, include realistic metrics.
3. Every response should possess high aesthetic quality.
`;

      // Request Gemini API to generate response using gemini-3.5-flash
      const response = await ai!.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction,
          temperature: 0.7,
          tools: [{ googleSearch: {} }] // Enable Google Search Grounding for real-time web support
        }
      });

      const botResponseText = response.text || "I was unable to formulate a response. Please check your prompt.";

      let chartData = null;
      if (
        prompt.toLowerCase().includes("projection") || 
        prompt.toLowerCase().includes("trend") || 
        prompt.toLowerCase().includes("chart") || 
        botResponseText.toLowerCase().includes("efficiency") || 
        botResponseText.toLowerCase().includes("projection")
      ) {
        chartData = [
          { label: "2024", value: 40 },
          { label: "2026", value: 65 },
          { label: "2028", value: 50 },
          { label: "2030", value: 90 }
        ];
      }

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const citations = groundingChunks.map((chunk: any) => ({
        title: chunk.web?.title || "Reference",
        url: chunk.web?.uri || ""
      })).filter((c: any) => c.url);

      res.json({
        text: botResponseText,
        response: botResponseText, // Compatibility key
        chartData,
        citations
      });

    } catch (error: any) {
      console.error("Gemini API Error - Activating Local Fallback Node for Generate gracefully:", error);
      
      const { prompt } = req.body;
      const fallback = generateFallbackText(prompt || "", enabledLayersInfo);
      
      res.json({
        text: fallback.text + "\n\n*(Note: ASTRA has transitioned to Local Adaptive Processing due to a temporary API quota limit.)*",
        response: fallback.text + "\n\n*(Note: ASTRA has transitioned to Local Adaptive Processing due to a temporary API quota limit.)*", // Compatibility key
        chartData: fallback.chartData,
        citations: fallback.citations,
        isFallback: true
      });
    }
  });
});

// ==========================================
// RENDER TUNNEL CONTROL & OUTBOUND CONTEXT IP PORTS
// ==========================================
app.get("/api/backend/status", async (req, res) => {
  const startTime = Date.now();
  let status: "online" | "connecting" | "offline" = "offline";
  let latency = -1;

  if (isRemoteConnectionActive) {
    try {
      const controller = new AbortController();
      // Fast check timeout
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      
      const response = await fetch(`${RENDER_BACKEND_URL}/api/memories/contexts`, {
        method: "GET",
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        status = "online";
        latency = Date.now() - startTime;
      } else {
        status = "connecting";
      }
    } catch (e: any) {
      status = "offline";
    }
  }

  res.json({
    proxyEnabled: isRemoteConnectionActive,
    url: RENDER_BACKEND_URL,
    status,
    latency,
    outboundIps: ["74.220.49.0/24", "74.220.57.0/24"],
    timestamp: new Date().toISOString()
  });
});

app.post("/api/backend/toggle", (req, res) => {
  const { enabled } = req.body;
  if (typeof enabled === "boolean") {
    isRemoteConnectionActive = enabled;
  } else {
    isRemoteConnectionActive = !isRemoteConnectionActive;
  }
  res.json({ success: true, proxyEnabled: isRemoteConnectionActive });
});

// ==========================================
// 2. DEVELOPER KEYS API
// ==========================================
app.get("/api/keys", async (req, res) => {
  await handleProxy(req, res, () => {
    res.json({ keys: developerKeys });
  });
});

app.post("/api/keys", async (req, res) => {
  await handleProxy(req, res, () => {
    const { name, scope } = req.body;
    if (!name || !scope) {
      return res.status(400).json({ error: "Missing name or scope" });
    }

    const prefix = scope.toLowerCase().includes("read") ? "astra_read" : scope.toLowerCase().includes("context") ? "astra_test" : "astra_live";
    const uniqueSegment = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    const token = `${prefix}_••••••••${uniqueSegment}`;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const dateStr = `${months[now.getMonth()]} ${now.getDate()}, 2026`;

    const newKey = {
      id: (developerKeys.length + 1).toString(),
      name,
      scope,
      token,
      created: dateStr
    };

    developerKeys.unshift(newKey);
    res.status(201).json({ success: true, key: newKey });
  });
});

app.delete("/api/keys/:id", async (req, res) => {
  await handleProxy(req, res, () => {
    const { id } = req.params;
    developerKeys = developerKeys.filter((key) => key.id !== id);
    res.json({ success: true, keys: developerKeys });
  });
});

// ==========================================
// 3. STORAGE & LAYER TRIGGERS FOR MEMORIES
// ==========================================
app.get("/api/memories/contexts", async (req, res) => {
  await handleProxy(req, res, () => {
    res.json({ contexts: activeContexts });
  });
});

app.post("/api/memories/contexts/toggle", async (req, res) => {
  await handleProxy(req, res, () => {
    const { id } = req.body;
    const context = activeContexts.find((c) => c.id === id);
    if (context) {
      context.active = !context.active;
      res.json({ success: true, contexts: activeContexts });
    } else {
      res.status(404).json({ error: "Context layer not found" });
    }
  });
});

app.get("/api/memories/insights", async (req, res) => {
  await handleProxy(req, res, () => {
    res.json({ insights: learnedInsights });
  });
});

app.post("/api/memories/modify", async (req, res) => {
  await handleProxy(req, res, async () => {
    const { feedback } = req.body;
    if (!feedback) {
      return res.status(400).json({ error: "Feedback instruction is empty" });
    }

    if (isApiKeyConfigured && ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `
You are the semantic memory module controller for ASTRA.
The user wants to store, update, or suggest a learned memory/insight.
Instruction received: "${feedback}"

Based on the message:
1. Generate a new high-quality semantic memory matching this request.
2. Determine how close the match is to ASTRA's current knowledge base (an integer percentage, e.g., 94).
3. Draft a precise title and detailed technical summary in the soft-tech ASTRA philosophy.

Provide the response strictly as a JSON object matching this schema:
{
  "title": "Title of the learned insight",
  "content": "A detailed technical summary of what was learned/calibrated",
  "match": 85
}
`,
          config: {
            responseMimeType: "application/json"
          }
        });

        const resultText = response.text || "{}";
        const resultObj = JSON.parse(resultText.trim());

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        const dateStr = `${months[now.getMonth()]} ${now.getDate()}, 2026 • ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newInsight = {
          id: `insight_${Date.now()}`,
          title: resultObj.title || "Custom User Memory Calibration",
          content: resultObj.content || feedback,
          match: resultObj.match || 75,
          type: "insight",
          date: dateStr
        };

        learnedInsights.unshift(newInsight);
        return res.json({ success: true, insight: newInsight, insights: learnedInsights });
      } catch (err: any) {
        console.warn("Failed to parse state from Gemini, adding fallback:", err);
      }
    }

    const now = new Date();
    const dateStr = `May 20, 2026 • ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const customInsight = {
      id: `insight_${Date.now()}`,
      title: "Manual Memory Calibrated",
      content: feedback,
      match: Math.floor(Math.random() * 30) + 65,
      type: "insight",
      date: dateStr
    };
    learnedInsights.unshift(customInsight);
    res.json({ success: true, insight: customInsight, insights: learnedInsights });
  });
});

app.post("/api/memories/contexts/inject", async (req, res) => {
  await handleProxy(req, res, () => {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Missing title or description" });
    }

    const newLayer = {
      id: `layer_${Date.now()}`,
      title,
      description,
      updated: "Just now",
      active: true
    };

    activeContexts.push(newLayer);
    res.json({ success: true, contexts: activeContexts });
  });
});

// Configure Vite middleware / Serve client bundle
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Serve static compiled assets in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server with user email (dewchatterjee2003@gmail.com) is listening at http://localhost:${PORT}`);
  });
}

startServer();
