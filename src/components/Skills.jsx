import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Cpu, Boxes, Layers, Database, Activity } from "lucide-react";

const Skills = () => {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="flex items-end gap-4 mb-12">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-ink">
          Technical <span className="text-brand">Stack_</span>
        </h2>
        <div className="h-[2px] flex-1 bg-white/5 mb-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">

        <BentoCard
          className="md:col-span-2 md:row-span-2 border-brand/30 bg-brand/[0.06]"
          icon={<BrainCircuit className="text-brand" />}
          title="LLM & RAG Engineering"
          tags={["LangChain", "RAG Pipelines", "Vector Embeddings", "Prompt Engineering"]}
          description="Building retrieval-augmented applications on top of the OpenAI and Anthropic APIs — from chunking strategy to chat UI."
        />

        <BentoCard
          className="md:col-span-2 lg:col-span-3 bg-card"
          icon={<Cpu className="text-ink-2" />}
          title="ML & Model Development"
          tags={["PyTorch", "TensorFlow", "scikit-learn", "NumPy / Pandas"]}
          description="Training, fine-tuning, and evaluating models — from classical ML baselines to neural nets."
        />

        <BentoCard
          className="md:col-span-2 lg:col-span-3 bg-card"
          icon={<Boxes className="text-ink-2" />}
          title="AI Infrastructure & APIs"
          tags={["FastAPI", "OpenAI API", "Anthropic API", "Vector Databases"]}
          description="Serving models and agents behind clean, typed APIs built for latency and reliability."
        />

        <BentoCard
          className="md:col-span-2 lg:col-span-2 bg-card"
          icon={<Layers className="text-ink-2" />}
          title="Full-Stack Foundation"
          tags={["React.js", "Node.js", "Spring Boot", "gRPC"]}
          description="The engineering base every AI feature ships on top of."
        />

        <BentoCard
          className="md:col-span-2 lg:col-span-2 bg-card"
          icon={<Database className="text-ink-2" />}
          title="Data & Cloud"
          tags={["PostgreSQL", "MongoDB", "AWS Lambda", "Docker"]}
        />

        <BentoCard
          className="md:col-span-4 lg:col-span-2 border-brand/30 bg-brand/[0.06]"
          icon={<Activity className="text-brand" />}
          title="Reliability Engineering"
          tags={["k6 Load Testing", "Lighthouse", "Postman", "Git"]}
          description="Validating systems under real load before they ship."
        />

      </div>
    </section>
  );
};

const BentoCard = ({ title, icon, tags, description, className = "" }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`p-6 border border-white/10 rounded-2xl relative overflow-hidden group transition-colors duration-300 hover:bg-card-2 hover:border-white/20 ${className}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity">
        {icon && React.cloneElement(icon, { size: 80 })}
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-black/40 rounded-lg border border-white/5">
            {React.cloneElement(icon, { size: 20 })}
          </div>
          <h3 className="font-black uppercase tracking-tighter text-sm text-ink">
            {title}
          </h3>
        </div>

        {description && (
          <p className="text-xs text-muted font-medium leading-relaxed mb-6 max-w-[260px]">
            {description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-black/30 border border-white/5 text-ink-2 group-hover:border-brand/30 group-hover:text-brand transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.02]" />
    </motion.div>
  );
};

export default Skills;
