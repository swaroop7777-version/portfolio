export const ABOUT = `I build AI systems that ship — and backend services that scale. Three years at Hexaware engineering Java and Spring Boot services for Delta Air Lines and Gilbarco Veeder-Root. MSc dissertation: deployed Mistral 7B on the University of Liverpool's Barkla GPU cluster, serving grounded answers through a full RAG pipeline. Grade A from both markers.`

export const WORK = [
  {
    name: 'AcademIQ',
    descriptors: [
      'AI tutor embedded in your own lecture PDFs.',
      'Designed the backend — Mistral 7B on a high-performance university GPU cluster.',
      'Full RAG pipeline serving grounded answers in real time.',
    ],
    year: '2026',
    type: 'AI · Education',
    tags: ['Mistral 7B', 'RAG', 'FAISS', 'FastAPI', 'React', 'QLoRA', 'NVIDIA L4'],
    live: 'https://academiq-seven.vercel.app',
    github: 'https://github.com/swaroop7777-version/academiq',
    color: '#d4e8d4',
  },
  {
    name: 'PharmAI Copilot',
    descriptors: [
      'AI-powered pharma MLR compliance assistant.',
      'Audits content against UK MHRA, FDA, Japan PMDA.',
      'Local LLM for full data sovereignty. Live.',
    ],
    year: '2025',
    type: 'AI · Healthcare',
    tags: ['Llama 3.2', 'Ollama', 'Flask', 'React', 'ngrok'],
    live: 'https://pharmaaiaccelerator.lovable.app',
    github: 'https://github.com/swaroop7777-version/PharmAI-copilot',
    color: '#d4dff5',
  },
  {
    name: 'Kafka Transaction Processor',
    descriptors: [
      'Event-driven microservice for high-volume financial transactions.',
      'Kafka consumer → JPA persistence → balance tracking.',
      'External incentive API integration.',
    ],
    year: '2025',
    type: 'Backend · Fintech',
    tags: ['Java 17', 'Spring Boot', 'Kafka', 'Spring Data JPA', 'H2'],
    live: null,
    github: 'https://github.com/swaroop7777-version/springboot-kafka-transaction-processor',
    color: '#f5e8d4',
  },
  {
    name: 'Secure Backend API',
    descriptors: [
      'Production-grade Spring Boot REST API.',
      'JWT auth, RBAC, PostgreSQL, AWS S3, Docker.',
      'Testcontainers integration tests.',
    ],
    year: '2025',
    type: 'Backend · Security',
    tags: ['Java 17', 'Spring Boot', 'JWT', 'PostgreSQL', 'AWS S3', 'Docker'],
    live: null,
    github: 'https://github.com/swaroop7777-version/springboot-secure-backend-api',
    color: '#e8d4f5',
  },
]

export const EXPERIENCE = [
  {
    company: 'Hexaware — Gilbarco Veeder-Root',
    role: 'Software Engineer',
    period: 'Jul 2023 — Feb 2025',
    points: [
      'Maintained and enhanced real-time Java and Spring Boot applications supporting fuel dispenser systems used by field technicians across global markets.',
      'Managed production deployments end-to-end via Jenkins CI/CD pipelines, ensuring zero-downtime rollouts across hardware models.',
      'Monitored application health proactively with Dynatrace, identifying performance bottlenecks before they reached end users.',
      'Enforced code quality and security standards via SonarQube — reduced technical debt across the codebase.',
      'Modernised legacy JSP frontend layers for cross-browser compatibility with new hardware models.',
    ],
  },
  {
    company: 'Hexaware — Delta Air Lines',
    role: 'Backend Developer',
    period: 'Sep 2022 — Jul 2023',
    points: [
      'Designed and built RESTful APIs in Java and Spring Boot enabling secure, regulated data exchange between Delta Air Lines systems and FAA platforms.',
      'Supported enterprise-scale aviation operations — ensuring data integrity and regulatory compliance across all API boundaries.',
      'Automated test suites with JUnit, Mockito and Cucumber across API, service and integration layers.',
      'Integrated Jenkins CI/CD workflows with continuous SonarQube quality gates for coverage and security.',
    ],
  },
  {
    company: 'University of Liverpool',
    role: 'MSc Advanced Computer Science',
    period: 'Sep 2025 — Jul 2027',
    points: [
      'Year in Industry programme — combining academic study with real-world placement.',
      'Dissertation: AcademIQ — AI-native learning platform. Deployed Mistral 7B on Barkla HPC (NVIDIA L4, 168-core AMD EPYC, 1.5 TB RAM).',
      'Key modules: Machine Learning, Research Methods in Computer Science, Geographic Data Science.',
      'Supervised by Phil Jimmieson. Assessed by Yi Dong.',
    ],
  },
  {
    company: 'MLR Institute of Technology',
    role: "Bachelor's in Computer Science",
    period: 'Jul 2019 — Jul 2022',
    points: [
      'Bachelor of Engineering in Computer Science.',
      'Hyderabad, India.',
    ],
  },
]

export const CONTACT = {
  email: 'swaroopraj1035@gmail.com',
  github: 'https://github.com/swaroop7777-version',
  linkedin: 'https://linkedin.com/in/rajuswaroop7',
  note: 'Open to graduate roles in AI/ML engineering and backend development. Based in Liverpool, UK.',
}
