"""Evaluator Agent — LLM-based self-evaluation of all agent outputs."""

from agents.base_agent import get_llm_response

DUMMY_EVAL = {
    "question_quality": 4.3,
    "jd_alignment": 4.6,
    "diversity_score": 4.1,
    "feedback": [
        "Questions are highly personalized to the candidate's resume — references specific projects.",
        "Good balance of technical depth (system design) and role-specific questions.",
        "Behavioral questions use STAR framework prompts effectively.",
        "Consider adding 1-2 culture-fit questions for senior roles.",
    ],
    "overall": 4.4,
}

SYSTEM_PROMPT = """You are an interview quality evaluator. Assess the quality of AI-generated interview questions.
Return ONLY a valid JSON object with exactly these keys:
{
  "question_quality": <float between 0-5>,
  "jd_alignment": <float between 0-5>,
  "diversity_score": <float between 0-5>,
  "feedback": ["string", "string", "string", "string"],
  "overall": <float between 0-5>
}
No markdown, no explanation, pure JSON only."""


def evaluate_output(resume: dict, jd: str, questions: dict) -> dict:
    user_prompt = f"Resume:\n{resume}\n\nJob Description:\n{jd}\n\nGenerated Questions:\n{questions}\n\nEvaluate the quality of these interview questions for this candidate and job."
    return get_llm_response(SYSTEM_PROMPT, user_prompt, DUMMY_EVAL)