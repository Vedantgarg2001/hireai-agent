import { useState, useEffect } from "react";

export default function Header({ memoryOpen, setMemoryOpen, logCount }) {
  const [mode, setMode] = useState("checking");

  useEffect(() => {
    fetch("http://hireai-agent.onrender.com/health")
      .then((r) => r.json())
      .then((d) => setMode(d.mode === "live" ? "live" : "demo"))
      .catch(() => setMode("offline"));
  }, []);

  const modeConfig = {
    checking: { label: "Connecting...",          color: "var(--text3)" },
    live:     { label: "Live AI Mode",           color: "var(--success)" },
    demo:     { label: "Demo Mode Active",       color: "var(--accent4)" },
    offline:  { label: "Backend Offline",        color: "var(--error)" },
  };
  const cfg = modeConfig[mode] || modeConfig.offline;

  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon">🤖</div>
        <span className="logo-text">
          <span>Hire</span>AI{" "}
          <span style={{ color: "var(--text2)", fontWeight: 400 }}>Agent</span>
        </span>
      </div>

      <div className="header-actions">
        <div className="badge" style={{ borderColor: cfg.color, color: cfg.color }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
          {cfg.label}
        </div>
        <div className="badge">v1.0.0</div>
        <button className="btn-ghost" onClick={() => setMemoryOpen(!memoryOpen)}>
          🧠 Agent Memory
          {logCount > 0 && (
            <span style={{ background: "var(--accent)", color: "#fff", borderRadius: "99px", padding: "1px 7px", fontSize: "0.68rem", fontFamily: "var(--font-mono)" }}>
              {logCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}