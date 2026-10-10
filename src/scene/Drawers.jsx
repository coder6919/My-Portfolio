// Drawers.jsx
import { useState, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useInteraction } from "../interactions/InteractionContext";
import { PixelBox } from "./textures/PixelBox";
import { getMaterials } from "./textures/materials";
import { drawerLabel } from "./textures/textTextures";
import { hoverHandlers } from "../interactions/hoverLabel";

const DRAWER_LABELS = [
    { label: "Projects", accent: "#d39a35" },
    { label: "Skills", accent: "#4a78b8" },
    { label: "Education", accent: "#4f9a6e" },
    { label: "Other", accent: "#8a5a9a" },
];

function Drawers({ position = [2.35, 0, -0.37] }) {
    const { openPanel, activePanel, activeCategory, closePanel } = useInteraction();
    const [localActiveDrawer, setLocalActiveDrawer] = useState(null);
    const materials = getMaterials();

    const d0 = useRef(null);
    const d1 = useRef(null);
    const d2 = useRef(null);
    const d3 = useRef(null);
    const drawerRefs = [d0, d1, d2, d3];

    // Automatically close physical drawers when global modal panel is closed
    useEffect(() => {
        if (!activePanel || activePanel !== "drawer") {
            setLocalActiveDrawer(null);
        }
    }, [activePanel]);

    const labelTextures = useMemo(
        () => DRAWER_LABELS.map(({ label, accent }) => drawerLabel(label, accent)),
        []
    );

    useFrame((_, delta) => {
        drawerRefs.forEach((ref, idx) => {
            if (!ref.current) return;
            const label = ["Projects", "Skills", "Education", "Other"][idx];
            const isOpen = activePanel === "drawer" && activeCategory === label;
            const targetZ = isOpen || localActiveDrawer === idx ? 0.42 : 0.0;

            ref.current.position.z = THREE.MathUtils.lerp(
                ref.current.position.z,
                targetZ,
                1 - Math.exp(-delta * 12)
            );
        });
    });

    const handleDrawerToggle = (idx, label) => {
        const isOpen = activePanel === "drawer" && activeCategory === label;
        if (isOpen || localActiveDrawer === idx) {
            closePanel();
            setLocalActiveDrawer(null);
        } else {
            setLocalActiveDrawer(idx);
            // Slide drawer open first, then trigger modal after 280ms animation delay
            setTimeout(() => {
                openPanel("drawer", label);
            }, 280);
        }
    };

    const drawerConfig = [
        { label: "Projects", y: 1.82 },
        { label: "Skills", y: 1.34 },
        { label: "Education", y: 0.86 },
        { label: "Other", y: 0.38 },
    ];

    return (
        <group position={position}>
            {/* Outer Cabinet Shell */}
            <PixelBox size={[1.35, 2.2, 1.75]} material={materials.woodDark} position={[0, 1.15, 0.05]} castShadow receiveShadow />

            {/* Individual Drawers */}
            {drawerConfig.map((item, idx) => (
                <group
                    key={item.label}
                    ref={drawerRefs[idx]}
                    position={[0, item.y, 0]}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDrawerToggle(idx, item.label);
                    }}
                    {...hoverHandlers(item.label, "Open drawer")}
                >
                    {/* Drawer Front Panel */}
                    <PixelBox size={[1.2, 0.42, 0.08]} material={materials.wood} position={[0, 0, 0.92]} castShadow receiveShadow />

                    {/* Drawer Label Badge */}
                    <mesh position={[0, 0.05, 0.97]}>
                        <planeGeometry args={[1.12, 0.28]} />
                        <meshBasicMaterial map={labelTextures[idx]} />
                    </mesh>

                    {/* Metal Pull Handle */}
                    <mesh position={[0, -0.15, 0.98]} castShadow>
                        <boxGeometry args={[0.34, 0.05, 0.06]} />
                        <meshStandardMaterial color="#6b5b50" metalness={0.7} roughness={0.4} />
                    </mesh>

                    {/* Inside box container */}
                    <mesh position={[0, -0.05, 0.35]}>
                        <boxGeometry args={[1.1, 0.32, 1.0]} />
                        <meshStandardMaterial color="#2d1e1a" roughness={0.95} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

export default Drawers;