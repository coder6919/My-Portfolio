// CharacterLegs.jsx
// The seated character's legs. The sprite ends at the hips: from the room
// camera (behind and above) the legs run forward under the desk, so they're
// real geometry that sits on the actual floor and takes the scene lighting.
// Placed in the chair's local frame (forward is -Z); colours match the sprite.
import * as THREE from "three";

const MATERIALS = {
    trousers: new THREE.MeshStandardMaterial({ color: "#262a3a", roughness: 0.95 }),
    shoe: new THREE.MeshStandardMaterial({ color: "#1e1c22", roughness: 0.8 }),
    sole: new THREE.MeshStandardMaterial({ color: "#8a8580", roughness: 0.9 }),
};

const GEOMETRY = {
    thigh: new THREE.BoxGeometry(0.4, 0.3, 1.0),
    shin: new THREE.BoxGeometry(0.32, 1.62, 0.34),
    shoe: new THREE.BoxGeometry(0.36, 0.16, 0.62),
    sole: new THREE.BoxGeometry(0.38, 0.05, 0.64),
};

function Leg({ x }) {
    return (
        <group position={[x, 0, 0]}>
            <mesh geometry={GEOMETRY.thigh} material={MATERIALS.trousers} position={[0, 1.88, -0.5]} castShadow />
            <mesh geometry={GEOMETRY.shin} material={MATERIALS.trousers} position={[0, 0.98, -0.98]} rotation={[-0.08, 0, 0]} castShadow />
            <mesh geometry={GEOMETRY.shoe} material={MATERIALS.shoe} position={[0, 0.11, -1.12]} castShadow />
            <mesh geometry={GEOMETRY.sole} material={MATERIALS.sole} position={[0, 0.025, -1.12]} />
        </group>
    );
}

function CharacterLegs({ position = [-0.85, 0, 1.45], rotation = [0, -0.35, 0] }) {
    return (
        <group position={position} rotation={rotation}>
            <Leg x={-0.24} />
            <Leg x={0.24} />
        </group>
    );
}

export default CharacterLegs;
