// ============================================================
// DUMMY DATA — Used as fallback when API key is unavailable
// All agents will use this data if the backend returns an error
// ============================================================

export const SAMPLE_RESUMES = [
  {
    id: "r1",
    name: "Arjun Sharma",
    filename: "arjun_sharma_resume.pdf",
    raw: "Sample resume text for Arjun Sharma...",
  },
  {
    id: "r2",
    name: "Priya Patel",
    filename: "priya_patel_resume.pdf",
    raw: "Sample resume text for Priya Patel...",
  },
  {
    id: "r3",
    name: "Rahul Verma",
    filename: "rahul_verma_resume.pdf",
    raw: "Sample resume text for Rahul Verma...",
  },
];

export const SAMPLE_JDS = [
  {
    id: "jd1",
    title: "Senior Full Stack Engineer",
    company: "TechCorp India",
    description:
      "We are looking for a Senior Full Stack Engineer with 5+ years of experience in React, Node.js, and cloud platforms. Must have strong knowledge of system design and microservices.",
  },
  {
    id: "jd2",
    title: "Data Scientist",
    company: "Analytics Hub",
    description:
      "Seeking a Data Scientist with expertise in Python, ML frameworks (TensorFlow/PyTorch), and experience with NLP and computer vision projects.",
  },
  {
    id: "jd3",
    title: "DevOps / Cloud Engineer",
    company: "CloudNine Solutions",
    description:
      "Looking for a DevOps Engineer proficient in AWS/GCP, Kubernetes, CI/CD pipelines, Terraform, and monitoring tools like Prometheus and Grafana.",
  },
];

export const DUMMY_PARSED_RESUME = {
  name: "Arjun Sharma",
  email: "arjun.sharma@email.com",
  phone: "+91-9876543210",
  location: "Bengaluru, India",
  summary:
    "Full-stack developer with 6 years of experience building scalable web applications using React, Node.js, and AWS.",
  skills: {
    technical: [
      "React.js",
      "Node.js",
      "TypeScript",
      "Python",
      "AWS",
      "Docker",
      "PostgreSQL",
      "Redis",
      "GraphQL",
      "REST APIs",
    ],
    soft: ["Team Leadership", "Agile/Scrum", "Problem Solving", "Communication"],
  },
  experience: [
    {
      company: "Infosys Ltd.",
      role: "Senior Software Engineer",
      duration: "2020 – Present (4 years)",
      highlights: [
        "Led a team of 5 developers building microservices for a fintech platform",
        "Improved API response time by 40% using Redis caching",
        "Implemented CI/CD pipelines using GitHub Actions and AWS CodeDeploy",
      ],
    },
    {
      company: "Wipro Technologies",
      role: "Software Engineer",
      duration: "2018 – 2020 (2 years)",
      highlights: [
        "Developed React dashboards for enterprise clients",
        "Integrated third-party payment gateways (Razorpay, Stripe)",
      ],
    },
  ],
  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "VTU, Bengaluru",
      year: "2018",
    },
  ],
  certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional Data Engineer"],
  projects: [
    {
      name: "E-Commerce Microservices Platform",
      tech: ["Node.js", "Kafka", "Docker", "Kubernetes"],
      description: "Built a scalable e-commerce backend handling 10K+ concurrent users",
    },
  ],
};

export const DUMMY_JD_MATCH = {
  overall_score: 87,
  verdict: "Strong Match",
  verdict_color: "#22c55e",
  breakdown: [
    { category: "Technical Skills", score: 92, weight: 40 },
    { category: "Experience Level", score: 88, weight: 30 },
    { category: "Domain Knowledge", score: 80, weight: 20 },
    { category: "Soft Skills", score: 85, weight: 10 },
  ],
  matching_skills: ["React.js", "Node.js", "AWS", "Docker", "REST APIs", "PostgreSQL"],
  missing_skills: ["Kubernetes (Production)", "System Design at Scale", "Microservices Architecture"],
  strengths: [
    "6 years of directly relevant full-stack experience",
    "Proven leadership — led a team of 5 engineers",
    "Strong cloud background with AWS certifications",
    "Hands-on with CI/CD and DevOps practices",
  ],
  gaps: [
    "Limited exposure to large-scale system design",
    "No mention of GraphQL in production systems",
  ],
  recommendation:
    "Arjun is a strong candidate for the Senior Full Stack Engineer role. His experience at Infosys aligns well with the JD's technical requirements. Recommend proceeding to technical round with focus on system design and scalability scenarios.",
};

