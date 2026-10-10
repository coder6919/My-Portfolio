import { useMemo } from "react";
import * as THREE from "three";
import { useHoverLabel } from "../interactions/hoverLabel";

/**
 * 3D Smartphone on the workstation desk
 * Displays social/contact hub (GitHub, LinkedIn, Email)
 * Positioned on the desk surface (y = 2.525) to the right of keyboard
 */
function Phone({ position = [1.9, 2.525, 0.15], rotation = [0, 0.25, 0], onClick = null }) {
    const hover = useHoverLabel("Phone", "Contact & socials");
    const handleClick = (e) => {
        e.stopPropagation();
        onClick?.(e);
    };

    const screenTexture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");

        // Dark lockscreen
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, 64, 128);

        // Status bar clock
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("23:55", 32, 18);

        // Social app icon row
        // GitHub
        ctx.fillStyle = "#334155";
        ctx.fillRect(8, 45, 12, 12);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8px monospace";
        ctx.fillText("GH", 14, 54);

        // LinkedIn
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(26, 45, 12, 12);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("IN", 32, 54);

        // Mail
        ctx.fillStyle = "#ea580c";
        ctx.fillRect(44, 45, 12, 12);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("@", 50, 54);

        // Contact label
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 7px monospace";
        ctx.fillText("CONTACT", 32, 78);

        // Notification dot
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(32, 95, 3, 0, Math.PI * 2);
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        return texture;
    }, []);

    return (
        <group position={position} rotation={rotation} onClick={handleClick} {...hover}>
            {/* Phone Body / Aluminum frame */}
            <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.36, 0.03, 0.7]} />
                <meshStandardMaterial color="#1e222d" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Screen Glass Face */}
            <mesh position={[0, 0.038, 0]}>
                <planeGeometry args={[0.32, 0.65]} rotation={[-Math.PI / 2, 0, 0]} />
                <meshBasicMaterial map={screenTexture} />
            </mesh>

            {/* Subtle screen glow */}
            <pointLight
                position={[0, 0.15, 0]}
                color="#38bdf8"
                intensity={0.25}
                distance={1.0}
            />
        </group>
    );
}

export default Phone;
