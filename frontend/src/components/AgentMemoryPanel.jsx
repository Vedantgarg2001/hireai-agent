export default function AgentMemoryPanel({ open, onClose, logs }) {
  return (
    <div className={`memory-panel ${open ? "open" : ""}`}>
      <div className="memory-header">
        <span>🧠 Agent Memory Log</span>
        <button className="btn-ghost" onClick={onClose} style={{ padding: "4px 10px", fontSize: "0.8rem" }}>✕</button>
      </div>
      <div className="memory-body">
        {logs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text3)", fontSize: "0.82rem" }}>
            No agent activity yet.<br />Start by uploading a resume.
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className={`log-entry ${log.type || "info"}`}>
              <div className="log-agent">{log.agent || "System"}</div>
              <div style={{ color: "var(--text)", fontSize: "0.82rem", marginBottom: "4px" }}>{log.message}</div>
              <div className="log-time">{log.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
