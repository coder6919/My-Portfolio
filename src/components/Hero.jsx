import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Terminal } from "lucide-react";

const Hero = () => {
  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.09, delayChildren: 0.15 }
    }
  };

  const itemVars = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const stack = ["Python", "FastAPI", "LangChain", "RAG", "PyTorch", "React"];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-28">
      <div className="absolute inset-0 custom-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] bg-brand/[0.08] blur-[140px] rounded-full pointer-events-none" />

      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          variants={itemVars}
          className="flex items-center gap-2 px-3 py-1 border border-brand/30 bg-brand/5 rounded-full mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
            Open to AI/ML Engineering Roles
          </span>
        </motion.div>

        <motion.h1
          variants={itemVars}
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.92]"
        >
          Syed <span className="text-brand">Saifuddin</span>
        </motion.h1>

        <motion.p
          variants={itemVars}
          className="mt-6 text-ink-2 max-w-2xl text-lg font-medium leading-relaxed"
        >
          AI/ML Engineer building <span className="text-ink font-bold">LLM-powered applications</span> and{" "}
          <span className="text-ink font-bold">RAG pipelines</span> — with a full-stack engineering
          foundation to actually ship them. FastAPI, LangChain, PyTorch and the OpenAI &amp; Anthropic
          APIs, end to end.
        </motion.p>

        <motion.div variants={itemVars} className="mt-10 flex flex-wrap gap-4 justify-center">
          <a href="#projects">
            <button className="group relative px-8 py-4 bg-brand text-brand-ink font-black uppercase tracking-tighter overflow-hidden cursor-pointer rounded-xl">
              <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                View Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </a>

          <a href="#hire-me">
            <button className="px-8 py-4 border border-white/10 hover:border-brand/50 transition-colors text-ink font-black uppercase tracking-tighter bg-white/5 cursor-pointer rounded-xl whitespace-nowrap">
              Work With Me
            </button>
          </a>
        </motion.div>

        {/* Floating status readout — honest, no fabricated metrics */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-4 top-4 hidden lg:block"
        >
          <div className="p-4 bg-card border border-white/10 rounded-2xl shadow-xl w-52">
            <div className="flex items-center gap-2 mb-3 text-brand">
              <Terminal size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest font-mono">Currently building</span>
            </div>
            <p className="text-sm font-bold text-ink leading-snug">
              A retrieval-augmented agent, from embedding pipeline to chat UI.
            </p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 bottom-[8%] hidden lg:block z-20"
        >
          <div className="p-4 bg-card/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-brand mb-2">
              <Sparkles size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest font-mono">Core stack</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-w-[180px]">
              {["FastAPI", "LangChain", "PyTorch"].map((t) => (
                <span key={t} className="text-[9px] font-bold text-ink-2 border border-white/10 rounded-full px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 w-full border-t border-white/5 bg-card/50 backdrop-blur-md py-5"
      >
        <div className="container mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-4">
          <span className="text-[10px] font-black text-faint uppercase tracking-widest hidden md:block">Stack</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {stack.map((s) => (
              <span key={s} className="text-[10px] font-mono font-medium text-muted uppercase tracking-wider">
                {s}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
