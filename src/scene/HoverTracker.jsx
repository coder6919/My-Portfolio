// HoverTracker.jsx
// Keeps the hover label pinned to the hovered object: projects its 3D anchor
// to the screen every frame and writes the transform directly. The label sits
// above the object, flips below it when it would run into the top HUD, and
// is clamped so it never leaves the screen.
import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { hoverStore, labelElementRef } from "../interactions/hoverLabel";

const TOP_SAFE = 76; // px kept clear for the HUD's top bar
const GAP = 12; // px between the object and the label's arrow
const EDGE = 8; // px kept from the screen edges

function toScreen(point, vector, camera, size) {
    point.copy(vector).project(camera);
    return { x: ((point.x + 1) / 2) * size.width, y: ((1 - point.y) / 2) * size.height };
}

function HoverTracker() {
    const point = useMemo(() => new THREE.Vector3(), []);

    useFrame(({ camera, size }) => {
        const el = labelElementRef.current;
        const hover = hoverStore.get();
        if (!el || !hover) return;

        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const above = toScreen(point, hover.anchor, camera, size);
        const flip = above.y - GAP - h < TOP_SAFE;
        const at = flip ? toScreen(point, hover.anchorBelow, camera, size) : above;

        const x = Math.round(THREE.MathUtils.clamp(at.x, w / 2 + EDGE, size.width - w / 2 - EDGE));
        const y = Math.round(flip ? at.y + GAP : at.y - GAP - h);
        el.style.transform = `translate(${x - Math.round(w / 2)}px, ${y}px)`;
        el.dataset.flip = String(flip);
        el.style.opacity = "1";
    });

    return null;
}

export default HoverTracker;
