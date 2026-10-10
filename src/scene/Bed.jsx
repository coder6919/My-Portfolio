// Bed.jsx
// Bed on the right, after the reference: wooden frame on legs with a slatted
// headboard and low footboard, a patchwork quilt draping over the sides, two
// pillows and a cushion, and a nightstand with a small lamp and alarm clock.
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { PixelBox } from "./textures/PixelBox";
import { getMaterials } from "./textures/materials";
import { clockFace } from "./textures/textTextures";
import { PALETTE } from "./textures/palette";

// The quilt top sits at this height (the cat sleeps on it).
export const QUILT_TOP = 1.29;

const CUSHION = new THREE.MeshStandardMaterial({ color: PALETTE.rust, roughness: 0.95 });
const LAMP_METAL = new THREE.MeshStandardMaterial({ color: "#2a2620", roughness: 0.5, metalness: 0.4 });
// Small bedside lamp: glows on its own (no extra light in the scene).
const LAMP_SHADE = new THREE.MeshStandardMaterial({
    color: PALETTE.cream,
    emissive: "#ffb066",
    emissiveIntensity: 0.9,
    roughness: 0.9,
    side: THREE.DoubleSide,
});
const CLOCK_BODY = new THREE.MeshStandardMaterial({ color: "#2b2f3a", roughness: 0.6 });
const KNOB = new THREE.MeshStandardMaterial({ color: "#8a6a40", roughness: 0.4, metalness: 0.5 });

function Nightstand(props) {
    const m = getMaterials();
    const clockMaterial = useMemo(() => {
        const mat = new THREE.MeshBasicMaterial({ map: clockFace() });
        mat.color.setScalar(1.4); // the digits glow
        return mat;
    }, []);
    useEffect(() => () => clockMaterial.dispose(), [clockMaterial]);

    return (
        <group {...props}>
            <PixelBox size={[1.2, 1.46, 1.2]} material={m.wood} position={[0, 0.73, 0]} castShadow receiveShadow />
            <PixelBox size={[1.3, 0.08, 1.3]} material={m.woodDark} position={[0, 1.5, 0]} castShadow receiveShadow />
            <PixelBox size={[1.0, 0.42, 0.05]} material={m.woodDark} position={[0, 1.05, 0.62]} />
            <mesh material={KNOB} position={[0, 1.05, 0.66]}>
                <boxGeometry args={[0.12, 0.06, 0.05]} />
            </mesh>

            {/* Lamp */}
            <mesh material={LAMP_METAL} position={[-0.25, 1.58, -0.15]} castShadow>
                <cylinderGeometry args={[0.16, 0.18, 0.08, 8]} />
            </mesh>
            <mesh material={LAMP_METAL} position={[-0.25, 1.8, -0.15]}>
                <cylinderGeometry args={[0.025, 0.025, 0.4, 6]} />
            </mesh>
            <mesh material={LAMP_SHADE} position={[-0.25, 2.06, -0.15]} castShadow>
                <cylinderGeometry args={[0.16, 0.26, 0.3, 8, 1, true]} />
            </mesh>

            {/* Alarm clock */}
            <mesh material={CLOCK_BODY} position={[0.25, 1.65, 0.1]} rotation={[0, -0.35, 0]} castShadow>
                <boxGeometry args={[0.38, 0.22, 0.14]} />
                <mesh material={clockMaterial} position={[0, 0, 0.071]}>
                    <planeGeometry args={[0.32, 0.12]} />
                </mesh>
            </mesh>
        </group>
    );
}

// Bed width (x) and length (z). The head end sits against the back wall.
const W = 3.6;
const L = 5.5;

