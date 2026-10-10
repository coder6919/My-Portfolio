// Chair.jsx
// Office chair, seen mostly from behind. Five-star base on casters, gas lift,
// stepped cushioned seat, contoured backrest (its back faces the camera, so it
// gets an inset panel and stitching) and T-shaped armrests. The backrest
// stays below the character's shoulders so his arms remain visible.
// Seat top is at y = 1.73 (CharacterLegs and the sprite rely on it).
import * as THREE from "three";
import { getMaterials } from "./textures/materials";
import { PixelBox, PixelBeam } from "./textures/PixelBox";
import { PALETTE } from "./textures/palette";

const METAL = new THREE.MeshStandardMaterial({ color: "#2a2d36", metalness: 0.6, roughness: 0.45 });
const CHROME = new THREE.MeshStandardMaterial({ color: "#6d7280", metalness: 0.85, roughness: 0.3 });
const WHEEL = new THREE.MeshStandardMaterial({ color: "#121318", roughness: 0.8 });
const STITCH = new THREE.MeshStandardMaterial({ color: PALETTE.navyLight, roughness: 0.8 });

const SPOKES = Array.from({ length: 5 }, (_, i) => {
    const a = Math.PI / 2 + (i / 5) * Math.PI * 2;
    return [Math.cos(a) * 0.85, Math.sin(a) * 0.85];
});

function Chair({ position = [-0.85, 0, 1.45], rotation = [0, -0.35, 0] }) {
    const m = getMaterials();

    return (
        <group position={position} rotation={rotation}>
            {/* ---------------- base ---------------- */}
            <mesh material={METAL} position={[0, 0.24, 0]} castShadow>
                <cylinderGeometry args={[0.16, 0.18, 0.14, 8]} />
            </mesh>
            {SPOKES.map(([x, z]) => (
                <group key={`${x}`}>
                    <PixelBeam from={[0, 0.24, 0]} to={[x, 0.16, z]} thickness={0.12} material={METAL} castShadow />
                    {/* Caster: fork and wheel */}
                    <mesh material={METAL} position={[x, 0.13, z]}>
                        <boxGeometry args={[0.1, 0.08, 0.1]} />
                    </mesh>
                    <mesh material={WHEEL} position={[x, 0.07, z]} rotation={[0, Math.atan2(x, z), Math.PI / 2]} castShadow>
                        <cylinderGeometry args={[0.07, 0.07, 0.08, 8]} />
                    </mesh>
                </group>
            ))}

            {/* Gas lift: dark sleeve over a chrome piston */}
            <mesh material={METAL} position={[0, 0.55, 0]} castShadow>
                <cylinderGeometry args={[0.11, 0.12, 0.5, 8]} />
            </mesh>
            <mesh material={CHROME} position={[0, 1.05, 0]} castShadow>
                <cylinderGeometry args={[0.07, 0.07, 0.6, 8]} />
            </mesh>
            {/* Tilt mechanism and lever */}
            <mesh material={METAL} position={[0, 1.36, 0]} castShadow>
                <boxGeometry args={[0.8, 0.12, 0.7]} />
            </mesh>
            <PixelBeam from={[0.35, 1.34, -0.1]} to={[0.75, 1.3, -0.25]} thickness={0.04} material={CHROME} />

            {/* ---------------- seat (stepped edges read as a padded cushion) ---------------- */}
            <PixelBox size={[2.0, 0.16, 1.9]} material={m.chairShell} position={[0, 1.5, -0.05]} castShadow />
            <PixelBox size={[1.9, 0.12, 1.8]} material={m.chairFabric} grain={false} position={[0, 1.61, -0.06]} castShadow receiveShadow />
            <PixelBox size={[1.74, 0.06, 1.62]} material={m.chairFabric} grain={false} position={[0, 1.7, -0.08]} receiveShadow />

            {/* ---------------- backrest ---------------- */}
            <PixelBox size={[0.3, 0.32, 0.14]} material={m.chairShell} position={[0, 1.82, 0.92]} castShadow />
            {/* Shell, with side wings angled forward so it reads as contoured */}
            <PixelBox size={[1.6, 0.95, 0.16]} material={m.chairShell} position={[0, 2.3, 0.84]} castShadow />
            <PixelBox size={[0.16, 0.88, 0.26]} material={m.chairShell} position={[-0.84, 2.3, 0.74]} rotation={[0, -0.35, 0]} castShadow />
            <PixelBox size={[0.16, 0.88, 0.26]} material={m.chairShell} position={[0.84, 2.3, 0.74]} rotation={[0, 0.35, 0]} castShadow />
            {/* Padded top roll */}
            <PixelBox size={[1.56, 0.14, 0.26]} material={m.chairFabric} grain={false} position={[0, 2.8, 0.8]} castShadow />
            {/* Front cushion (against his back) */}
            <PixelBox size={[1.42, 0.82, 0.16]} material={m.chairFabric} grain={false} position={[0, 2.3, 0.7]} castShadow />
            {/* Rear: inset fabric panel with two lines of accent stitching */}
            <PixelBox size={[1.2, 0.6, 0.02]} material={m.chairFabric} grain={false} position={[0, 2.26, 0.93]} />
            <mesh material={STITCH} position={[-0.42, 2.26, 0.945]}>
                <boxGeometry args={[0.03, 0.56, 0.01]} />
            </mesh>
            <mesh material={STITCH} position={[0.42, 2.26, 0.945]}>
                <boxGeometry args={[0.03, 0.56, 0.01]} />
            </mesh>

            {/* ---------------- armrests (T-shaped) ---------------- */}
            {[-1, 1].map((side) => (
                <group key={side}>
                    <PixelBox size={[0.34, 0.08, 0.16]} material={m.chairShell} position={[side * 0.88, 1.48, 0.15]} />
                    <PixelBox size={[0.12, 0.6, 0.16]} material={m.chairShell} position={[side * 1.0, 1.8, 0.15]} castShadow />
                    <PixelBox size={[0.26, 0.1, 1.05]} material={m.chairShell} position={[side * 1.0, 2.14, 0.0]} castShadow />
                    <PixelBox size={[0.22, 0.04, 0.95]} material={m.chairFabric} grain={false} position={[side * 1.0, 2.2, 0.0]} />
                </group>
            ))}
        </group>
    );
}

export default Chair;
