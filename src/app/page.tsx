"use client";
import { useState } from "react";

interface HistoryEntry {
  inputs: Record<string, string>;
  output: string;
}

const NEGOTIATION_TYPES = [
  "Salary Negotiation",
  "Business Deal",
  "Car Buying",
  "Real Estate",
  "Freelance Contract",
  "Partnership Agreement",
  "Merger & Acquisition",
  "Vendor Contract",
  " licensing Deal",
  "Custom (describe below)",
];

export default function Home() {
  const [negotiationType, setNegotiationType] = useState("");
  const [yourLeverage, setYourLeverage] = useState("");
  const [theirLeverage, setTheirLeverage] = useState("");
  const [walkAway, setWalkAway] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [concerns, setConcerns] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");

  const inputs = { negotiationType, yourLeverage, theirLeverage, walkAway, timeframe, desiredOutcome, concerns };

  const handleGenerate = async () => {
    if (!negotiationType.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      const output = data.result || "Error generating content.";
      setResult(output);
      setHistory((prev) => [{ inputs, output }, ...prev]);
      setActiveTab("form");
    } catch {
      setResult("Error generating content. Please try again.");
    }
    setLoading(false);
  };

  const isFormEmpty = !negotiationType.trim();

  return (
    <div style={{ minHeight: "100vh", padding: "24px", maxWidth: "860px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 44,
            height: 44,
            background: "linear-gradient(135deg, #d97706 0%, #92400e 100%)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            boxShadow: "0 4px 14px rgba(217, 119, 6, 0.35)",
          }}>
            🤝
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
              AI Negotiation Playbook
            </h1>
          </div>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
          Enter your negotiation details below — get a full preparation strategy powered by DeepSeek.
        </p>
      </div>

      {/* Glow divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #d97706, transparent)", opacity: 0.35, marginBottom: 24 }} />

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {(["form", "history"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              background: activeTab === tab ? "var(--primary)" : "var(--surface)",
              color: activeTab === tab ? "white" : "var(--text-muted)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tab === "form" ? "📋 New Playbook" : `📜 History (${history.length})`}
          </button>
        ))}
      </div>

      {/* FORM */}
      {activeTab === "form" && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            {/* Negotiation Type */}
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="negotiationType">Negotiation Type *</label>
              <select
                id="negotiationType"
                value={negotiationType}
                onChange={(e) => setNegotiationType(e.target.value)}
              >
                <option value="">— Select type —</option>
                {NEGOTIATION_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {/* Your Leverage */}
              <div>
                <label htmlFor="yourLeverage">Your Leverage</label>
                <textarea
                  id="yourLeverage"
                  value={yourLeverage}
                  onChange={(e) => setYourLeverage(e.target.value)}
                  placeholder="e.g. competing offer, unique skills, time pressure..."
                  rows={3}
                />
              </div>
              {/* Their Leverage */}
              <div>
                <label htmlFor="theirLeverage">Their Leverage</label>
                <textarea
                  id="theirLeverage"
                  value={theirLeverage}
                  onChange={(e) => setTheirLeverage(e.target.value)}
                  placeholder="e.g. they need this deal, limited alternatives..."
                  rows={3}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {/* Walk-Away Position */}
              <div>
                <label htmlFor="walkAway">Your Walk-Away Position</label>
                <textarea
                  id="walkAway"
                  value={walkAway}
                  onChange={(e) => setWalkAway(e.target.value)}
                  placeholder="The minimum you will accept before walking away..."
                  rows={3}
                />
              </div>
              {/* Timeframe */}
              <div>
                <label htmlFor="timeframe">Timeframe</label>
                <textarea
                  id="timeframe"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  placeholder="e.g. offer due in 3 days, closing Friday, 1-week window..."
                  rows={3}
                />
              </div>
            </div>

            {/* Desired Outcome */}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="desiredOutcome">Desired Outcome</label>
              <textarea
                id="desiredOutcome"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                placeholder="What does the ideal outcome look like for you?"
                rows={2}
              />
            </div>

            {/* Concerns/Fears */}
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="concerns">Concerns / Fears</label>
              <textarea
                id="concerns"
                value={concerns}
                onChange={(e) => setConcerns(e.target.value)}
                placeholder="What are you most worried about going into this negotiation?"
                rows={2}
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleGenerate}
              disabled={loading || isFormEmpty}
              style={{ width: "100%", padding: "13px 20px", fontSize: 15 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Building Your Playbook...
                </span>
              ) : "🎯 Generate My Negotiation Playbook"}
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="card" style={{ marginBottom: 20, whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>🎯</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: "var(--primary-light)" }}>Your Playbook</span>
          </div>
          <div style={{ color: "var(--text-muted)" }}>{result}</div>
        </div>
      )}

      {/* HISTORY */}
      {activeTab === "history" && (
        <div>
          {history.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <p style={{ margin: 0, fontSize: 14 }}>No playbooks generated yet. Start by filling out the form.</p>
            </div>
          ) : (
            history.map((entry, i) => (
              <div key={i} className="card" style={{ marginBottom: 14 }}>
                <details style={{ cursor: "pointer" }}>
                  <summary style={{ fontWeight: 700, fontSize: 13, color: "var(--primary-light)", padding: "4px 0", listStyle: "none" }}>
                    {entry.inputs.negotiationType || "Negotiation"} — {new Date().toLocaleDateString()}
                  </summary>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>INPUT DETAILS</div>
                    {Object.entries(entry.inputs).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)" }}>{k}:</span>{" "}
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>PLAYBOOK</div>
                      <pre style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 13, color: "var(--text-muted)", fontFamily: "inherit" }}>{entry.output}</pre>
                    </div>
                  </div>
                </details>
              </div>
            ))
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
