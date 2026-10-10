/**
 * Authentic Portfolio Data for Syed Saifuddin
 * Extracted directly from existing project repository & credentials.
 * ZERO AI slop, zero fabricated statistics, zero invented employers.
 */

export const profileData = {
    name: "Syed Saifuddin",
    title: "AI/ML Engineer",
    subtitle: "Python Developer",
    location: "Nagpur, India (Open to Relocate)",
    email: "ssaifssyed17@gmail.com",
    github: "https://github.com/coder6919",
    githubUsername: "coder6919",
    linkedin: "https://www.linkedin.com/in/syed-saifuddin-a56564217",
    leetcode: "https://leetcode.com/u/saif619",
    leetcodeUsername: "saif619",
    resumeUrl: "/Syed_Saifuddin_ResuMe.pdf",
    // Professional summary from the current resume.
    bio: "Python developer focused on AI/ML and agentic systems — building Retrieval-Augmented Generation (RAG) pipelines, LLM orchestration, and semantic search applications using Python, LangChain, vector databases, and the Claude API. Comfortable owning an AI system end-to-end: data ingestion, retrieval and ranking logic, grounded generation, and evaluation. Backed by a software engineering foundation (full-stack development, REST APIs, production deployment) that supports building and shipping complete, working systems rather than isolated notebooks. Actively deepening machine learning fundamentals, NLP, and deep learning (TensorFlow, Scikit-learn) through a structured AI/ML certification program.",
};

export const projectsData = [
    {
        id: "rag-support-agent",
        title: "RAG-Based Knowledge & Support Agent",
        category: "AI / RAG Agent",
        description: "Retrieval-Augmented Generation agent that answers questions from a real, messy document set (PDFs, tables, scanned files) with cited sources, addressing how support and knowledge teams waste time searching scattered internal docs.",
        highlights: [
            "Designed a hybrid retrieval pipeline (vector + keyword search) with cross-encoder reranking to improve retrieval precision over naive top-k vector search.",
            "Implemented grounded generation with explicit refusal behavior for out-of-scope questions to reduce hallucination; evaluated with the Ragas framework across a 21-question set — 0.97 faithfulness, 0.90 context precision, 0.95 context recall, and 10/12 passed on adversarial, refusal, and conflicting-source checks — versus a naive top-k-only baseline that scored 0% on context precision and recall.",
        ],
        stack: ["Python", "LangChain", "Claude API", "Qdrant", "Hybrid Search"],
        live: "https://ground-work-ashen.vercel.app/",
        github: "https://github.com/coder6919/GroundWork",
    },
    {
        id: "fraud-ring-detection",
        title: "Graph-Based Fraud Ring Detection",
        category: "Graph ML / Full Stack",
        description: "Full-stack fraud ring detection system modeling 590K+ transactions as a 43K-node shared-identifier graph, using Louvain community detection (modularity ~0.50) to surface 86 candidate fraud rings — a network-structure signal a per-transaction classifier can't see by design.",
        highlights: [
            "Diagnosed a scoring-weight miscalibration and rebalanced the ring-scoring formula, raising top-ring precision from ~6% to 100% at the strictest threshold (50% at a broader tier); engineered noise-resistant graph construction (inverse-frequency edge dampening, hard exclusion cap) to stop generic shared identifiers from collapsing the graph into false connections.",
            "Ran a matched-alert-volume comparison (76 alerts) against a held-out Random Forest baseline — 63% vs. 50% precision, 0.93% vs. 0.16% recall — and documented why recall is structurally capped for isolated, non-ring fraud rather than overstating results.",
            "Shipped a live transaction-scoring feature: serialized the trained model behind a POST /score endpoint with an 8-field simplified input (feature-importance ranked), tying predictions back to the graph to flag known ring membership in real time; built a from-scratch force-directed graph visualization in React/SVG for interactive ring and account exploration.",
        ],
        stack: ["Python", "NetworkX", "FastAPI", "React", "D3", "Scikit-learn"],
        live: "https://fraud-detection-ten-beryl.vercel.app/",
        github: "https://github.com/coder6919/fraud-detection",
    },
    {
        id: "video-streaming",
        title: "Video Streaming Platform",
        category: "Full Stack / Cloud",
        date: "Jan 2026",
        description: "Scalable MERN video streaming backend hosted on AWS Lambda. Engineered custom video pipeline with sub-200ms latency and 92 Lighthouse performance score.",
        stack: ["React", "Node.js", "AWS Lambda", "MongoDB", "Redux"],
        thumbnail: "/yt1.webp",
        screenshots: ["/yt2.webp", "/yt3.webp"],
        github: "https://github.com/coder6919",
    },
    {
        id: "patient-mgmt",
        title: "Patient Management System",
        category: "Microservices / Java",
        date: "Jan 2026",
        description: "Microservices architecture utilizing Spring Boot and Docker. Integrated gRPC for high-throughput, low-latency inter-service communication with PostgreSQL persistence.",
        stack: ["Java", "Spring Boot", "Docker", "PostgreSQL", "gRPC"],
        thumbnail: "/ptm1.webp",
        screenshots: ["/ptm1.webp", "/ptm2.webp"],
        github: "https://github.com/coder6919",
    },
    {
        id: "ai-lifesaver",
        title: "AI LifeSaver",
        category: "Real-time AI / Viz",
        date: "May 2025",
        description: "Real-time data visualization engine processing streaming inputs with sub-100ms update frequency over WebSockets and Apache Kafka pipelines.",
        stack: ["Next.js", "Kafka", "Python", "WebSockets"],
        thumbnail: "/ailivesaverhome.webp",
        screenshots: ["/lifesaverusage1.webp", "/lifesaverusage2.webp"],
        github: "https://github.com/coder6919",
    },
    {
        id: "movieflix",
        title: "MovieFlix SPA",
        category: "Frontend Architecture",
        date: "Nov 2025",
        description: "Engineered a multi-page Single Page Application using React Router v6, dynamic nested routing, and Appwrite Cloud Database for media indexing and search.",
        stack: ["React", "Tailwind CSS", "Appwrite", "React Router"],
        thumbnail: "/movieflx1.webp",
        screenshots: ["/movieflx2.webp", "/movieflx3.webp"],
        github: "https://github.com/coder6919",
    },
];

