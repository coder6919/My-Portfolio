import { skillsCategories } from "../data/portfolioData";

export default function BooksModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl bg-[#17141f] border-2 border-[#33263f] rounded-lg shadow-2xl overflow-hidden font-mono text-slate-200">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 bg-[#221c2d] border-b border-[#33263f]">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
                        <h2 className="text-xs font-bold text-purple-300 uppercase tracking-widest">
                            Developer Bookshelf // Technical Foundation
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white px-2 py-0.5 text-xs bg-slate-800 rounded border border-slate-700"
                    >
                        ESC [x]
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
                    {Object.entries(skillsCategories).map(([key, cat]) => (
                        <div key={key} className="p-4 bg-[#100d17] rounded border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-amber-300 uppercase">{cat.title}</h3>
                                {cat.platform && (
                                    <span className="text-[10px] text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20 font-bold">
                                        {cat.platform}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-400">{cat.subtitle}</p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {cat.skills.map((s) => (
                                    <span key={s} className="text-xs bg-[#1f192b] text-slate-200 px-2.5 py-1 rounded border border-[#3b2f52]">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
