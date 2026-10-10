import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";

const experiences = [
  {
    company: "Eduladdr Solutions",
    role: "React Developer Intern",
    date: "02/2025 – 05/2025",
    location: "Nagpur, India",
    points: [
      "Built and modified React.js components and pages, refactoring legacy frontend code to improve consistency and responsiveness across mobile and desktop.",
      "Refactored and modernized existing legacy pages, correcting alignment issues and improving visual consistency.",
    ],
    tech: ["HTML5", "CSS3", "Responsive Design", "Refactoring", "React JS", "Git"]
  },
  {
    company: "DocTunes AudioTech Pvt.Ltd",
    role: "React Developer Intern",
    date: "06/2024 – 01/2025",
    location: "Remote",
    points: [
      "Built and maintained React.js components and pages, including custom hooks for reusable logic shared across the application.",
      "Managed code versions using Git, ensuring clean commit history and seamless integration.",
    ],
    tech: ["Figma", "React UI", "Git", "UI/UX"]
  }
];

const Experience = () => {
  return (
    <section id="experience" className="py-24 container mx-auto px-6 relative">
      <div className="flex items-center gap-4 mb-16">
        <div className="p-3 bg-brand/10 border border-brand/20 rounded-xl">
          <Briefcase className="text-brand" size={24} />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-ink">
          Professional <span className="text-brand">History_</span>
        </h2>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* The Animated "Circuit" Line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2" />
        
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row items-center justify-between w-full ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Content Card */}
              <div className="w-full md:w-[45%] group">
                <div className="p-6 bg-card border border-white/5 rounded-2xl group-hover:border-brand/30 group-hover:bg-card-2 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-brand uppercase tracking-widest bg-brand/5 px-2 py-1 border border-brand/20">
                      {exp.date}
                    </span>
                    <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-bold uppercase">
                      <MapPin size={10} /> {exp.location}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-ink uppercase tracking-tighter mb-1">
                    {exp.role}
                  </h3>
                  <p className="text-brand font-bold text-sm mb-4">{exp.company}</p>

                  <ul className="space-y-3 mb-6">
                    {exp.points.map((point, i) => (
                      <li key={i} className="flex gap-3 text-xs text-zinc-400 leading-relaxed">
                        <CheckCircle2 size={14} className="text-brand shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map(t => (
                      <span key={t} className="text-[9px] font-black text-zinc-500 uppercase border border-white/10 px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center Icon/Node */}
              <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-bg border-4 border-[#141414] rounded-xl flex items-center justify-center -translate-x-1/2 z-10 hidden md:flex">
                <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
              </div>

              {/* Spacer for Desktop */}
              <div className="hidden md:block w-[45%]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;