import { useState, useCallback } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import UploadPage from "./pages/UploadPage";
import ParsedResumePage from "./pages/ParsedResumePage";
import JDMatchPage from "./pages/JDMatchPage";
import QuestionsPage from "./pages/QuestionsPage";
import EvaluatorPage from "./pages/EvaluatorPage";
import AgentMemoryPanel from "./components/AgentMemoryPanel";
import Toast from "./components/Toast";
import "./App.css";

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [sessionData, setSessionData] = useState({
    resume: null,
    resumeFile: null,
    selectedJD: null,
    parsedResume: null,
    jdMatch: null,
    questions: null,
    evaluation: null,
  });
  const [agentLogs, setAgentLogs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [memoryOpen, setMemoryOpen] = useState(false);

  const addLog = useCallback((agent, message, type = "info") => {
    setAgentLogs((prev) => [
      ...prev,
      { agent, message, type, time: new Date().toLocaleTimeString() },
    ]);
  }, []);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const updateSession = useCallback((key, value) => {
    setSessionData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const steps = [
    { id: 0, label: "Upload", icon: "⬆" },
    { id: 1, label: "Parse Resume", icon: "🔍" },
    { id: 2, label: "JD Match", icon: "🎯" },
    { id: 3, label: "Questions", icon: "💬" },
    { id: 4, label: "Evaluate", icon: "📊" },
  ];

  return (
    <div className="app-shell">
      <Header memoryOpen={memoryOpen} setMemoryOpen={setMemoryOpen} logCount={agentLogs.length} />
      <div className="app-body">
        <Sidebar steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} sessionData={sessionData} />
        <main className="main-content">
          {activeStep === 0 && (
            <UploadPage
              sessionData={sessionData}
              updateSession={updateSession}
              addLog={addLog}
              addToast={addToast}
              onNext={() => setActiveStep(1)}
            />
          )}
          {activeStep === 1 && (
            <ParsedResumePage
              sessionData={sessionData}
              updateSession={updateSession}
              addLog={addLog}
              addToast={addToast}
              onNext={() => setActiveStep(2)}
            />
          )}
          {activeStep === 2 && (
            <JDMatchPage
              sessionData={sessionData}
              updateSession={updateSession}
              addLog={addLog}
              addToast={addToast}
              onNext={() => setActiveStep(3)}
            />
          )}
          {activeStep === 3 && (
            <QuestionsPage
              sessionData={sessionData}
              updateSession={updateSession}
              addLog={addLog}
              addToast={addToast}
              onNext={() => setActiveStep(4)}
            />
          )}
          {activeStep === 4 && (
            <EvaluatorPage
              sessionData={sessionData}
              updateSession={updateSession}
              addLog={addLog}
              addToast={addToast}
            />
          )}
        </main>
      </div>

      <AgentMemoryPanel open={memoryOpen} onClose={() => setMemoryOpen(false)} logs={agentLogs} />

      <div className="toast-stack">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} />
        ))}
      </div>
    </div>
  );
}
