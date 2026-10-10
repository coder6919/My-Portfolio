// FolderModal.jsx
import { useState } from "react";
import { projectsData, skillsCategories, educationData } from "../data/portfolioData";

export default function FolderModal({ category = "Projects", onClose }) {
    const [activeTab, setActiveTab] = useState(category);

    const categories = ["Projects", "Skills", "Education", "Other"];

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)"
        }}>
            <div style={{
                position: "relative",
                width: "100%",
                maxWidth: "768px",
                backgroundColor: "#1e1b24",
                border: "2px solid #3b3245",
                borderRadius: "8px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
                overflow: "hidden",
                fontFamily: "system-ui, -apple-system, sans-serif",
                color: "#e2e8f0"
            }}>
                {/* Drawer Tab Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "between",
                    padding: "12px 20px",
                    backgroundColor: "#2a2433",
                    borderBottom: "1px solid #3b3245"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ width: "12px", height: "12px", backgroundColor: "#f59e0b", borderRadius: "2px", display: "inline-block" }} />
                        <h2 style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: "bold", color: "#fcd34d", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                            Desk Drawer // {activeTab}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            color: "#94a3b8",
                            backgroundColor: "#1e293b",
                            border: "1px solid #475569",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            fontFamily: "monospace",
                            cursor: "pointer"
                        }}
                    >
                        Close [x]
                    </button>
                </div>

                {/* Sub-nav tabs inside drawer */}
                <div style={{
                    display: "flex",
                    gap: "8px",
                    padding: "10px 20px",
                    backgroundColor: "#17151c",
                    borderBottom: "1px solid #3b3245",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    overflowX: "auto"
                }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            style={{
                                padding: "6px 12px",
                                borderRadius: "4px",
                                border: activeTab === cat ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid transparent",
                                backgroundColor: activeTab === cat ? "rgba(245, 158, 11, 0.2)" : "rgba(30, 41, 59, 0.6)",
                                color: activeTab === cat ? "#fcd34d" : "#94a3b8",
                                fontWeight: activeTab === cat ? "bold" : "normal",
                                cursor: "pointer",
                                whiteSpace: "nowrap"
                            }}
                        >
                            📂 {cat}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ padding: "24px", maxHeight: "65vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                    {activeTab === "Projects" && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                            {projectsData?.map((p) => (
                                <div
                                    key={p.id}
                                    style={{
                                        padding: "16px",
                                        backgroundColor: "#141219",
                                        borderRadius: "6px",
                                        border: "1px solid #1e293b",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        gap: "12px"
                                    }}
                                >
                                    <div>
                                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
                                            <div>
                                                <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>{p?.category || "Project"}</span>
                                                <h3 style={{ fontWeight: "bold", color: "#ffffff", fontSize: "15px", margin: "2px 0 0 0" }}>{p?.title}</h3>
                                            </div>
                                            {p?.date && (
                                                <span style={{ fontSize: "10px", color: "#fcd34d", backgroundColor: "rgba(252, 211, 77, 0.1)", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>{p.date}</span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: "1.5", margin: 0 }}>{p?.description}</p>
                                        {p?.highlights?.length > 0 && (
                                            <ul style={{ margin: "8px 0 0 0", paddingLeft: "16px", listStyleType: "disc", display: "flex", flexDirection: "column", gap: "6px" }}>
                                                {p.highlights.map((h) => (
                                                    <li key={h} style={{ fontSize: "11.5px", color: "#94a3b8", lineHeight: "1.5" }}>{h}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div style={{ paddingTop: "12px", borderTop: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                            {p?.stack?.map((t) => (
                                                <span key={t} style={{ fontSize: "10px", backgroundColor: "#1e293b", color: "#38bdf8", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                                            {p?.live && (
                                                <a
                                                    href={p.live}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{ fontSize: "12px", fontFamily: "monospace", fontWeight: "bold", color: "#34d399", textDecoration: "underline" }}
                                                >
                                                    Live Demo →
                                                </a>
                                            )}
                                            {p?.github && (
                                                <a
                                                    href={p.github}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{ fontSize: "12px", fontFamily: "monospace", fontWeight: "bold", color: "#fcd34d", textDecoration: "underline" }}
                                                >
                                                    View Source on GitHub →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "Skills" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {Object.entries(skillsCategories || {}).map(([key, cat]) => (
                                <div key={key} style={{ padding: "16px", backgroundColor: "#141219", borderRadius: "6px", border: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h3 style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: "bold", color: "#38bdf8", textTransform: "uppercase", margin: 0 }}>{cat?.title}</h3>
                                        {cat?.platform && <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#fcd34d", backgroundColor: "rgba(252, 211, 77, 0.1)", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(252, 211, 77, 0.2)" }}>{cat.platform}</span>}
                                    </div>
                                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{cat?.subtitle}</p>
                                    {cat?.awards && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", paddingTop: "4px" }}>
                                            {cat.awards.map((award) => (
                                                <span key={award} style={{ fontSize: "10px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>
                                                    🏆 {award}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingTop: "4px" }}>
                                        {cat?.skills?.map((s) => (
                                            <span key={s} style={{ fontSize: "11px", backgroundColor: "#1e293b", color: "#e2e8f0", padding: "4px 8px", borderRadius: "4px", fontFamily: "monospace", border: "1px solid #334155" }}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "Education" && (
                        <div style={{ padding: "20px", backgroundColor: "#141219", borderRadius: "6px", border: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <span style={{ width: "fit-content", fontSize: "11px", fontFamily: "monospace", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "2px 8px", borderRadius: "4px" }}>
                                Degree Verified
                            </span>
                            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", margin: 0 }}>{educationData?.degree}</h3>
                            <p style={{ fontSize: "13px", color: "#34d399", fontFamily: "monospace", margin: 0 }}>{educationData?.major}</p>
                            <p style={{ fontSize: "12px", color: "#cbd5e1", margin: 0 }}>{educationData?.institution}</p>
                            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{educationData?.university} • {educationData?.location}</p>
                            <p style={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace", paddingTop: "8px", borderTop: "1px solid #1e293b", margin: 0 }}>Duration: {educationData?.period} • Status: {educationData?.status}</p>
                        </div>
                    )}

                    {activeTab === "Other" && (
                        <div style={{ padding: "20px", backgroundColor: "#141219", borderRadius: "6px", border: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "10px", fontFamily: "monospace", fontSize: "12px", color: "#cbd5e1" }}>
                            <h3 style={{ fontWeight: "bold", color: "#ffffff", fontSize: "14px", margin: 0 }}>Competitive Programming & Achievements</h3>
                            <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                                <li>LeetCode: saif619 (Active Problem Solver)</li>
                                <li>YoungTurks 2025 (Naukri) Finalist / Recognition</li>
                                <li>Codequezt #23 (Naukri) Holder</li>
                                <li>CodingNinjas Hackathon Contributor</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}