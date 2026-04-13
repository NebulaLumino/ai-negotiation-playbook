"use client";
import { useState } from "react";

type FormState = {
  negotiationType: string;
  yourLeverage: string;
  theirLeverage: string;
  walkAway: string;
  timeframe: string;
  desiredOutcome: string;
  concerns: string;
};

const NEGOTIATION_TYPES = [
  "Salary / Job Offer",
  "Business Deal / Partnership",
  "Car Buying / Leasing",
  "Real Estate / Home Purchase",
  "Contract Negotiation",
  "Freelance / Consulting Rate",
  "Investment / Funding Round",
  "Vendor / Supplier Agreement",
  "Merger / Acquisition",
  "Other",
];

const TIMEFRAMES = [
  "Immediate (today/tomorrow)",
  "This week",
  "This month",
  "1-3 months",
  "3-6 months",
  "6+ months",
  "No time pressure",
];

export default function Home() {
  const [form, setForm] = useState<FormState>({
    negotiationType: "",
    yourLeverage: "",
    theirLeverage: "",
    walkAway: "",
    timeframe: "",
    desiredOutcome: "",
    concerns: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<{ form: FormState; output: string }[]>([]);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const isValid = () =>
    form.negotiationType && form.desiredOutcome && form.yourLeverage;

  const handleGenerate = async () => {
    if (!isValid()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      const output = data.result || "Error generating playbook.";
      setResult(output);
      setHistory(prev => [{ form: { ...form }, output }, ...prev]);
    } catch {
      setResult("Error generating playbook. Please try again.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setForm({
      negotiationType: "",
      yourLeverage: "",
      theirLeverage: "",
      walkAway: "",
      timeframe: "",
      desiredOutcome: "",
      concerns: "",
    });
    setResult("");
  };

  return (
    <div style={{ minHeight: "100vh", padding: "24px", maxWidth: "860px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <div style={{
            width: 46, height: 46,
            background: "linear-gradient(135deg, #d97706, #92400e)",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
            boxShadow: "0 4px 14px rgba(217, 119, 6, 0.4)"
          }}>
            🤝
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.01em" }}>
              AI Negotiation Playbook
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 1 }}>
              DeepSeek-powered — prepare for any negotiation with confidence
            </p>
          </div>
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--primary), transparent)", opacity: 0.35 }} />
      </div>

      {/* Input Form */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span className="section-tag">Step 1</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Describe Your Negotiation</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Negotiation Type */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="negotiationType">Negotiation Type *</label>
            <select id="negotiationType" value={form.negotiationType} onChange={set("negotiationType")}>
              <option value="">Select a type...</option>
              {NEGOTIATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Your Leverage */}
          <div>
            <label htmlFor="yourLeverage">Your Leverage Factors *</label>
            <textarea id="yourLeverage" value={form.yourLeverage} onChange={set("yourLeverage")}
              placeholder="What advantages do you have? Skills, alternatives, urgency..." rows={3} />
          </div>

          {/* Their Leverage */}
          <div>
            <label htmlFor="theirLeverage">Their Leverage Factors</label>
            <textarea id="theirLeverage" value={form.theirLeverage} onChange={set("theirLeverage")}
              placeholder="What advantages do they have? What can they offer?" rows={3} />
          </div>

          {/* Walk-Away */}
          <div>
            <label htmlFor="walkAway">Your Walk-Away Position</label>
            <textarea id="walkAway" value={form.walkAway} onChange={set("walkAway")}
              placeholder="The point where you walk away. What's your BATNA?" rows={3} />
          </div>

          {/* Timeframe */}
          <div>
            <label htmlFor="timeframe">Timeframe</label>
            <select id="timeframe" value={form.timeframe} onChange={set("timeframe")}>
              <option value="">Select timeframe...</option>
              {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Desired Outcome */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="desiredOutcome">Desired Outcome *</label>
            <textarea id="desiredOutcome" value={form.desiredOutcome} onChange={set("desiredOutcome")}
              placeholder="What do you actually want to achieve? Be specific..." rows={2} />
          </div>

          {/* Concerns */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="concerns">Concerns & Fears</label>
            <textarea id="concerns" value={form.concerns} onChange={set("concerns")}
              placeholder="What's holding you back? What are you most worried about?" rows={2} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading || !isValid()}
            style={{ flex: 1, fontSize: 15, padding: "12px 20px" }}
          >
            {loading ? "⚡ Generating Playbook..." : "🎯 Generate Playbook"}
          </button>
          <button
            onClick={handleReset}
            style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", fontSize: 13, padding: "12px 16px" }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card" style={{ marginBottom: 20, textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>⚡</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--primary)", marginBottom: 6 }}>
            Building your negotiation playbook...
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Analyzing your scenario and generating strategy...
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span className="section-tag">Your Playbook</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Generated with DeepSeek</span>
          </div>
          <div style={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.75,
            fontSize: 13.5,
            color: "var(--text)"
          }}>
            {result}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span className="section-tag">History</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{history.length} playbook{history.length > 1 ? "s" : ""}</span>
          </div>
          {history.map((h, i) => (
            <div key={i} className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "var(--primary)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>
                {h.form.negotiationType || "Negotiation"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                {h.form.desiredOutcome.slice(0, 80)}{h.form.desiredOutcome.length > 80 ? "..." : ""}
              </div>
              <details>
                <summary style={{ fontSize: 12, color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>
                  View playbook →
                </summary>
                <div style={{ marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 12.5, color: "var(--text)" }}>
                  {h.output}
                </div>
              </details>
            </div>
          ))}
        </>
      )}
    </div>
  );
}