function Bed({ position = [6.0, 0, -2.0], rotation = [0, 0, 0] }) {
    const m = getMaterials();
    const slats = [-1.25, -0.75, -0.25, 0.25, 0.75, 1.25];
    const half = W / 2;

    return (
        <group position={position} rotation={rotation}>
            {/* ---------------- frame ---------------- */}
            {[[-half + 0.15, -L / 2 + 0.15], [half - 0.15, -L / 2 + 0.15], [-half + 0.15, L / 2 - 0.15], [half - 0.15, L / 2 - 0.15]].map(([x, z]) => (
                <PixelBox key={`${x}${z}`} size={[0.26, 0.4, 0.26]} material={m.woodDark} position={[x, 0.2, z]} castShadow />
            ))}
            <PixelBox size={[W, 0.4, L]} material={m.wood} position={[0, 0.55, 0]} castShadow receiveShadow />

            {/* Footboard */}
            <PixelBox size={[W + 0.16, 0.62, 0.16]} material={m.wood} position={[0, 0.66, L / 2 + 0.05]} castShadow receiveShadow />
            <PixelBox size={[W + 0.24, 0.1, 0.22]} material={m.woodDark} position={[0, 1.0, L / 2 + 0.05]} castShadow />

            {/* Headboard: posts, rails and slats */}
            <PixelBox size={[0.26, 2.7, 0.3]} material={m.woodDark} position={[-half - 0.02, 1.35, -L / 2 + 0.07]} castShadow />
            <PixelBox size={[0.26, 2.7, 0.3]} material={m.woodDark} position={[half + 0.02, 1.35, -L / 2 + 0.07]} castShadow />
            <PixelBox size={[W + 0.46, 0.24, 0.34]} material={m.wood} position={[0, 2.62, -L / 2 + 0.07]} castShadow receiveShadow />
            <PixelBox size={[W, 0.18, 0.2]} material={m.wood} position={[0, 1.0, -L / 2 + 0.05]} castShadow />
            {slats.map((x) => (
                <PixelBox key={x} size={[0.32, 1.42, 0.08]} material={m.wood} position={[x, 1.8, -L / 2 + 0.01]} castShadow receiveShadow />
            ))}

            {/* ---------------- bedding ---------------- */}
            <PixelBox size={[W - 0.2, 0.42, L - 0.2]} material={m.linen} grain={false} position={[0, 0.96, 0]} castShadow receiveShadow />

            {/* Quilt: top plus the parts draping over the sides and the foot */}
            <PixelBox size={[W + 0.04, 0.12, 3.9]} material={m.quilt} grain={false} position={[0, QUILT_TOP - 0.06, 0.65]} castShadow receiveShadow />
            <PixelBox size={[0.08, 0.56, 3.9]} material={m.quilt} grain={false} position={[-half - 0.02, 0.97, 0.65]} castShadow />
            <PixelBox size={[0.08, 0.56, 3.9]} material={m.quilt} grain={false} position={[half + 0.02, 0.97, 0.65]} castShadow />
            <PixelBox size={[W + 0.04, 0.5, 0.08]} material={m.quilt} grain={false} position={[0, 1.0, 2.6]} castShadow />
            {/* Folded-back edge */}
            <PixelBox size={[W + 0.08, 0.16, 0.5]} material={m.linen} grain={false} position={[0, QUILT_TOP + 0.02, -1.25]} castShadow receiveShadow />

            {/* Pillows and a cushion */}
            <PixelBox size={[1.5, 0.3, 0.95]} material={m.linen} grain={false} position={[-0.83, 1.33, -1.98]} rotation={[0.18, 0.05, 0]} castShadow />
            <PixelBox size={[1.5, 0.3, 0.95]} material={m.linen} grain={false} position={[0.83, 1.33, -1.98]} rotation={[0.18, -0.06, 0]} castShadow />
            <mesh material={CUSHION} position={[0.45, 1.5, -1.55]} rotation={[-0.5, -0.2, 0.08]} castShadow>
                <boxGeometry args={[0.8, 0.52, 0.22]} />
            </mesh>

            {/* Nightstand to the right, against the side wall */}
            <Nightstand position={[half + 0.58, 0, -L / 2 + 0.6]} scale={[0.8, 1, 0.8]} />
        </group>
    );
}

export default Bed;
