// Succulent.jsx
// Small faceted ceramic pot with an echeveria-style rosette.
import * as THREE from "three";

const MATERIALS = {
    clay: new THREE.MeshStandardMaterial({ color: "#a65a40", roughness: 0.9, flatShading: true }),
    glaze: new THREE.MeshStandardMaterial({ color: "#d8cbb3", roughness: 0.45, flatShading: true }),
    soil: new THREE.MeshStandardMaterial({ color: "#2a1d17", roughness: 1 }),
    leafOuter: new THREE.MeshStandardMaterial({ color: "#7d9b6c", roughness: 0.75, flatShading: true }),
    leafInner: new THREE.MeshStandardMaterial({ color: "#9cb983", roughness: 0.7, flatShading: true }),
};

const GEOMETRY = {
    potBase: new THREE.CylinderGeometry(0.15, 0.12, 0.12, 6),
    potRim: new THREE.CylinderGeometry(0.175, 0.15, 0.13, 6),
    soil: new THREE.CylinderGeometry(0.15, 0.15, 0.02, 6),
    leaf: new THREE.OctahedronGeometry(1, 0),
};

// [count, tilt from vertical, length, width, material, phase]
const RINGS = [
    [7, 1.05, 0.12, 0.05, "leafOuter", 0],
    [5, 0.6, 0.1, 0.045, "leafInner", 0.4],
    [3, 0.25, 0.07, 0.035, "leafInner", 1.1],
];

function Succulent({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
    return (
        <group position={position} rotation={rotation}>
            <mesh geometry={GEOMETRY.potBase} material={MATERIALS.clay} position={[0, 0.06, 0]} castShadow receiveShadow />
            <mesh geometry={GEOMETRY.potRim} material={MATERIALS.glaze} position={[0, 0.185, 0]} castShadow receiveShadow />
            <mesh geometry={GEOMETRY.soil} material={MATERIALS.soil} position={[0, 0.245, 0]} />

            <group position={[0, 0.25, 0]}>
                {RINGS.map(([count, tilt, length, width, material, phase]) =>
                    Array.from({ length: count }, (_, i) => (
                        <group key={`${material}-${tilt}-${i}`} rotation={[0, phase + (i / count) * Math.PI * 2, 0]}>
                            <group rotation={[tilt, 0, 0]}>
                                <mesh
                                    geometry={GEOMETRY.leaf}
                                    material={MATERIALS[material]}
                                    position={[0, length * 0.9, 0]}
                                    scale={[width, length, width * 0.55]}
                                />
                            </group>
                        </group>
                    ))
                )}
            </group>
        </group>
    );
}

export default Succulent;
