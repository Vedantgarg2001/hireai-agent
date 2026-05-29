import { useState } from "react";
import { parseResume } from "../utils/api";

export default function ParsedResumePage({ sessionData, updateSession, addLog, addToast, onNext }) {
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!sessionData.resumeFile) return;
    setLoading(true);
    addLog("Resume Extractor", "Initiating resume parsing...", "info");
    try {
      const result = await parseResume(
        sessionData.resumeFile,
        (msg) => { addLog("Resume Extractor", msg, "warn"); addToast(msg, "warn"); }
      );
      updateSession("parsedResume", result);
      addLog("Resume Extractor", `✅ Parsed: ${result.skills.technical.length} skills, ${result.experience.length} experiences, ${result.education.length} education entries`, "success");
      addToast("Resume parsed successfully!", "success");
    } catch (e) {
      addToast("Error parsing resume", "error");
    }
    setLoading(false);
  };

  const r = sessionData.parsedResume;

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="agent-label">🔍 Resume Extractor Agent</div>
        <div className="page-title">Parse Resume</div>
        <div className="page-sub">Extract structured data from the uploaded resume using the AI parsing agent.</div>
      </div>

      {!r && !loading && (
        <div className="card" style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
            Ready to Parse
          </div>
          <div className="text-muted text-sm mb-24">
            File: <span style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}>{sessionData.resumeFile?.name}</span>
          </div>
          <button className="btn btn-primary" onClick={handleParse}>
            🚀 Run Resume Extractor Agent
          </button>
        </div>
      )}

      {loading && (
        <div className="loader-wrap card">
          <div className="spinner" />
          <div className="loading-text">Resume Extractor Agent is working...</div>
          <div className="text-muted text-xs">Extracting skills, experience, education...</div>
        </div>
      )}

      {r && (
        <div className="fade-up">
          {/* Header Card */}
          <div className="card mb-16" style={{ background: "linear-gradient(135deg, var(--bg2), var(--bg3))", display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", flexShrink: 0 }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800 }}>{r.name}</div>
              <div className="text-sm text-muted" style={{ fontFamily: "var(--font-mono)" }}>{r.email} · {r.phone} · {r.location}</div>
            </div>
            <div className="tag tag-green">✅ Parsed</div>
          </div>

          {/* Summary */}
          <div className="card mb-16 fade-up-d1">
            <div className="section-header"><span className="section-title">📝 Summary</span></div>
            <p className="text-sm" style={{ lineHeight: 1.7, color: "var(--text2)" }}>{r.summary}</p>
          </div>

          {/* Skills */}
          <div className="card mb-16 fade-up-d1">
            <div className="section-header"><span className="section-title">⚡ Technical Skills</span></div>
            <div className="tag-list mb-12">
              {r.skills.technical.map((s) => <span key={s} className="tag tag-blue">{s}</span>)}
            </div>
            <div className="section-header" style={{ marginTop: "16px" }}><span style={{ fontWeight: 600, fontSize: "0.9rem" }}>🤝 Soft Skills</span></div>
            <div className="tag-list">
              {r.skills.soft.map((s) => <span key={s} className="tag tag-orange">{s}</span>)}
            </div>
          </div>

          {/* Experience */}
          <div className="card mb-16 fade-up-d2">
            <div className="section-header"><span className="section-title">💼 Experience</span></div>
            {r.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: i < r.experience.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div className="flex justify-between items-center mb-4">
                  <div style={{ fontWeight: 600 }}>{exp.role}</div>
                  <div className="tag tag-cyan" style={{ fontSize: "0.7rem" }}>{exp.duration}</div>
                </div>
                <div className="text-sm text-muted mb-8" style={{ fontFamily: "var(--font-mono)" }}>{exp.company}</div>
                <ul style={{ paddingLeft: "16px" }}>
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="text-sm" style={{ color: "var(--text2)", marginBottom: "4px" }}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education & Certs */}
          <div className="card-grid card-grid-2 mb-24 fade-up-d3">
            <div className="card">
              <div className="section-header"><span className="section-title">🎓 Education</span></div>
              {r.education.map((e, i) => (
                <div key={i} style={{ marginBottom: "12px" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{e.degree}</div>
                  <div className="text-sm text-muted">{e.institution} · {e.year}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="section-header"><span className="section-title">🏅 Certifications</span></div>
              {r.certifications.map((c, i) => (
                <div key={i} className="flex gap-8 items-center mb-8">
                  <span style={{ color: "var(--accent4)" }}>★</span>
                  <span className="text-sm">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-12">
            <button className="btn btn-secondary" onClick={() => updateSession("parsedResume", null)}>
              ↩ Re-parse
            </button>
            <button className="btn btn-primary" onClick={onNext}>
              Continue → JD Matching
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
