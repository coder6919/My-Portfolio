import React from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, ArrowUpRight } from "lucide-react";

const engagements = [
  "Full-time AI/ML Engineering roles",
  "Contract & freelance builds",
  "RAG systems & LLM app development",
];

const HireMe = () => {
  return (
    <section id="hire-me" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 custom-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/[0.06] blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              Currently available
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-ink leading-[1.05] mb-8"
          >
            Building an AI/ML feature, or an agent that actually ships?{" "}
            <span className="text-brand">Let's talk.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {engagements.map((e) => (
              <span
                key={e}
                className="text-xs font-bold text-ink-2 border border-white/10 rounded-full px-4 py-2"
              >
                {e}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="mailto:ssaifssyed17@gmail.com"
              className="group flex items-center gap-2 px-7 py-4 bg-brand text-brand-ink font-black uppercase tracking-tighter rounded-xl hover:bg-ink transition-colors"
            >
              <Mail size={18} />
              ssaifssyed17@gmail.com
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <div className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com/in/syed-saifuddin-a56564217"
                target="_blank"
                rel="noreferrer"
                className="p-4 text-ink-2 hover:text-brand transition-colors bg-white/5 rounded-xl border border-white/5"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com/coder6919"
                target="_blank"
                rel="noreferrer"
                className="p-4 text-ink-2 hover:text-brand transition-colors bg-white/5 rounded-xl border border-white/5"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HireMe;
