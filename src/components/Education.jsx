import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Calendar, BookOpen, Compass, CheckCircle2, ShieldCheck } from "lucide-react";

const educationData = [
    {
        id: "01",
        label: "System Specification",
        title: "Bachelor of Technology (B.Tech)",
        description: "Computer Science & Engineering",
        icon: <BookOpen size={16} className="text-brand" />,
        align: "left"
    },
    {
        id: "02",
        label: "Site Location",
        title: "Anjuman College of Engineering & Technology",
        description: "Nagpur, Maharashtra, India",
        icon: <MapPin size={16} className="text-brand" />,
        align: "right"
    },
    {
        id: "03",
        label: "Timeline Protocol",
        title: "2021 - 2025",
        description: "Current Status: Build Complete (Graduated)",
        icon: <Calendar size={16} className="text-brand" />,
        align: "left"
    }
];

const Education = () => {
    return (
        <section id="education" className="py-32 relative bg-[#030303] overflow-hidden">
            {/* Background CAD Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(var(--color-brand) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

            <div className="container mx-auto px-6 relative z-10">

                {/* Main Heading: Architecture Protocol */}
                <div className="flex items-center gap-4 mb-24">
                    <div className="p-3 bg-brand/10 border border-brand/20 rounded-xl">
                        <GraduationCap className="text-brand" size={24} />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-ink">
                        Architecture <span className="text-brand">Protocol_</span>
                    </h2>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Central Vertical Axis */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-brand/50 via-white/10 to-transparent -translate-x-1/2" />

                    <div className="space-y-20">
                        {educationData.map((edu, index) => (
                            <motion.div
                                key={edu.id}
                                // SWING & POP ANIMATION
                                initial={{ opacity: 0, rotateX: -60, y: 50, scale: 0.8 }}
                                whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 10,
                                    delay: index * 0.2
                                }}
                                className={`relative flex flex-col md:flex-row items-center justify-between w-full ${edu.align === "right" ? "md:flex-row-reverse" : ""
                                    }`}
                                style={{ perspective: "1200px" }}
                            >
                                {/* Information Card */}
                                <div className="w-full md:w-[45%] group">
                                    <div className="relative p-7 bg-card border border-white/10 rounded-none transition-all duration-500 hover:border-brand/50 hover:bg-card-2">

                                        {/* ID Tag [01] */}
                                        <div className="absolute top-0 right-0 px-3 py-1 bg-white/5 border-l border-b border-white/10 text-[9px] font-mono text-zinc-600 group-hover:text-brand">
                                            [{edu.id}]
                                        </div>

                                        {/* Architectural Label */}
                                        <div className="flex items-center gap-2 mb-4">
                                            {edu.icon}
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-zinc-300">
                                                {edu.label}
                                            </span>
                                        </div>

                                        {/* Main Content */}
                                        <h3 className="text-2xl font-black text-ink uppercase tracking-tighter leading-[1.1] mb-2">
                                            {edu.title}
                                        </h3>
                                        <p className="text-brand font-bold text-sm uppercase tracking-tight">
                                            {edu.description}
                                        </p>

                                        {/* Minimal status indicator */}
                                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                                            <CheckCircle2 size={12} className="text-zinc-600 group-hover:text-brand transition-colors" />
                                            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Node_Verified</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Central Connector Node */}
                                <div className="absolute left-0 md:left-1/2 w-10 h-10 bg-bg border border-white/10 rounded-none flex items-center justify-center -translate-x-1/2 z-10 hidden md:flex">
                                    <div className="w-2 h-2 bg-brand rounded-full" />
                                </div>

                                <div className="hidden md:block w-[45%]" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* --- FINAL VERIFICATION STAMP --- */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: -5 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
                    className="mt-32 flex justify-center"
                >
                    <div className="inline-block border-2 border-dashed border-brand/40 p-6 bg-brand/5 backdrop-blur-sm relative group">
                        {/* Final Seal Icon */}
                        <div className="absolute -top-4 -right-4 bg-bg p-2 border border-brand/20">
                            <ShieldCheck size={24} className="text-brand" />
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <Compass size={16} className="text-brand/50 animate-spin-slow" />
                            <p className="text-[11px] font-black tracking-[.4em] text-zinc-500 uppercase">System Integrity Verified</p>
                        </div>

                        {/* The main status line */}
                        <p className="text-4xl font-black text-brand leading-none uppercase tracking-tighter">
                            Approved_For_Dev
                        </p>

                        <div className="mt-6 flex justify-between items-center border-t border-brand/20 pt-4 font-mono">
                            <div className="flex flex-col">
                                <span className="text-[8px] text-zinc-600">DEPLOYMENT_HASH</span>
                                <span className="text-[10px] text-zinc-400">FINAL_BUILD_01_SUCCESS</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[8px] text-zinc-600">ISSUER_PROTOCOL</span>
                                <p className="text-[10px] text-white font-bold tracking-widest">RTMNU_UNIVERSITY</p>
                            </div>
                        </div>

                        {/* Optional: Add a "Build Complete" watermark in the corner of the stamp */}
                        <div className="absolute -bottom-2 -left-2 bg-brand text-brand-ink text-[7px] font-black px-1 uppercase">
                            Success_Verified
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Education;