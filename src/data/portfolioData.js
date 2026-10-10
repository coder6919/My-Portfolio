/**
 * Authentic Portfolio Data for Syed Saifuddin
 * Extracted directly from existing project repository & credentials.
 * ZERO AI slop, zero fabricated statistics, zero invented employers.
 */

export const profileData = {
    name: "Syed Saifuddin",
    title: "Software Engineer",
    subtitle: "Full Stack & AI/ML",
    location: "Nagpur, India (Open to Relocate)",
    email: "ssaifssyed17@gmail.com",
    github: "https://github.com/coder6919",
    githubUsername: "coder6919",
    linkedin: "https://www.linkedin.com/in/syed-saifuddin-a56564217",
    leetcode: "https://leetcode.com/u/saif619",
    leetcodeUsername: "saif619",
    resumeUrl: "/Syed_Saifuddin_ResuMe.pdf",
    bio: "Software engineer building full-stack applications, scalable backend services, and production AI/RAG systems. Strong foundation in Computer Science and active competitive programmer.",
};

export const projectsData = [
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
        role: "React Developer Intern",
        date: "02/2025 – 05/2025",
        location: "Nagpur, India",
        points: [
            "Built and modified React.js components and production pages, refactoring legacy frontend code to improve consistency and responsiveness across mobile and desktop devices.",
            "Refactored and modernized existing legacy pages, correcting alignment issues and establishing modular component patterns.",
        ],
        tech: ["HTML5", "CSS3", "Responsive Design", "Refactoring", "React.js", "Git"],
    },
    {
        company: "DocTunes AudioTech Pvt. Ltd",
        role: "React Developer Intern",
        date: "06/2024 – 01/2025",
        location: "Remote",
        points: [
            "Built and maintained React.js components, creating reusable custom hooks for shared state and API communication across the web platform.",
            "Collaborated with UI/UX designers in Figma and managed code versions through Git, maintaining clean commit workflows.",
        ],
        tech: ["Figma", "React UI", "Custom Hooks", "Git", "UI/UX"],
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
