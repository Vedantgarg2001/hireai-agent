from agents.base_agent import get_llm_response

DUMMY_PARSED_RESUME = {
    "name": "Arjun Sharma",
    "email": "arjun.sharma@email.com",
    "phone": "+91-9876543210",
    "location": "Bengaluru, India",
    "summary": "Full-stack developer with 6 years of experience building scalable web applications using React, Node.js, and AWS.",
    "skills": {
        "technical": ["React.js", "Node.js", "TypeScript", "Python", "AWS", "Docker", "PostgreSQL", "Redis", "GraphQL", "REST APIs"],
        "soft": ["Team Leadership", "Agile/Scrum", "Problem Solving", "Communication"],
    },
    "experience": [
        {
            "company": "Infosys Ltd.",
            "role": "Senior Software Engineer",
            "duration": "2020 – Present (4 years)",
            "highlights": [
                "Led a team of 5 developers building microservices for a fintech platform",
                "Improved API response time by 40% using Redis caching",
                "Implemented CI/CD pipelines using GitHub Actions and AWS CodeDeploy",
            ],
        },
        {
            "company": "Wipro Technologies",
            "role": "Software Engineer",
            "duration": "2018 – 2020 (2 years)",
            "highlights": [
                "Developed React dashboards for enterprise clients",
                "Integrated third-party payment gateways (Razorpay, Stripe)",
            ],
        },
    ],
    "education": [{"degree": "B.Tech in Computer Science", "institution": "VTU, Bengaluru", "year": "2018"}],
    "certifications": ["AWS Certified Solutions Architect", "Google Cloud Professional Data Engineer"],
    "projects": [
        {
            "name": "E-Commerce Microservices Platform",
            "tech": ["Node.js", "Kafka", "Docker", "Kubernetes"],
            "description": "Built a scalable e-commerce backend handling 10K+ concurrent users",
        }
    ],
}

SYSTEM_PROMPT = """You are a resume parser. Extract information from the resume and return ONLY a JSON object.
Do not include any explanation, markdown, or text outside the JSON.
Return exactly this structure:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "summary": "string",
  "skills": {"technical": ["string"], "soft": ["string"]},
  "experience": [{"company": "string", "role": "string", "duration": "string", "highlights": ["string"]}],
  "education": [{"degree": "string", "institution": "string", "year": "string"}],
  "certifications": ["string"],
  "projects": [{"name": "string", "tech": ["string"], "description": "string"}]
}"""


def parse_resume_text(resume_text: str) -> dict:
    # Limit resume text to avoid token overflow
    truncated = resume_text[:3000] if len(resume_text) > 3000 else resume_text
    user_prompt = f"Parse this resume into JSON:\n\n{truncated}"
    return get_llm_response(SYSTEM_PROMPT, user_prompt, DUMMY_PARSED_RESUME)