export const DUMMY_INTERVIEW_QUESTIONS = {
  technical: [
    {
      id: "t1",
      question: "You mentioned improving API response time by 40% using Redis. Walk us through your caching strategy — what keys did you cache, what was your TTL policy, and how did you handle cache invalidation?",
      category: "System Design / Performance",
      difficulty: "Hard",
      why: "Tests depth of Redis knowledge beyond surface-level usage",
    },
    {
      id: "t2",
      question: "Design a URL shortener service like bit.ly that can handle 10 million requests per day. What tech stack would you choose from your experience and why?",
      category: "System Design",
      difficulty: "Hard",
      why: "Evaluates system design fundamentals using candidate's known stack",
    },
    {
      id: "t3",
      question: "In your e-commerce project using Kafka, how did you handle message ordering and ensure exactly-once delivery for critical payment events?",
      category: "Distributed Systems",
      difficulty: "Hard",
      why: "Deep-dives into Kafka usage mentioned in project section",
    },
    {
      id: "t4",
      question: "You have experience with both REST APIs and GraphQL. Can you explain a scenario from your work where switching to GraphQL would have solved a specific problem you faced with REST?",
      category: "API Design",
      difficulty: "Medium",
      why: "Tests understanding of trade-offs rather than just theoretical knowledge",
    },
    {
      id: "t5",
      question: "Walk us through how you set up your GitHub Actions CI/CD pipeline at Infosys. How did you handle environment-specific secrets and rollback strategies?",
      category: "DevOps / CI-CD",
      difficulty: "Medium",
      why: "Validates hands-on DevOps experience mentioned in resume",
    },
    {
      id: "t6",
      question: "Explain React's reconciliation algorithm. How does understanding it help you write more performant React code?",
      category: "Frontend / React",
      difficulty: "Medium",
      why: "Tests React expertise beyond basic usage",
    },
  ],
  behavioral: [
    {
      id: "b1",
      question: "Tell me about a time at Infosys when your team disagreed on an architectural decision. How did you resolve it and what was the outcome?",
      category: "Leadership & Conflict",
      framework: "STAR",
      why: "Explores leadership style given their team lead role",
    },
    {
      id: "b2",
      question: "Describe a situation where a production incident happened on your watch. Walk us through exactly what you did — from detection to resolution to post-mortem.",
      category: "Incident Management",
      framework: "STAR",
      why: "Critical for senior roles; tests ownership and crisis management",
    },
    {
      id: "b3",
      question: "You've worked across multiple tech stacks. Tell me about a time you had to learn a new technology under a tight deadline. What was your approach?",
      category: "Learning Agility",
      framework: "STAR",
      why: "Assesses adaptability — important for a fast-moving engineering team",
    },
    {
      id: "b4",
      question: "Give an example of when you had to push back on a requirement from a PM or stakeholder because it wasn't technically feasible. How did you handle it?",
      category: "Stakeholder Management",
      framework: "STAR",
      why: "Tests assertiveness and communication skills in cross-functional settings",
    },
  ],
};

export const DUMMY_AGENT_MEMORY = [
  { role: "system", content: "ResumeAgent initialized. Parsing uploaded document..." },
  { role: "agent", agent: "Resume Extractor", content: "✅ Resume parsed successfully. Extracted 10 technical skills, 2 work experiences, 2 certifications." },
  { role: "agent", agent: "JD Matcher", content: "✅ JD matching complete. Overall score: 87/100 — Strong Match verdict issued." },
  { role: "agent", agent: "Q-Gen Agent", content: "✅ Generated 6 technical questions and 4 behavioral questions tailored to candidate profile and JD." },
  { role: "agent", agent: "Supervisor", content: "✅ All agents completed successfully. Workflow finished. Report ready for review." },
];
