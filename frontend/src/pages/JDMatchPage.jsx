import { useState } from "react";
import { matchJD } from "../utils/api";
import { SAMPLE_JDS } from "../data/dummyData";

function ScoreBar({ label, score, weight, color }) {
  return (
    <div className="stat-row">
      <div style={{ width: "140px", fontSize: "0.82rem" }}>{label}</div>
      <div className="stat-bar">
        <div
          className="stat-fill"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color || "var(--accent)"}, ${color ? color + "99" : "var(--accent2)"})`,
          }}
        />
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", width: "40px", textAlign: "right", color: "var(--text)" }}>
        {score}%
      </div>
      <div style={{ fontSize: "0.72rem", color: "var(--text3)", width: "50px", textAlign: "right" }}>w:{weight}%</div>
    </div>
  );
}

function DonutChart({ score }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--bg4)" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s ease", filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color }}>{score}</div>
        <div style={{ fontSize: "0.68rem", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>/100</div>
      </div>
    </div>
  );
}

export default function JDMatchPage({ sessionData, updateSession, addLog, addToast, onNext }) {
  const [loading, setLoading] = useState(false);
  const [selectedJD, setSelectedJD] = useState(sessionData.selectedJD || null);
  const [customJD, setCustomJD] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const jdText = useCustom ? customJD : selectedJD?.description || "";

  const handleMatch = async () => {
    if (!jdText) { addToast("Please select or enter a JD first", "warn"); return; }
    setLoading(true);
    updateSession("selectedJD", useCustom ? { title: "Custom JD", description: customJD } : selectedJD);
    addLog("JD Matcher", "Starting candidate-JD matching analysis...", "info");
    try {
      const result = await matchJD(
        sessionData.parsedResume,
        jdText,
        (msg) => { addLog("JD Matcher", msg, "warn"); addToast(msg, "warn"); }
      );
      updateSession("jdMatch", result);
      addLog("JD Matcher", `✅ Match complete: ${result.overall_score}/100 — ${result.verdict}`, "success");
      addToast(`JD Match: ${result.overall_score}/100 (${result.verdict})`, "success");
    } catch (e) {
      addToast("Matching failed", "error");
    }
    setLoading(false);
  };

  const m = sessionData.jdMatch;

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="agent-label">🎯 JD Matcher Agent</div>
        <div className="page-title">Job Description Matching</div>
        <div className="page-sub">Compare the candidate's resume against a job description to generate a relevance score and analysis.</div>
      </div>

      {/* JD Selection */}
      {!m && (
        <>
          <div className="card mb-16">
            <div className="section-header mb-16">
              <span className="section-title">Select Job Description</span>
            </div>
            <div className="card-grid card-grid-3 mb-16">
              {SAMPLE_JDS.map((jd) => (
                <div
                  key={jd.id}
                  className={`jd-card ${selectedJD?.id === jd.id && !useCustom ? "selected" : ""}`}
                  onClick={() => { setSelectedJD(jd); setUseCustom(false); }}
                >
                  <div className="jd-company">{jd.company}</div>
                  <div className="jd-title">{jd.title}</div>
                  <div className="jd-desc">{jd.description}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>or paste custom JD</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            </div>

            <textarea
              value={customJD}
              onChange={(e) => { setCustomJD(e.target.value); setUseCustom(!!e.target.value); }}
              placeholder="Paste your job description here..."
              style={{
                width: "100%", background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: "10px", padding: "14px", color: "var(--text)", fontSize: "0.85rem",
                fontFamily: "var(--font-body)", resize: "vertical", minHeight: "100px",
                outline: "none", transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {(selectedJD || customJD) && (
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn btn-primary" onClick={handleMatch} disabled={loading}>
                {loading ? "⏳ Matching..." : "🎯 Run JD Matcher Agent"}
              </button>
            </div>
          )}

          {loading && (
            <div className="loader-wrap card" style={{ marginTop: "16px" }}>
              <div className="spinner" />
              <div className="loading-text">JD Matcher Agent analyzing fit...</div>
            </div>
          )}
        </>
      )}

      {/* Results */}
      {m && (
        <div className="fade-up">
          {/* Score Overview */}
          <div className="card mb-16" style={{ background: "linear-gradient(135deg, var(--bg2), var(--bg3))" }}>
            <div className="flex gap-24 items-center" style={{ flexWrap: "wrap" }}>
              <DonutChart score={m.overall_score} />
              <div style={{ flex: 1 }}>
                <div className="text-muted text-sm mb-4" style={{ fontFamily: "var(--font-mono)" }}>Overall Match Score</div>
                <div className="match-verdict" style={{ color: m.verdict_color || "var(--success)", marginBottom: "8px" }}>
                  {m.verdict}
                </div>
                <div className="text-sm text-muted" style={{ maxWidth: "420px" }}>{m.recommendation}</div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="card mb-16 fade-up-d1">
            <div className="section-header"><span className="section-title">📊 Score Breakdown</span></div>
            {m.breakdown.map((b, i) => (
              <ScoreBar key={i} label={b.category} score={b.score} weight={b.weight} color={["var(--accent)", "var(--accent2)", "var(--accent3)", "var(--accent4)"][i]} />
            ))}
          </div>

          {/* Skills */}
          <div className="card-grid card-grid-2 mb-16 fade-up-d2">
            <div className="card">
              <div className="section-header"><span className="section-title">✅ Matching Skills</span></div>
              <div className="tag-list">
                {m.matching_skills.map((s) => <span key={s} className="tag tag-green">{s}</span>)}
              </div>
            </div>
            <div className="card">
              <div className="section-header"><span className="section-title">⚠️ Skill Gaps</span></div>
              <div className="tag-list">
                {m.missing_skills.map((s) => <span key={s} className="tag tag-red">{s}</span>)}
              </div>
            </div>
          </div>

          {/* Strengths & Gaps */}
          <div className="card-grid card-grid-2 mb-24 fade-up-d3">
            <div className="card">
              <div className="section-header"><span className="section-title">💪 Strengths</span></div>
              {m.strengths.map((s, i) => (
                <div key={i} className="flex gap-8 mb-8">
                  <span style={{ color: "var(--success)" }}>+</span>
                  <span className="text-sm">{s}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="section-header"><span className="section-title">📉 Gaps</span></div>
              {m.gaps.map((g, i) => (
                <div key={i} className="flex gap-8 mb-8">
                  <span style={{ color: "var(--error)" }}>−</span>
                  <span className="text-sm">{g}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-12">
            <button className="btn btn-secondary" onClick={() => updateSession("jdMatch", null)}>
              ↩ Re-match
            </button>
            <button className="btn btn-primary" onClick={onNext}>
              Continue → Generate Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
