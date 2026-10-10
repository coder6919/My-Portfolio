// Keyboard.jsx
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function Keyboard({ position = [-0.1, 2.525, 0.1], rotation = [0, -0.08, 0], mouseOffset = 1.35 }) {
    const underglowRef = useRef(null);

    // High-contrast pixel-art keycaps texture with visible individual keys
    const keycapsTexture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 48;
        const ctx = canvas.getContext("2d");

        // Base plate between keys
        ctx.fillStyle = "#0d0f14";
        ctx.fillRect(0, 0, 128, 48);

        // Draw individual tactile keycaps
        for (let row = 0; row < 5; row++) {
            const y = 3 + row * 9;
            for (let col = 0; col < 14; col++) {
                const x = 3 + col * 9;

                // Accent colors for spacebar and escape
                if (row === 4 && col >= 3 && col <= 9) {
                    ctx.fillStyle = "#3d5076"; // Spacebar
                } else if ((row === 0 && col === 0) || (row === 0 && col === 13)) {
                    ctx.fillStyle = "#9c5838"; // Esc / Enter accents
                } else {
                    ctx.fillStyle = "#2c3242"; // Standard keycap face
                }

                ctx.fillRect(x, y, 7, 6);

                // Tiny top highlight on each keycap for 3D depth illusion
                ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
                ctx.fillRect(x, y, 7, 1);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        return texture;
    }, []);

    // Faint warm underglow that breathes slowly (no rainbow cycling: it
    // pulled focus from the rest of the night scene).
    useFrame(({ clock }) => {
        if (underglowRef.current) {
            const breath = 0.32 + Math.sin(clock.getElapsedTime() * 0.8) * 0.06;
            underglowRef.current.material.color.setHSL(0.08, 0.55, breath);
        }
    });

    return (
        <group position={position} rotation={rotation}>
            {/* Extended Desk Mat */}
            <mesh position={[0, 0.01, -0.05]} receiveShadow>
                <boxGeometry args={[3.8, 0.02, 1.4]} />
                <meshStandardMaterial color="#11131a" roughness={0.95} />
            </mesh>

            {/* Mechanical Keyboard Chassis Body */}
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.9, 0.07, 0.75]} />
                <meshStandardMaterial color="#181a24" roughness={0.7} />
            </mesh>

            {/* Tactile Keycap Block Mesh */}
            <mesh position={[0, 0.092, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.82, 0.04, 0.68]} />
                <meshStandardMaterial
                    map={keycapsTexture}
                    roughness={0.5}
                    metalness={0.1}
                />
            </mesh>

            {/* Sleek RGB Underglow Diffuser Strip around base */}
            <mesh ref={underglowRef} position={[0, 0.02, 0]}>
                <boxGeometry args={[1.94, 0.015, 0.79]} />
                <meshBasicMaterial color="#3b82f6" />
            </mesh>

            {/* Mouse Body */}
            <mesh position={[mouseOffset, 0.05, 0.02]} castShadow receiveShadow>
                <boxGeometry args={[0.26, 0.08, 0.42]} />
                <meshStandardMaterial color="#1a1c24" roughness={0.7} />
            </mesh>

            {/* Mouse Scroll Wheel */}
            <mesh position={[mouseOffset, 0.085, -0.06]}>
                <boxGeometry args={[0.04, 0.03, 0.1]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.4} />
            </mesh>

            {/* Mouse LED Accent */}
            <mesh position={[mouseOffset, 0.065, 0.1]}>
                <boxGeometry args={[0.16, 0.02, 0.04]} />
                <meshBasicMaterial color="#38bdf8" />
            </mesh>
        </group>
    );
}

export default Keyboard;