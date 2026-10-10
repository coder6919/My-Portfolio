// Foliage.jsx
// Low-poly plant pieces shared by the shelves, sill and nightstand: a leafy
// clump and a trailing vine that hangs over an edge. Deterministic layouts
// (seeded) so plants don't change between renders.
import { useMemo } from "react";
import * as THREE from "three";
import { PALETTE as P } from "./textures/palette";

const LEAF_MATERIALS = [
    new THREE.MeshStandardMaterial({ color: P.sage, roughness: 0.8, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: P.sageLight, roughness: 0.8, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: "#3f5a3d", roughness: 0.85, flatShading: true }),
];
const LEAF = new THREE.OctahedronGeometry(1, 0);
const STEM = new THREE.MeshStandardMaterial({ color: "#3a4a2c", roughness: 0.9 });

function rng(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** A rounded clump of leaves (pot plants). */
export function LeafClump({ radius = 0.3, count = 14, seed = 1, ...props }) {
    const leaves = useMemo(() => {
        const rand = rng(seed);
        return Array.from({ length: count }, () => {
            const theta = rand() * Math.PI * 2;
            const r = radius * (0.35 + rand() * 0.65);
            return {
                position: [Math.cos(theta) * r, rand() * radius * 0.9, Math.sin(theta) * r],
                rotation: [rand() * 0.8, theta, 0.6 + rand() * 0.6],
                scale: [radius * 0.32, radius * 0.12, radius * 0.22],
                material: LEAF_MATERIALS[Math.floor(rand() * LEAF_MATERIALS.length)],
            };
        });
    }, [radius, count, seed]);
    return (
        <group {...props}>
            {leaves.map((leaf, i) => (
                <mesh key={i} geometry={LEAF} material={leaf.material} position={leaf.position} rotation={leaf.rotation} scale={leaf.scale} castShadow />
            ))}
        </group>
    );
}

/**
 * Vines hanging down from the group origin (over a shelf or sill edge).
 * Each strand drifts slightly outward as it falls.
 */
export function TrailingVine({ strands = 3, length = 1.4, spread = 0.5, seed = 7, ...props }) {
    const parts = useMemo(() => {
        const rand = rng(seed);
        const out = [];
        for (let s = 0; s < strands; s++) {
            const x0 = (s / Math.max(1, strands - 1) - 0.5) * spread;
            const strandLength = length * (0.6 + rand() * 0.4);
            const drift = (rand() - 0.5) * 0.25;
            const steps = Math.round(strandLength / 0.12);
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                out.push({
                    position: [x0 + drift * t, -t * strandLength, 0.02 + t * 0.08],
                    rotation: [rand(), rand() * Math.PI, 0.5 + rand()],
                    scale: [0.07, 0.03, 0.05].map((v) => v * (1 - t * 0.35)),
                    material: LEAF_MATERIALS[(i + s) % LEAF_MATERIALS.length],
                });
            }
            out.push({ stem: true, x: x0 + drift / 2, length: strandLength });
        }
        return out;
    }, [strands, length, spread, seed]);
    return (
        <group {...props}>
            {parts.map((p, i) =>
                p.stem ? (
                    <mesh key={i} material={STEM} position={[p.x, -p.length / 2, 0.04]}>
                        <boxGeometry args={[0.015, p.length, 0.015]} />
                    </mesh>
                ) : (
                    <mesh key={i} geometry={LEAF} material={p.material} position={p.position} rotation={p.rotation} scale={p.scale} castShadow />
                )
            )}
        </group>
    );
}