export const experienceData = [
    {
        company: "Eduladdr Solutions",
        role: "Software Engineer Intern",
        date: "02/2025 – 05/2025",
        location: "Nagpur, India",
        points: [
            "Refactored legacy application code to improve consistency, maintainability, and performance across the codebase.",
            "Collaborated within an agile engineering team to ship incremental feature updates and resolve bugs across the development cycle.",
        ],
        tech: ["Refactoring", "Agile", "Bug Fixing", "Feature Delivery"],
    },
    {
        company: "DocTunes AudioTech Pvt. Ltd",
        role: "Software Engineer Intern",
        date: "06/2024 – 01/2025",
        location: "Remote",
        points: [
            "Designed and built reusable software components and custom logic modules, integrating with backend REST APIs to support dynamic data flows across the application.",
            "Used Git for version control and code collaboration, maintaining a clean commit history and coordinating seamless integration of updates across the codebase.",
        ],
        tech: ["Reusable Components", "REST APIs", "Git"],
    },
];

export const educationData = {
    degree: "Bachelor of Technology (B.Tech)",
    major: "Computer Science & Engineering",
    institution: "Anjuman College of Engineering & Technology",
    university: "Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)",
    location: "Nagpur, Maharashtra, India",
    period: "2021 – 2025",
    status: "Graduated",
};

export const skillsCategories = {
    dsa: {
        title: "Data Structures & Algorithms",
        subtitle: "Problem Solving",
        platform: "LeetCode: saif619",
        awards: ["YoungTurks 2025 (Naukri)", "Codequezt #23 (Naukri)", "Hackathon (CodingNinjas)"],
        skills: ["Arrays & Hashing", "Two Pointers", "Sliding Window", "Trees & Graphs", "Dynamic Programming", "Recursion & Backtracking"],
    },
    systemDesign: {
        title: "System Design & Backend",
        subtitle: "Scalable Architecture",
        skills: ["Microservices Architecture", "Spring Boot", "gRPC Comms", "AWS Lambda Serverless", "Docker Containerization", "Kafka Streaming"],
    },
    cleanCode: {
        title: "Engineering Best Practices",
        subtitle: "Maintainability & Testing",
        skills: ["Modular Component Architecture", "Custom React Hooks", "Git Version Control", "Lighthouse & CWV Optimization", "Load Testing (k6)"],
    },
    aiMl: {
        title: "AI / ML & LLM Engineering",
        subtitle: "Production Intelligence",
        skills: ["LangChain", "RAG Pipelines", "Vector Embeddings", "Prompt Engineering", "FastAPI Serving", "PyTorch / scikit-learn"],
    },
    webDev: {
        title: "Web Development",
        subtitle: "Full-Stack Web",
        skills: ["React 19", "Next.js", "Tailwind CSS v4", "Node.js & Express", "Redux Toolkit", "PostgreSQL & MongoDB"],
    },
};
