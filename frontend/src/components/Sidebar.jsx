export default function Sidebar({ steps, activeStep, setActiveStep, sessionData }) {
  const isStepUnlocked = (stepId) => {
    if (stepId === 0) return true;
    if (stepId === 1) return !!sessionData.resumeFile;
    if (stepId === 2) return !!sessionData.parsedResume;
    if (stepId === 3) return !!sessionData.jdMatch;
    if (stepId === 4) return !!sessionData.questions;
    return false;
  };

  const isStepDone = (stepId) => {
    if (stepId === 0) return !!sessionData.resumeFile;
    if (stepId === 1) return !!sessionData.parsedResume;
    if (stepId === 2) return !!sessionData.jdMatch;
    if (stepId === 3) return !!sessionData.questions;
    if (stepId === 4) return !!sessionData.evaluation;
    return false;
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Workflow</div>
        {steps.map((step) => {
          const unlocked = isStepUnlocked(step.id);
          const done = isStepDone(step.id);
          const active = activeStep === step.id;
          return (
            <button
              key={step.id}
              className={`step-btn ${active ? "active" : ""} ${done ? "done" : ""}`}
              onClick={() => unlocked && setActiveStep(step.id)}
              style={{ opacity: unlocked ? 1 : 0.4, cursor: unlocked ? "pointer" : "not-allowed" }}
            >
              <span className="step-icon">{done ? "✓" : step.icon}</span>
              <span>{step.label}</span>
              <span className="step-num">{step.id + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-section" style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
        <div className="sidebar-label">Agents</div>
        {[
          { name: "Resume Extractor", status: sessionData.parsedResume ? "done" : "idle" },
          { name: "JD Matcher", status: sessionData.jdMatch ? "done" : "idle" },
          { name: "Q-Gen Agent", status: sessionData.questions ? "done" : "idle" },
          { name: "Evaluator", status: sessionData.evaluation ? "done" : "idle" },
        ].map((a) => (
          <div
            key={a.name}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "6px 4px",
              fontSize: "0.78rem",
              color: a.status === "done" ? "var(--success)" : "var(--text3)",
            }}
          >
            <span>{a.name}</span>
            <span
              style={{
                width: 8, height: 8, borderRadius: "50%",
                background: a.status === "done" ? "var(--success)" : "var(--bg4)",
              }}
            />
          </div>
        ))}
      </div>
    </nav>
  );
}
