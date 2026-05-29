"""Q-Gen Agent — generates personalized interview questions."""

from agents.base_agent import get_llm_response

DUMMY_QUESTIONS = {
    "technical": [
        {"id": "t1", "question": "You mentioned improving API response time by 40% using Redis. Walk us through your caching strategy — what keys did you cache, what was your TTL policy, and how did you handle cache invalidation?", "category": "System Design / Performance", "difficulty": "Hard", "why": "Tests depth of Redis knowledge beyond surface-level usage"},
        {"id": "t2", "question": "Design a URL shortener service that can handle 10 million requests per day. What tech stack would you choose from your experience and why?", "category": "System Design", "difficulty": "Hard", "why": "Evaluates system design fundamentals using candidate's known stack"},
        {"id": "t3", "question": "In your e-commerce project using Kafka, how did you handle message ordering and ensure exactly-once delivery for critical payment events?", "category": "Distributed Systems", "difficulty": "Hard", "why": "Deep-dives into Kafka usage mentioned in project section"},
        {"id": "t4", "question": "You have experience with both REST APIs and GraphQL. Can you explain a scenario from your work where switching to GraphQL would have solved a specific problem you faced with REST?", "category": "API Design", "difficulty": "Medium", "why": "Tests understanding of trade-offs rather than theoretical knowledge"},
        {"id": "t5", "question": "Walk us through how you set up your GitHub Actions CI/CD pipeline at Infosys. How did you handle environment-specific secrets and rollback strategies?", "category": "DevOps / CI-CD", "difficulty": "Medium", "why": "Validates hands-on DevOps experience mentioned in resume"},
        {"id": "t6", "question": "Explain React's reconciliation algorithm. How does understanding it help you write more performant React code?", "category": "Frontend / React", "difficulty": "Medium", "why": "Tests React expertise beyond basic usage"},
    ],
    "behavioral": [
        {"id": "b1", "question": "Tell me about a time at Infosys when your team disagreed on an architectural decision. How did you resolve it and what was the outcome?", "category": "Leadership & Conflict", "framework": "STAR", "why": "Explores leadership style given their team lead role"},
        {"id": "b2", "question": "Describe a situation where a production incident happened on your watch. Walk us through exactly what you did — from detection to resolution to post-mortem.", "category": "Incident Management", "framework": "STAR", "why": "Tests ownership and crisis management"},
        {"id": "b3", "question": "You've worked across multiple tech stacks. Tell me about a time you had to learn a new technology under a tight deadline. What was your approach?", "category": "Learning Agility", "framework": "STAR", "why": "Assesses adaptability — important for a fast-moving team"},
        {"id": "b4", "question": "Give an example of when you had to push back on a requirement from a PM because it wasn't technically feasible. How did you handle it?", "category": "Stakeholder Management", "framework": "STAR", "why": "Tests assertiveness and communication in cross-functional settings"},
    ],
}

SYSTEM_PROMPT = """You are an expert technical interviewer. Generate personalized interview questions
based on the candidate's resume, job description, and match analysis.
Return ONLY a JSON object with keys:
  technical[] (each: id, question, category, difficulty, why)
  behavioral[] (each: id, question, category, framework, why)
Generate 5-6 technical and 4 behavioral questions. Make them specific to the candidate's actual experience.
No markdown, no explanation, pure JSON."""


def generate_questions(resume: dict, jd: str, match: dict) -> dict:
    user_prompt = f"Resume:\n{resume}\n\nJD:\n{jd}\n\nMatch Analysis:\n{match}"
    return get_llm_response(SYSTEM_PROMPT, user_prompt, DUMMY_QUESTIONS)
