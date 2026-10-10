// Monitor.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useInteraction } from "../interactions/InteractionContext";
import { monitorScreen, MONITOR_CURSOR } from "./textures/textTextures";

const SCREEN = { width: 3.42, height: 2.12, y: 1.6, z: 0.14 };
// Cursor cell of the screen texture, mapped onto the screen plane.
const CURSOR = {
    x: -SCREEN.width / 2 + ((MONITOR_CURSOR.x + MONITOR_CURSOR.w / 2) / MONITOR_CURSOR.width) * SCREEN.width,
    y: SCREEN.y + SCREEN.height / 2 - ((MONITOR_CURSOR.y + MONITOR_CURSOR.h / 2) / MONITOR_CURSOR.height) * SCREEN.height,
    w: (MONITOR_CURSOR.w / MONITOR_CURSOR.width) * SCREEN.width,
    h: (MONITOR_CURSOR.h / MONITOR_CURSOR.height) * SCREEN.height,
};
import { StickyNote } from "./DeskNotes";

function Monitor({ position = [0.2, 2.525, -0.7], rotation = [0, -0.12, 0] }) {
    const { openPanel, closePanel, activePanel } = useInteraction();

    const screenTexture = monitorScreen();
    const cursorRef = useRef(null);

    // Terminal cursor blink.
    useFrame(({ clock }) => {
        if (cursorRef.current) cursorRef.current.visible = Math.floor(clock.getElapsedTime() * 1.8) % 2 === 0;
    });

    const handleClick = (e) => {
        e.stopPropagation();
        if (activePanel === "monitor") {
            closePanel();
        } else {
            openPanel("monitor", "whoami");
        }
    };

    return (
        <group
            position={position}
            rotation={rotation}
            onClick={handleClick}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "default")}
        >
            {/* Monitor Stand Base */}
            <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.2, 0.08, 0.9]} />
                <meshStandardMaterial color="#1a1c23" metalness={0.4} roughness={0.7} />
            </mesh>

            {/* Monitor Stand Stem */}
            <mesh position={[0, 0.75, -0.1]} castShadow>
                <boxGeometry args={[0.22, 1.4, 0.16]} />
                <meshStandardMaterial color="#161820" metalness={0.5} roughness={0.6} />
            </mesh>

            {/* Monitor Mount / Hinge */}
            <mesh position={[0, 1.35, -0.04]} castShadow>
                <boxGeometry args={[0.4, 0.35, 0.14]} />
                <meshStandardMaterial color="#222530" metalness={0.4} roughness={0.6} />
            </mesh>

            {/* Monitor Frame / Bezel */}
            <mesh position={[0, 1.6, 0.06]} castShadow>
                <boxGeometry args={[3.6, 2.3, 0.14]} />
                <meshStandardMaterial color="#121318" roughness={0.9} />
            </mesh>

            {/* Screen Mesh */}
            <mesh position={[0, SCREEN.y, SCREEN.z]}>
                <planeGeometry args={[SCREEN.width, SCREEN.height]} />
                <meshBasicMaterial map={screenTexture} />
            </mesh>
            <mesh ref={cursorRef} position={[CURSOR.x, CURSOR.y, SCREEN.z + 0.002]}>
                <planeGeometry args={[CURSOR.w, CURSOR.h]} />
                <meshBasicMaterial color="#5fd38d" />
            </mesh>

            {/* Reminder stuck to the bezel corner */}
            <StickyNote position={[1.66, 2.62, 0.15]} rotation={[0, 0, -0.12]} size={0.24} />

            {/* Soft Screen Glow PointLight */}
            <pointLight
                position={[0, 1.6, 0.45]}
                color="#60a5fa"
                intensity={1.2}
                distance={3.5}
                decay={2}
            />
        </group>
    );
}

export default Monitor;