"""JD Matcher Agent — scores resume vs job description."""

from agents.base_agent import get_llm_response

DUMMY_MATCH = {
    "overall_score": 87,
    "verdict": "Strong Match",
    "verdict_color": "#22c55e",
    "breakdown": [
        {"category": "Technical Skills", "score": 92, "weight": 40},
        {"category": "Experience Level", "score": 88, "weight": 30},
        {"category": "Domain Knowledge", "score": 80, "weight": 20},
        {"category": "Soft Skills", "score": 85, "weight": 10},
    ],
    "matching_skills": ["React.js", "Node.js", "AWS", "Docker", "REST APIs", "PostgreSQL"],
    "missing_skills": ["Kubernetes (Production)", "System Design at Scale", "Microservices Architecture"],
    "strengths": [
        "6 years of directly relevant full-stack experience",
        "Proven leadership — led a team of 5 engineers",
        "Strong cloud background with AWS certifications",
        "Hands-on with CI/CD and DevOps practices",
    ],
    "gaps": [
        "Limited exposure to large-scale system design",
        "No mention of GraphQL in production systems",
    ],
    "recommendation": "Strong candidate — recommend proceeding to technical round with focus on system design.",
}

SYSTEM_PROMPT = """You are an expert recruiter. Compare a candidate resume with a job description.
Return ONLY a JSON object with keys:
overall_score (0-100), verdict (string), verdict_color (hex),
breakdown[] (each: category, score 0-100, weight 0-100),
matching_skills[], missing_skills[], strengths[], gaps[], recommendation.
No markdown, no explanation, pure JSON."""


def match_jd(resume: dict, jd: str) -> dict:
    user_prompt = f"Resume:\n{resume}\n\nJob Description:\n{jd}"
    return get_llm_response(SYSTEM_PROMPT, user_prompt, DUMMY_MATCH)
