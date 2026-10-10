// ActiveModals.jsx
import { useEffect } from "react";
import { useInteraction } from "../interactions/InteractionContext";
import TerminalModal from "./TerminalModal";
import FolderModal from "./FolderModal";
import TimelineModal from "./TimelineModal";
import BooksModal from "./BooksModal";
import PhoneModal from "./PhoneModal";

export default function ActiveModals() {
    const { activePanel, activeCategory, closePanel } = useInteraction();

    // Every modal advertises "Press ESC"; handle it once here.
    useEffect(() => {
        if (!activePanel) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") closePanel();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [activePanel, closePanel]);

    if (!activePanel) return null;

    let modalContent = null;

    if (activePanel === "monitor") {
        modalContent = <TerminalModal onClose={closePanel} initialCommand={activeCategory || "whoami"} />;
    } else if (activePanel === "drawer") {
        modalContent = <FolderModal category={activeCategory || "Projects"} onClose={closePanel} />;
    } else if (activePanel === "calendar") {
        modalContent = <TimelineModal onClose={closePanel} />;
    } else if (activePanel === "books") {
        modalContent = <BooksModal onClose={closePanel} />;
    } else if (activePanel === "phone") {
        modalContent = <PhoneModal onClose={closePanel} />;
    }

    if (!modalContent) return null;

    // Render inside a guaranteed top-level stacking container overlay
    return (
        <div className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center">
            {modalContent}
        </div>
    );
}