// PhoneModal.jsx
import { profileData } from "../data/portfolioData";

export default function PhoneModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="relative w-full max-w-sm bg-[#0f172a] border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-slate-200">
                {/* Phone Speaker & Camera Notch */}
                <div className="pt-3 pb-2 flex justify-center items-center bg-[#090d16]">
                    <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 bg-[#131c33] border-b border-slate-800">
                    <div>
                        <h2 className="text-xs font-bold text-sky-400 uppercase tracking-widest">Connect with Syed</h2>
                        <p className="text-[10px] text-slate-400">{profileData.location}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white px-2 py-0.5 text-xs bg-slate-800 rounded border border-slate-700"
                    >
                        [x]
                    </button>
                </div>

                {/* Contact Links */}
                <div className="p-5 space-y-3 text-xs">
                    <a
                        href={`mailto:${profileData.email}`}
                        className="flex items-center justify-between p-3 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                    >
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase">Email</span>
                            <span className="font-bold text-white">{profileData.email}</span>
                        </div>
                        <span className="text-sky-400 font-bold">Send ↗</span>
                    </a>

                    <a
                        href={profileData.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                    >
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase">GitHub</span>
                            <span className="font-bold text-white">{profileData.githubUsername}</span>
                        </div>
                        <span className="text-sky-400 font-bold">Open ↗</span>
                    </a>

                    <a
                        href={profileData.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                    >
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase">LinkedIn</span>
                            <span className="font-bold text-white">syed-saifuddin</span>
                        </div>
                        <span className="text-sky-400 font-bold">Connect ↗</span>
                    </a>

                    <a
                        href={profileData.leetcode}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                    >
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase">LeetCode</span>
                            <span className="font-bold text-white">{profileData.leetcodeUsername}</span>
                        </div>
                        <span className="text-amber-400 font-bold">Profile ↗</span>
                    </a>

                    <a
                        href={profileData.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 bg-emerald-950/60 hover:bg-emerald-900/60 rounded-lg border border-emerald-600/40 text-emerald-300 transition-colors"
                    >
                        <div>
                            <span className="text-emerald-400/70 block text-[10px] uppercase font-bold">Resume</span>
                            <span className="font-bold">Syed_Saifuddin_ResuMe.pdf</span>
                        </div>
                        <span className="font-bold">Download ↓</span>
                    </a>
                </div>
            </div>
        </div>
    );
}