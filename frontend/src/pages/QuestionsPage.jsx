import { useState } from "react";
import { generateQuestions } from "../utils/api";

function QuestionCard({ q, index, type }) {
  const [expanded, setExpanded] = useState(false);
  const diffClass = q.difficulty === "Hard" ? "diff-hard" : q.difficulty === "Medium" ? "diff-medium" : "diff-easy";

  return (
    <div className={`question-card ${type === "behavioral" ? "behavioral" : ""}`}
      style={{ cursor: "pointer", animationDelay: `${index * 0.05}s` }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="q-number">{type.toUpperCase()} — Q{index + 1}</div>
      <div className="q-text">{q.question}</div>
      <div className="q-meta">
        <span className="tag tag-blue" style={{ fontSize: "0.7rem" }}>{q.category}</span>
        {q.difficulty && <span className={diffClass}>{q.difficulty}</span>}
        {q.framework && <span className="tag tag-orange" style={{ fontSize: "0.7rem" }}>{q.framework}</span>}
      </div>
      {expanded && q.why && (
        <div className="q-why" style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--border)" }}>
          💡 <strong>Why this question:</strong> {q.why}
        </div>
      )}
      <div style={{ fontSize: "0.68rem", color: "var(--text3)", marginTop: "6px" }}>
        {expanded ? "▲ hide rationale" : "▼ show rationale"}
      </div>
    </div>
  );
}

export default function QuestionsPage({ sessionData, updateSession, addLog, addToast, onNext }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("technical");

  const handleGenerate = async () => {
    setLoading(true);
    addLog("Q-Gen Agent", "Generating personalized interview questions...", "info");
    try {
      const result = await generateQuestions(
        sessionData.parsedResume,
        sessionData.selectedJD?.description || "",
        sessionData.jdMatch,
        (msg) => { addLog("Q-Gen Agent", msg, "warn"); addToast(msg, "warn"); }
      );
      updateSession("questions", result);
      const total = result.technical.length + result.behavioral.length;
      addLog("Q-Gen Agent", `✅ Generated ${total} questions (${result.technical.length} technical, ${result.behavioral.length} behavioral)`, "success");
      addToast(`${total} personalized interview questions generated!`, "success");
    } catch (e) {
      addToast("Question generation failed", "error");
    }
    setLoading(false);
  };

  const q = sessionData.questions;

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="agent-label">💬 Q-Gen Agent</div>
        <div className="page-title">Interview Questions</div>
        <div className="page-sub">Generate personalized technical and behavioral questions tailored to the candidate and role.</div>
      </div>

      {!q && !loading && (
        <div className="card" style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>💬</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
            Ready to Generate Questions
          </div>
          <div className="text-muted text-sm mb-24" style={{ maxWidth: "400px", margin: "0 auto 24px" }}>
            The Q-Gen Agent will analyze the parsed resume and JD match to create
            highly specific, personalized interview questions.
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
            {[
              { icon: "🧠", label: "Role-specific technical questions" },
              { icon: "📋", label: "STAR behavioral questions" },
              { icon: "🎯", label: "Tailored to candidate's background" },
              { icon: "💡", label: "Rationale for each question" },
            ].map((f) => (
              <div key={f.label} className="card-sm flex gap-8 items-center" style={{ fontSize: "0.8rem" }}>
                <span>{f.icon}</span><span>{f.label}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={handleGenerate}>
            🚀 Run Q-Gen Agent
          </button>
        </div>
      )}

      {loading && (
        <div className="loader-wrap card">
          <div className="spinner" />
          <div className="loading-text">Q-Gen Agent crafting personalized questions...</div>
          <div className="text-muted text-xs">Analyzing resume context and JD requirements...</div>
        </div>
      )}

      {q && (
        <div className="fade-up">
          {/* Stats Row */}
          <div className="card-grid card-grid-3 mb-24">
            {[
              { label: "Technical Questions", value: q.technical.length, color: "var(--accent)", icon: "⚡" },
              { label: "Behavioral Questions", value: q.behavioral.length, color: "var(--accent2)", icon: "🗣" },
              { label: "Total Questions", value: q.technical.length + q.behavioral.length, color: "var(--accent3)", icon: "📋" },
            ].map((s) => (
              <div key={s.label} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "6px" }}>{s.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                <div className="text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            {["technical", "behavioral"].map((tab) => (
              <button
                key={tab}
                className={`btn ${activeTab === tab ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setActiveTab(tab)}
                style={{ textTransform: "capitalize" }}
              >
                {tab === "technical" ? "⚡" : "🗣"} {tab} ({q[tab].length})
              </button>
            ))}
          </div>

          {/* Questions List */}
          <div className="mb-24">
            {q[activeTab].map((question, i) => (
              <QuestionCard key={question.id} q={question} index={i} type={activeTab} />
            ))}
          </div>

          {/* Export Hint */}
          <div className="card-sm mb-24" style={{ borderColor: "rgba(0,229,195,0.3)", background: "rgba(0,229,195,0.05)" }}>
            <div className="flex gap-8 items-center" style={{ fontSize: "0.83rem" }}>
              <span>📥</span>
              <span style={{ color: "var(--accent3)" }}>Tip: Right-click to copy individual questions, or proceed to the Evaluator to get quality ratings.</span>
            </div>
          </div>

          <div className="flex gap-12">
            <button className="btn btn-secondary" onClick={() => updateSession("questions", null)}>
              ↩ Regenerate
            </button>
            <button className="btn btn-primary" onClick={onNext}>
              Continue → Evaluate Output
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
