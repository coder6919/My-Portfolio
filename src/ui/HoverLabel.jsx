// HoverLabel.jsx
// The callout shown above a hovered object ("Calendar - Experience timeline").
// Pixel-styled to sit with the room: square corners, hard shadow, crisp text.
// Position is driven per frame by HoverTracker; this only re-renders when the
// hovered object changes.
import { useEffect, useSyncExternalStore } from "react";
import { hoverStore, labelElementRef } from "../interactions/hoverLabel";
import { useInteraction } from "../interactions/InteractionContext";

export default function HoverLabel() {
    const hover = useSyncExternalStore(hoverStore.subscribe, hoverStore.get, () => null);
    const { activePanel } = useInteraction();

    // A panel covers the room: drop any stale hover so it doesn't linger after closing.
    useEffect(() => {
        if (activePanel) hoverStore.set(null);
    }, [activePanel]);

    if (!hover || activePanel) return null;

    return (
        <div
            ref={(el) => {
                labelElementRef.current = el;
            }}
            // Starts hidden; HoverTracker positions it and fades it in on the next frame.
            style={{ opacity: 0 }}
            className="group pointer-events-none fixed left-0 top-0 z-40 select-none font-mono transition-opacity duration-150"
        >
            <div className="relative border-2 border-[#c99a4e] bg-[#141019]/95 px-2.5 py-1.5 shadow-[3px_3px_0_0_rgba(0,0,0,0.55)]">
                <div className="whitespace-nowrap text-[11px] font-bold tracking-wide text-[#f3e6c8]">{hover.label}</div>
                {hover.hint && <div className="whitespace-nowrap text-[10px] text-[#a3a8c0]">{hover.hint}</div>}
                {/* Arrow: points down at the object, or up when the label flips below it */}
                <div className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-[#c99a4e] bg-[#141019] group-data-[flip=true]:hidden" />
                <div className="absolute -top-[7px] left-1/2 hidden h-3 w-3 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-[#c99a4e] bg-[#141019] group-data-[flip=true]:block" />
            </div>
        </div>
    );
}
