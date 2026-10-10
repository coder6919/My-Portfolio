// InteractionContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const InteractionContext = createContext(null);

export function InteractionProvider({ children }) {
    const [activePanel, setActivePanelState] = useState(null); // 'monitor' | 'drawer' | 'books' | 'calendar' | 'phone'
    const [activeCategory, setActiveCategory] = useState("whoami");
    const [selectedProject, setSelectedProject] = useState(null);
    const [lampOn, setLampOn] = useState(true);
    const [focusedTarget, setFocusedTarget] = useState("room"); // 'room' | 'monitor'

    const openPanel = useCallback((panel, category = null, project = null) => {
        setActivePanelState(panel);
        if (category) {
            setActiveCategory(category);
        }
        if (project) {
            setSelectedProject(project);
        }
        if (panel === "monitor") {
            setFocusedTarget("monitor");
        } else {
            setFocusedTarget("room");
        }
    }, []);

    const closePanel = useCallback(() => {
        setActivePanelState(null);
        setSelectedProject(null);
        setFocusedTarget("room");
    }, []);

    const toggleLamp = useCallback(() => {
        setLampOn((prev) => !prev);
    }, []);

    const value = {
        activePanel,
        activeCategory,
        selectedProject,
        lampOn,
        focusedTarget,
        openPanel,
        closePanel,
        setFocusedTarget,
        setActiveCategory,
        setSelectedProject,
        toggleLamp,
    };

    return (
        <InteractionContext.Provider value={value}>
            {children}
        </InteractionContext.Provider>
    );
}

export function useInteraction() {
    const context = useContext(InteractionContext);
    if (!context) {
        throw new Error("useInteraction must be used within an InteractionProvider");
    }
    return context;
}