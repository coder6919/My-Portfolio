import React, { useEffect } from "react";
import { motion } from "framer-motion";
// Import custom components
import Navbar from "./components/Navbar";
import ProjectCard from "./components/ProjectCard";
import Skills from "./components/Skills";
import LeetCodeCard from "./components/LeetCodeCard";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Lenis from "lenis"
import Cursor from "./components/Cursor";
// Import Icons for Footer
import { Github, Linkedin, Mail, ExternalLink, Code2 } from "lucide-react";
import Hero from "./components/Hero";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);
  return (

    <div className="bg-bg min-h-screen text-white selection:bg-brand selection:text-black scroll-smooth">
      <Cursor />

      {/* 1. Navigation HUD */}
      <Navbar />

      {/* 2. Hero Section - The Terminal Entry */}
      <section id="home">
        <Hero />
      </section>

      {/* 3. Projects - The 3D Fan-out Showcase */}
      <section id="projects" className="py-24 container mx-auto px-6">
        <div className="flex items-end gap-4 mb-16">
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
            Deployed <span className="text-brand">Systems_</span>
          </h2>
          <div className="h-[2px] flex-1 bg-white/5 mb-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
          {/* Project 1: MERN Stack */}
          <ProjectCard
            title="Video Streaming"
            month="Jan"
            day="12"
            description="Scalable MERN backend on AWS Lambda. Achieved 92 PageSpeed & 179ms latency."
            stack={["React", "Node.js", "AWS Lambda", "MongoDB", "Redux"]}
            thumbnail="/yt1.webp"
            screenshots={["/yt2.webp", "/yt3.webp"]} // Add your actual paths here
          />

          {/* Project 2: Java Microservices */}
          <ProjectCard
            title="Patient Mgmt"
            month="Jan"
            day="30"
            description="Microservices architecture using Spring Boot & Docker. gRPC for high-performance comms."
            stack={["Java", "Spring Boot", "Docker", "PostgreSQL", "gRPC"]}
            thumbnail="/ptm1.webp"
            screenshots={["/ptm1.webp", "/ptm2.webp"]}
          />

          {/* Project 3: Placeholder (Future Project) */}
          <ProjectCard
            title="AI LifeSaver"
            month="May"
            day="24"
            description="Real-time data visualization engine with sub-100ms update frequency. (In Development)"
            stack={["Next.js", "Kafka", "Python", "WebSockets"]}
            thumbnail="/ailivesaverhome.webp"
            screenshots={["/lifesaverusage1.webp", "/lifesaverusage2.webp"]}
          />
          <ProjectCard
            title="MovieFlix"
            month="Nov"
            day="2025"
            description="Engineered a multi-page Single Page Application (SPA) using React Router v6, implementing a full routing system with an layout, dynamic routes."
            stack={["React", "Tailwind Css", "Appwrite(Cloud Database)"]}
            thumbnail="/movieflx1.webp"
            screenshots={["/movieflx2.webp", "/movieflx3.webp"]} // Add your actual paths here
          />
        </div>
      </section>

      {/* 4. Skills & Live Stats Section */}
      <section id="stack" className="relative bg-white/[0.01] py-24">
        <Skills />

        <div className="container mx-auto px-6 mt-20">
          {/* Using a grid here to keep things perfectly aligned */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">

            {/* Left Side: Content (Takes 7 columns) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-4xl font-black italic uppercase tracking-tighter">
                Algorithm <span className="text-brand">Performance_</span>
              </h3>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                Actively solving complex data structures and algorithm challenges.
                Live stats demonstrate problem-solving consistency across multiple platforms.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <AwardBadge label="YoungTurks 2025" issuer="Naukri" />
                <AwardBadge label="Codequezt #23" issuer="Naukri" />
                <AwardBadge label="Hackathon" issuer="CodingNinjas" />
              </div>
            </div>

            {/* Right Side: Card (Takes 5 columns, centered) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <LeetCodeCard username="saif619" />
            </div>

          </div>
        </div>
      </section>

      {/* 5. Professional Experience Timeline */}
      <section id="history">
        <Experience />
      </section>

      <Education />

      {/* 6. Simple Footer */}
      <footer className="border-t border-white/5 py-20 bg-card/30">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">
              Syed <span className="text-brand">Saifuddin_</span>
            </h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              Built with React + Tailwind v4 + Framer Motion
            </p>
          </div>

          <div className="flex gap-6">
            <SocialLink icon={<Github size={20} />} href="https://github.com/coder6919" />
            <SocialLink icon={<Linkedin size={20} />} href="https://www.linkedin.com/in/syed-saifuddin-a56564217" />
            <SocialLink icon={<Code2 size={20} />} href="https://leetcode.com" />
            <SocialLink icon={<Mail size={20} />} href="mailto:ssaifssyed17@gmail.com" />
          </div>

          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Nagpur, India. Open to Relocate.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Small helper components for UI consistency
const AwardBadge = ({ label, issuer }) => (
  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
    <p className="text-brand text-[10px] font-black uppercase tracking-widest">{issuer}</p>
    <p className="text-white text-sm font-bold uppercase italic tracking-tighter">{label}</p>
  </div>
);

const SocialLink = ({ icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-brand hover:border-brand transition-all duration-300"
  >
    {icon}
  </a>
);

export default App;