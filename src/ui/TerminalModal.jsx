import { useState } from "react";
import { profileData, projectsData, experienceData, educationData, skillsCategories } from "../data/portfolioData";

export default function TerminalModal({ onClose, initialCommand = "whoami" }) {
    const [activeTab, setActiveTab] = useState(initialCommand);

    const commands = ["whoami", "projects", "experience", "skills", "education", "contact"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl bg-[#0c101d] border-2 border-[#1e293b] rounded-lg shadow-2xl overflow-hidden font-mono text-sm">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#171e2e] border-b border-[#1e293b]">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#ef4444] inline-block" />
                        <span className="w-3 h-3 rounded-full bg-[#f59e0b] inline-block" />
                        <span className="w-3 h-3 rounded-full bg-[#10b981] inline-block" />
                        <span className="ml-2 text-xs font-bold text-slate-400">syed@workspace:~ (bash)</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white px-2 py-0.5 text-xs bg-slate-800 rounded border border-slate-700"
                    >
                        ESC [x]
                    </button>
                </div>

                {/* Command Bar / Nav */}
                <div className="flex flex-wrap gap-2 px-4 py-2.5 bg-[#0f1422] border-b border-slate-800 text-xs">
                    <span className="text-slate-500 py-1">AVAILABLE:</span>
                    {commands.map((cmd) => (
                        <button
                            key={cmd}
                            onClick={() => setActiveTab(cmd)}
                            className={`px-2.5 py-1 rounded transition-colors ${
                                activeTab === cmd
                                    ? "bg-sky-500 text-white font-bold"
                                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                            }`}
                        >
                            {cmd}
                        </button>
                    ))}
                </div>

                {/* Terminal Content Area */}
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-slate-200">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <span>syed@workspace:~$</span>
                        <span className="text-sky-300">{activeTab}</span>
                    </div>

                    {/* WHOAMI */}
                    {activeTab === "whoami" && (
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-white tracking-wide">{profileData.name}</h2>
                            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                                {profileData.title} • {profileData.subtitle}
                            </p>
                            <p className="text-slate-300 text-xs leading-relaxed">{profileData.bio}</p>
                            <div className="pt-2 text-xs text-slate-400 space-y-1 border-t border-slate-800">
                                <p><span className="text-slate-500">Location:</span> {profileData.location}</p>
                                <p><span className="text-slate-500">GitHub:</span> <a href={profileData.github} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">{profileData.githubUsername}</a></p>
                                <p><span className="text-slate-500">LeetCode:</span> <a href={profileData.leetcode} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">{profileData.leetcodeUsername}</a></p>
                            </div>
                        </div>
                    )}

                    {/* PROJECTS */}
                    {activeTab === "projects" && (
                        <div className="space-y-4">
                            {projectsData.map((p) => (
                                <div key={p.id} className="p-3.5 bg-slate-900/80 rounded border border-slate-800 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-white text-sm">{p.title}</h3>
                                        <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">{p.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {p.stack.map((t) => (
                                            <span key={t} className="text-[10px] bg-slate-800 text-sky-300 px-2 py-0.5 rounded border border-slate-700">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* EXPERIENCE */}
                    {activeTab === "experience" && (
                        <div className="space-y-4">
                            {experienceData.map((exp, idx) => (
                                <div key={idx} className="p-3.5 bg-slate-900/80 rounded border border-slate-800 space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-white">{exp.role}</h3>
                                        <span className="text-xs text-emerald-400">{exp.date}</span>
                                    </div>
                                    <p className="text-xs text-sky-400 font-semibold">{exp.company} • {exp.location}</p>
                                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                                        {exp.points.map((pt, i) => (
                                            <li key={i}>{pt}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SKILLS */}
                    {activeTab === "skills" && (
                        <div className="space-y-3">
                            {Object.entries(skillsCategories).map(([key, cat]) => (
                                <div key={key} className="p-3 bg-slate-900/80 rounded border border-slate-800">
                                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">{cat.title}</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {cat.skills.map((s) => (
                                            <span key={s} className="text-[11px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* EDUCATION */}
                    {activeTab === "education" && (
                        <div className="p-4 bg-slate-900/80 rounded border border-slate-800 space-y-2">
                            <h3 className="text-sm font-bold text-white">{educationData.degree}</h3>
                            <p className="text-xs text-emerald-400 font-semibold">{educationData.major}</p>
                            <p className="text-xs text-slate-300">{educationData.institution}</p>
                            <p className="text-xs text-slate-400">{educationData.university} • {educationData.location}</p>
                            <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">Timeline: {educationData.period} ({educationData.status})</p>
                        </div>
                    )}

                    {/* CONTACT */}
                    {activeTab === "contact" && (
                        <div className="p-4 bg-slate-900/80 rounded border border-slate-800 space-y-3">
                            <p className="text-xs text-slate-300">Direct contact channels:</p>
                            <div className="space-y-1.5 text-xs">
                                <p><span className="text-slate-500">Email:</span> <a href={`mailto:${profileData.email}`} className="text-sky-400 hover:underline">{profileData.email}</a></p>
                                <p><span className="text-slate-500">GitHub:</span> <a href={profileData.github} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">{profileData.github}</a></p>
                                <p><span className="text-slate-500">LinkedIn:</span> <a href={profileData.linkedin} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">{profileData.linkedin}</a></p>
                                <p><span className="text-slate-500">LeetCode:</span> <a href={profileData.leetcode} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">{profileData.leetcode}</a></p>
                                <p><span className="text-slate-500">Resume:</span> <a href={profileData.resumeUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">Download PDF</a></p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer status */}
                <div className="px-4 py-2 bg-[#0c101d] border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
                    <span>Press ESC or click [x] to return to workspace</span>
                    <span className="text-emerald-400">STATUS: ONLINE</span>
                </div>
            </div>
        </div>
    );
}
