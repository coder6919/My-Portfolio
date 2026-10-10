// WorkspaceHUD.jsx
import { useInteraction } from "../interactions/InteractionContext";
import { profileData } from "../data/portfolioData";

export default function WorkspaceHUD() {
    const { openPanel, lampOn, toggleLamp } = useInteraction();

    return (
        <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 md:p-6 select-none font-mono pointer-events-none">
            {/* Top Bar: Title & Recruiter Quick Access */}
            <header className="flex items-center justify-between pointer-events-auto">
                <div className="bg-[#121118]/85 backdrop-blur-md px-3.5 py-2 rounded-md border border-white/10 shadow-lg">
                    <h1 className="text-xs md:text-sm font-bold text-white tracking-wider">
                        {profileData.name} <span className="text-amber-400">//</span>
                    </h1>
                    <p className="text-[10px] text-slate-400">
                        {profileData.title} • {profileData.subtitle}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleLamp}
                        className={`px-3 py-1.5 rounded-md border text-xs font-bold transition-all shadow-md cursor-pointer ${lampOn
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                                : "bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white"
                            }`}
                        title="Toggle warm desk lamp"
                    >
                        💡 Lamp {lampOn ? "ON" : "OFF"}
                    </button>

                    <button
                        onClick={() => openPanel("monitor", "whoami")}
                        className="px-3 py-1.5 rounded-md border border-sky-500/40 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-xs font-bold transition-all shadow-md cursor-pointer"
                        title="Quick Portfolio Access"
                    >
                        ⚡ Skip to Portfolio
                    </button>
                </div>
            </header>

            {/* Bottom Bar: Interactive Object Guidance Bar */}
            <footer className="pointer-events-auto flex flex-col items-center gap-2">
                <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 bg-[#121118]/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-xl text-[11px]">
                    <span className="text-amber-400 font-bold hidden sm:inline mr-1">&gt; Interactive Room:</span>

                    <button
                        onClick={() => openPanel("monitor", "projects")}
                        className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors cursor-pointer"
                    >
                        🖥️ Monitor
                    </button>

                    <button
                        onClick={() => openPanel("drawer", "Projects")}
                        className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors cursor-pointer"
                    >
                        📂 Drawers
                    </button>

                    <button
                        onClick={() => openPanel("books")}
                        className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-slate-700 transition-colors cursor-pointer"
                    >
                        📚 Books
                    </button>

                    <button
                        onClick={() => openPanel("calendar")}
                        className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-colors cursor-pointer"
                    >
                        📅 Calendar
                    </button>

                    <button
                        onClick={() => openPanel("phone")}
                        className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-rose-300 border border-slate-700 transition-colors cursor-pointer"
                    >
                        📱 Phone
                    </button>
                </div>

                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                    Click objects in the 3D room to explore
                </p>
            </footer>
        </div>
    );
}