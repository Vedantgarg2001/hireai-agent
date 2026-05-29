import { useState, useRef, useCallback } from "react";
import { SAMPLE_RESUMES } from "../data/dummyData";

export default function UploadPage({ sessionData, updateSession, addLog, addToast, onNext }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file) return;
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|txt)$/i)) {
      addToast("Please upload a PDF, DOCX, or TXT file", "error");
      return;
    }
    updateSession("resumeFile", file);
    updateSession("resume", { name: file.name, size: file.size });
    addLog("Resume Extractor", `File received: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, "info");
    addToast(`File "${file.name}" uploaded successfully`, "success");
  }, [updateSession, addLog, addToast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const useSampleResume = (sample) => {
    const fakeFile = new File(["Sample resume content for " + sample.name], sample.filename, { type: "application/pdf" });
    updateSession("resumeFile", fakeFile);
    updateSession("resume", { name: sample.filename, size: fakeFile.size, isSample: true, candidateName: sample.name });
    addLog("Resume Extractor", `Sample resume loaded: ${sample.name}`, "info");
    addToast(`Sample resume for ${sample.name} loaded`, "success");
  };

  const file = sessionData.resumeFile;

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="agent-label">⬆ Step 1 of 5</div>
        <div className="page-title">Upload Resume</div>
        <div className="page-sub">Upload a candidate resume in PDF, DOCX, or TXT format to begin the screening workflow.</div>
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current.click()}
      >
        <input
          ref={inputRef}
          className="upload-input"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <>
            <div className="upload-icon" style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)" }}>📄</div>
            <div className="upload-title" style={{ color: "var(--success)" }}>File Ready</div>
            <div className="upload-sub" style={{ marginBottom: "16px" }}>{file.name} — {(file.size / 1024).toFixed(1)} KB</div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); updateSession("resumeFile", null); updateSession("resume", null); }}>
                ✕ Remove
              </button>
              <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); onNext(); }}>
                Continue → Parse Resume
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="upload-icon">📂</div>
            <div className="upload-title">Drop your resume here</div>
            <div className="upload-sub" style={{ marginBottom: "16px" }}>Drag & drop or click to browse — PDF, DOCX, TXT supported</div>
            <button className="btn btn-secondary" onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}>
              Browse Files
            </button>
          </>
        )}
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "28px 0" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span style={{ color: "var(--text3)", fontSize: "0.78rem", fontFamily: "var(--font-mono)" }}>or use a sample resume</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      {/* Sample Resumes */}
      <div className="mb-16">
        <div className="section-header">
          <span className="section-title">Sample Candidates</span>
          <span className="text-sm text-muted">Click to load pre-built demo data</span>
        </div>
        <div className="card-grid card-grid-3">
          {SAMPLE_RESUMES.map((s) => (
            <div key={s.id} className="card" style={{ cursor: "pointer", transition: "all 0.2s" }}
              onClick={() => useSampleResume(s)}
            >
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>
                {["👨‍💻", "👩‍💻", "🧑‍💻"][SAMPLE_RESUMES.indexOf(s)]}
              </div>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>{s.name}</div>
              <div className="text-sm text-muted" style={{ fontFamily: "var(--font-mono)" }}>{s.filename}</div>
              <div style={{ marginTop: "12px" }}>
                <button className="btn btn-secondary" style={{ fontSize: "0.78rem", padding: "6px 14px" }}>
                  Load Sample
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="card-sm" style={{ borderColor: "rgba(109,90,255,0.3)", background: "rgba(109,90,255,0.05)" }}>
        <div className="flex gap-8 items-center" style={{ marginBottom: "8px" }}>
          <span>💡</span>
          <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>Demo Mode</span>
        </div>
        <div className="text-sm text-muted">
          This app works in full demo mode without an API key. All agents will use pre-built sample outputs.
          To use real AI responses, add your OpenAI API key to <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>backend/.env</span>
        </div>
      </div>
    </div>
  );
}
