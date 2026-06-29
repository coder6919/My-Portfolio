import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Cpu, ArrowRight } from "lucide-react";

const Hero = () => {
  // Animation variants for the "System Boot" effect
  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background Layer: The Pattern from your CSS */}
      <div className="absolute inset-0 custom-grid opacity-20 pointer-events-none" />

      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center"
      >
        {/* Top Badge: System Status */}
        <motion.div
          variants={itemVars}
          className="flex items-center gap-2 px-3 py-1 border border-brand/30 bg-brand/5 rounded-full mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">
            System Optimized: 99.9% Uptime
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVars}
          className="text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter uppercase leading-[0.9]"
        >
          Syed <span className="text-brand">Saifuddin</span>
        </motion.h1>

        <motion.p
          variants={itemVars}
          className="mt-6 text-zinc-400 max-w-2xl text-lg font-medium leading-relaxed"
        >
          Full-Stack Engineer specializing in <span className="text-white font-bold">MERN</span> & <span className="text-white font-bold">Java Microservices</span>.
          Obsessed with building low-latency, scalable cloud architectures that hit <span className="text-brand">100 scores</span> on Lighthouse.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVars} className="mt-10 flex flex-wrap gap-4 justify-center">

          {/* VIEW PROJECTS: Links to #projects section */}
          <a href="#projects">
            <button className="group relative px-8 py-4 bg-brand text-black font-black uppercase italic tracking-tighter overflow-hidden cursor-pointer">
              <span className="relative z-10 flex items-center gap-2">
                View Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Hover fill effect */}
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </a>

          {/* DOWNLOAD RESUME: Links to the file in /public */}
          <a
            href="/Syed_Saifuddin_ResuMe.pdf"
            download="Syed_Saifuddin_Resume.pdf"
          >
            <button className="px-8 py-4 border border-white/10 hover:border-brand/50 transition-colors text-white font-black uppercase italic tracking-tighter bg-white/5 cursor-pointer">
              Download Resume
            </button>
          </a>

        </motion.div>

        {/* Floating Performance Overlay (Your 92 Score) */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-2 top-0 hidden lg:block"
        >
          <div className="p-4 bg-card border-2 border-brand/20 rounded-2xl shadow-2xl rotate-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full border-4 border-brand flex items-center justify-center">
                <span className="text-2xl font-black text-brand italic">92</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-500">PageSpeed</p>
                <p className="text-sm font-black text-white italic">Optimized</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
            </div>
          </div>
        </motion.div>
        {/* --- FLOATING LATENCY CARD (Bottom Left) --- */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1 bottom-[20%] hidden lg:block z-20"
        >
          <div className="p-4 bg-card border-2 border-brand/20 rounded-2xl shadow-2xl -rotate-6 backdrop-blur-md bg-black/80">
            <div className="flex items-center gap-4">
              {/* Mini Visual Graph */}
              <div className="flex items-end gap-[2px] h-10 w-12">
                <motion.div animate={{ height: [10, 25, 15] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 bg-brand/30" />
                <motion.div animate={{ height: [20, 35, 25] }} transition={{ repeat: Infinity, duration: 2.1 }} className="w-2 bg-brand/60" />
                <motion.div animate={{ height: [15, 30, 20] }} transition={{ repeat: Infinity, duration: 1.8 }} className="w-2 bg-brand" />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Avg Latency</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black text-white italic">179</p>
                  <span className="text-brand font-bold text-xs">ms</span>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2">
              <span className="text-[7px] font-mono text-zinc-500 uppercase">Response: Stable</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-brand" />
                <div className="w-1 h-1 rounded-full bg-brand" />
                <div className="w-1 h-1 rounded-full bg-brand" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Metrics Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-0 w-full border-t border-white/5 bg-card/50 backdrop-blur-md py-6"
      >
        <div className="container mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
          <MetricItem icon={<Zap size={16} />} label="Latency" value="179ms" />
          <MetricItem icon={<ShieldCheck size={16} />} label="Reliability" value="99.9%" />
          <MetricItem icon={<Cpu size={16} />} label="Load Test" value="10+ VU" />
          <div className="hidden sm:block h-8 w-[1px] bg-white/10" />
          <div className="flex gap-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stack: React • Spring Boot • AWS • Docker • Java • JavaScript • Node</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const MetricItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-brand">{icon}</div>
    <div>
      <p className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">{label}</p>
      <p className="text-sm font-black text-white italic">{value}</p>
    </div>
  </div>
);

export default Hero;