import { useState } from "react";
import { evaluateOutput } from "../utils/api";

function StarRating({ score }) {
  const full = Math.floor(score);
  const half = score - full >= 0.5;
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`star ${n <= full ? "" : "empty"}`}>
          {n <= full ? "★" : half && n === full + 1 ? "⯨" : "☆"}
        </span>
      ))}
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text2)", marginLeft: "6px" }}>
        {score.toFixed(1)}/5.0
      </span>
    </div>
  );
}

function ManualRatingTable({ sessionData }) {
  // Build rows dynamically from actual session data
  const candidateName = sessionData.parsedResume?.name || "Uploaded Candidate";
  const jdTitle = sessionData.selectedJD?.title || "Selected Job Description";

  const [ratings, setRatings] = useState([
    { resume: candidateName, jd: jdTitle, parseAccuracy: 4, matchRelevance: 4, questionQuality: 4 },
    { resume: "Arjun Sharma (Sample)", jd: "Senior Full Stack Engineer", parseAccuracy: 5, matchRelevance: 4, questionQuality: 5 },
    { resume: "Priya Patel (Sample)", jd: "Data Scientist", parseAccuracy: 4, matchRelevance: 5, questionQuality: 4 },
  ]);

  const update = (idx, field, val) => {
    setRatings((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  };

  const RatingCell = ({ val, onChange }) => (
    <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: n <= val ? "var(--accent4)" : "var(--bg4)",
            fontSize: "1.1rem",
          }}
        >★</button>
      ))}
    </div>
  );

  return (
    <div className="card mb-16">
      <div className="section-header">
        <span className="section-title">📋 Manual Output Review (Required)</span>
        <span className="tag tag-orange">Evaluation Checklist</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Candidate", "Job Description", "Parse Accuracy (1-5)", "JD Match Relevance (1-5)", "Question Quality (1-5)"].map((h) => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text2)", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ratings.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i === 0 ? "rgba(109,90,255,0.05)" : "transparent" }}>
                <td style={{ padding: "10px 12px", fontWeight: i === 0 ? 600 : 400 }}>
                  {row.resume}
                  {i === 0 && <span className="tag tag-blue" style={{ marginLeft: "8px", fontSize: "0.65rem" }}>Current</span>}
                </td>
                <td style={{ padding: "10px 12px", color: "var(--text2)" }}>{row.jd}</td>
                <td style={{ padding: "10px 12px" }}><RatingCell val={row.parseAccuracy} onChange={(v) => update(i, "parseAccuracy", v)} /></td>
                <td style={{ padding: "10px 12px" }}><RatingCell val={row.matchRelevance} onChange={(v) => update(i, "matchRelevance", v)} /></td>
                <td style={{ padding: "10px 12px" }}><RatingCell val={row.questionQuality} onChange={(v) => update(i, "questionQuality", v)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-muted" style={{ marginTop: "12px", fontFamily: "var(--font-mono)" }}>
        * First row shows your actual uploaded candidate. Click stars to adjust ratings.
      </div>
    </div>
  );
}

export default function EvaluatorPage({ sessionData, updateSession, addLog, addToast }) {
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async () => {
    setLoading(true);
    addLog("Evaluator Agent", "Running LLM-based output evaluation...", "info");
    try {
      const result = await evaluateOutput(
        sessionData.parsedResume,
        sessionData.selectedJD?.description || "",
        sessionData.questions,
        (msg) => { addLog("Evaluator", msg, "warn"); addToast(msg, "warn"); }
      );
      updateSession("evaluation", result);
      addLog("Evaluator Agent", `✅ Evaluation complete: Overall score ${result.overall}/5.0`, "success");
      addToast(`Evaluation complete — ${result.overall}/5.0 overall`, "success");
    } catch (e) {
      addToast("Evaluation failed", "error");
    }
    setLoading(false);
  };

  const e = sessionData.evaluation;
  const candidateName = sessionData.parsedResume?.name || "Candidate";

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="agent-label">📊 Evaluator Agent</div>
        <div className="page-title">Output Evaluation</div>
        <div className="page-sub">
          Reviewing outputs for <strong style={{ color: "var(--accent)" }}>{candidateName}</strong> — includes manual and LLM-based evaluation.
        </div>
      </div>

      {/* Manual Review Table */}
      <ManualRatingTable sessionData={sessionData} />

      {/* LLM Evaluator */}
      {!e && !loading && (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🤖</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
            LLM-Based Evaluation
          </div>
          <div className="text-muted text-sm mb-24" style={{ maxWidth: "360px", margin: "0 auto 24px" }}>
            Run the Evaluator Agent to get AI-powered ratings for <strong>{candidateName}</strong>'s interview questions.
          </div>
          <button className="btn btn-primary" onClick={handleEvaluate}>
            🚀 Run Evaluator Agent
          </button>
        </div>
      )}

      {loading && (
        <div className="loader-wrap card">
          <div className="spinner" />
          <div className="loading-text">Evaluator Agent reviewing outputs for {candidateName}...</div>
        </div>
      )}

      {e && (
        <div className="fade-up">
          {/* Score Cards */}
          <div className="card-grid card-grid-3 mb-16">
            {[
              { label: "Question Quality", score: e.question_quality, icon: "💬", color: "var(--accent)" },
              { label: "JD Alignment", score: e.jd_alignment, icon: "🎯", color: "var(--accent2)" },
              { label: "Diversity Score", score: e.diversity_score, icon: "🌈", color: "var(--accent3)" },
            ].map((s) => (
              <div key={s.label} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{s.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: s.color, marginBottom: "6px" }}>
                  {Number(s.score).toFixed(1)}
                </div>
                <StarRating score={Number(s.score)} />
                <div className="text-sm text-muted" style={{ marginTop: "6px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Overall Score */}
          <div className="card mb-16" style={{ background: "linear-gradient(135deg, rgba(109,90,255,0.12), var(--bg3))", textAlign: "center", padding: "32px" }}>
            <div className="text-muted text-sm mb-8">Overall Score for {candidateName}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "4rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>
              {Number(e.overall).toFixed(1)}
            </div>
            <div className="text-muted text-sm mb-12">out of 5.0</div>
            <StarRating score={Number(e.overall)} />
          </div>

          {/* Feedback */}
          <div className="card mb-24">
            <div className="section-header">
              <span className="section-title">💡 Evaluator Agent Feedback</span>
            </div>
            {e.feedback.map((f, i) => (
              <div key={i} className="flex gap-12 mb-12" style={{ padding: "10px 12px", background: "var(--bg3)", borderRadius: "8px" }}>
                <span style={{ color: "var(--accent)", fontSize: "1rem", flexShrink: 0 }}>→</span>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>

          {/* Completion Banner */}
          <div className="card" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.1), var(--bg3))", borderColor: "rgba(34,197,94,0.3)", textAlign: "center", padding: "32px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, color: "var(--success)", marginBottom: "8px" }}>
              Workflow Complete for {candidateName}!
            </div>
            <div className="text-muted text-sm" style={{ maxWidth: "440px", margin: "0 auto" }}>
              All 5 agents ran successfully. Resume parsed → JD matched → Questions generated → Output evaluated.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}