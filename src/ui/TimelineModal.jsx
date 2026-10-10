import { experienceData, educationData } from "../data/portfolioData";

export default function TimelineModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="relative w-full max-w-xl bg-[#1a1721] border-2 border-[#332a40] rounded-lg shadow-2xl overflow-hidden font-mono text-slate-200">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 bg-[#241f2e] border-b border-[#332a40]">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                        <h2 className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                            Wall Calendar // Experience Timeline
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white px-2 py-0.5 text-xs bg-slate-800 rounded border border-slate-700"
                    >
                        ESC [x]
                    </button>
                </div>

                {/* Timeline Content */}
                <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
                    {/* Entry: Current 2026 */}
                    <div className="relative pl-6 border-l-2 border-sky-500 space-y-1">
                        <span className="absolute -left-[7px] top-0 w-3 h-3 bg-sky-500 rounded-full" />
                        <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                            Present • 2026
                        </span>
                        <h3 className="text-sm font-bold text-white pt-1">Software Engineer (Full Stack & AI/ML)</h3>
                        <p className="text-xs text-slate-400">Open to Relocate • Actively building production applications & ML pipelines</p>
                    </div>

                    {/* Work Experience */}
                    {experienceData.map((exp, idx) => (
                        <div key={idx} className="relative pl-6 border-l-2 border-emerald-500 space-y-1.5">
                            <span className="absolute -left-[7px] top-0 w-3 h-3 bg-emerald-500 rounded-full" />
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {exp.date}
                            </span>
                            <h3 className="text-sm font-bold text-white pt-1">{exp.role}</h3>
                            <p className="text-xs text-amber-300 font-semibold">{exp.company} • {exp.location}</p>
                            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pt-1 font-sans">
                                {exp.points.map((pt, i) => (
                                    <li key={i}>{pt}</li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Education Milestone */}
                    <div className="relative pl-6 border-l-2 border-purple-500 space-y-1">
                        <span className="absolute -left-[7px] top-0 w-3 h-3 bg-purple-500 rounded-full" />
                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            2021 – 2025
                        </span>
                        <h3 className="text-sm font-bold text-white pt-1">{educationData.degree}</h3>
                        <p className="text-xs text-purple-300">{educationData.major}</p>
                        <p className="text-xs text-slate-400 font-sans">{educationData.institution} • {educationData.location}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
