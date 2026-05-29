import {
  DUMMY_PARSED_RESUME,
  DUMMY_JD_MATCH,
  DUMMY_INTERVIEW_QUESTIONS,
} from "../data/dummyData";

const API_BASE = "https://hireai-agent.onrender.com";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Resume Parser Agent ─────────────────────────────────────
export async function parseResume(file, onFallback) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(`${API_BASE}/api/parse-resume`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.name || !data.skills) throw new Error("Invalid response");
    return data;
  } catch (err) {
    const msg = err.name === "AbortError" ? "Request timed out" : err.message;
    onFallback?.(`Using demo data (${msg})`);
    await delay(1500);
    return DUMMY_PARSED_RESUME;
  }
}

// ─── JD Matcher Agent ────────────────────────────────────────
export async function matchJD(resumeData, jdText, onFallback) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(`${API_BASE}/api/match-jd`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume: resumeData, jd: jdText }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.overall_score) throw new Error("Invalid response");
    return data;
  } catch (err) {
    const msg = err.name === "AbortError" ? "Request timed out" : err.message;
    onFallback?.(`Using demo data (${msg})`);
    await delay(1800);
    return DUMMY_JD_MATCH;
  }
}

// ─── Q-Gen Agent ─────────────────────────────────────────────
export async function generateQuestions(resumeData, jdText, matchData, onFallback) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(`${API_BASE}/api/generate-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume: resumeData, jd: jdText, match: matchData }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.technical || !data.behavioral) throw new Error("Invalid response");
    return data;
  } catch (err) {
    const msg = err.name === "AbortError" ? "Request timed out" : err.message;
    onFallback?.(`Using demo data (${msg})`);
    await delay(2000);
    return DUMMY_INTERVIEW_QUESTIONS;
  }
}

// ─── Memory Agent ─────────────────────────────────────────────
export async function getAgentMemory(sessionId) {
  try {
    const res = await fetch(`${API_BASE}/api/memory/${sessionId}`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return [];
  }
}

// ─── Evaluator Agent ─────────────────────────────────────────
export async function evaluateOutput(resumeData, jdText, questions, onFallback) {
  const DUMMY_EVAL = {
    question_quality: 4.3,
    jd_alignment: 4.6,
    diversity_score: 4.1,
    feedback: [
      "Questions are highly personalized to the candidate's resume — references specific projects.",
      "Good balance of technical depth (system design) and role-specific questions.",
      "Behavioral questions use STAR framework prompts effectively.",
      "Consider adding 1-2 culture-fit questions for senior roles.",
    ],
    overall: 4.4,
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(`${API_BASE}/api/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume: resumeData, jd: jdText, questions }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.overall) throw new Error("Invalid response");
    return data;
  } catch (err) {
    const msg = err.name === "AbortError" ? "Request timed out" : err.message;
    onFallback?.(`Using demo data (${msg})`);
    await delay(1200);
    return DUMMY_EVAL;
  }
}