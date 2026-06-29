import React from "react";
import { motion } from "framer-motion";
import { Code2, Layout, Database, Server, Cpu, Activity, Globe, Box } from "lucide-react";

const Skills = () => {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="flex items-end gap-4 mb-12">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          Technical <span className="text-brand">Stack_</span>
        </h2>
        <div className="h-[2px] flex-1 bg-white/5 mb-2" />
      </div>

      {/* The Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-auto gap-4">
        
        {/* 1. Core Languages (Large Vertical) */}
        <BentoCard 
          className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-card to-[#1a1a1a]"
          icon={<Code2 className="text-brand" />}
          title="Core Runtime"
          tags={["Java (Core)", "JavaScript (ES6+)", "HTML5", "CSS3"]}
          description="The foundation of my polyglot development approach, balancing type-safety with dynamic flexibility."
        />

        {/* 2. Frontend Engine (Wide) */}
        <BentoCard 
          className="md:col-span-2 lg:col-span-3 bg-brand/5 border-brand/20"
          icon={<Layout className="text-brand" />}
          title="Frontend Engine"
          tags={["React.js", "Redux Toolkit", "Tailwind CSS v4", "Vite"]}
          description="Building ultra-fast UIs with 0ms Total Blocking Time and optimized asset delivery."
        />

        {/* 3. Microservices Card (High Density) */}
        <BentoCard 
          className="md:col-span-2 lg:col-span-3 bg-[#111] border-white/5"
          icon={<Server className="text-emerald-500" />}
          title="Backend & Microservices"
          tags={["Spring Boot", "Node.js", "Express.js", "gRPC", "REST APIs"]}
          description="Architecting distributed systems with a focus on loose coupling and high-performance communication."
        />

        {/* 4. Infrastructure (Small Square) */}
        <BentoCard 
          className="md:col-span-2 lg:col-span-2 bg-zinc-900/50"
          icon={<Globe className="text-blue-400" />}
          title="Cloud & DevOps"
          tags={["AWS Lambda", "Docker", "Netlify", "Render"]}
        />

        {/* 5. Databases (Small Square) */}
        <BentoCard 
          className="md:col-span-2 lg:col-span-2 bg-zinc-900/50"
          icon={<Database className="text-amber-500" />}
          title="Data Persistence"
          tags={["PostgreSQL", "MongoDB", "Mongoose"]}
        />

        {/* 6. Testing & Engineering (Highlight Card) */}
        <BentoCard 
          className="md:col-span-4 lg:col-span-2 border-brand/40 bg-brand/10"
          icon={<Activity className="text-brand" />}
          title="Reliability Engineering"
          tags={["k6 Load Testing", "Lighthouse", "Postman", "Git"]}
          description="Validating backend reliability at 99.9% success rates."
        />

      </div>
    </section>
  );
};

const BentoCard = ({ title, icon, tags, description, className = "" }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-6 border border-white/10 rounded-2xl relative overflow-hidden group transition-colors ${className}`}
    >
      {/* Background Pattern Decal */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon && React.cloneElement(icon, { size: 80 })}
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-black/50 rounded-lg border border-white/5">
            {React.cloneElement(icon, { size: 20 })}
          </div>
          <h3 className="font-black italic uppercase tracking-tighter text-sm text-white">
            {title}
          </h3>
        </div>

        {description && (
          <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-6 max-w-[250px]">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-black/40 border border-white/5 text-zinc-300 group-hover:border-brand/30 group-hover:text-brand transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Subtle Scanline Effect */}
      <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.03]" />
    </motion.div>
  );
};

export default Skills;