import { getMaterials } from "./textures/materials";

/**
 * Atmospheric Room Props:
 * - Woven floor rug under the chair/desk area
 * - Developer Backpack on the floor leaning against desk drawer
 */
function RoomProps() {
    const m = getMaterials();

    return (
        <group>
            {/* Woven Floor Rug */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[-0.4, 0.015, 1.4]}
                receiveShadow
            >
                <planeGeometry args={[5.8, 4.4]} />
                <primitive object={m.rug} attach="material" />
            </mesh>

            {/* Developer Backpack on floor leaning against desk unit */}
            <group position={[0.95, 0, 1.05]} rotation={[0, -0.4, 0.12]}>
                {/* Main compartment */}
                <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.75, 1.05, 0.55]} />
                    <meshStandardMaterial color="#1a202c" roughness={0.9} />
                </mesh>
                {/* Front zippered pouch */}
                <mesh position={[0, 0.38, 0.3]} castShadow>
                    <boxGeometry args={[0.58, 0.62, 0.16]} />
                    <meshStandardMaterial color="#242c3d" roughness={0.85} />
                </mesh>
                {/* Tech / Cross patch */}
                <mesh position={[0, 0.45, 0.39]}>
                    <planeGeometry args={[0.16, 0.16]} />
                    <meshBasicMaterial color="#38bdf8" />
                </mesh>
                {/* Top handle loop */}
                <mesh position={[0, 1.12, -0.05]} castShadow>
                    <boxGeometry args={[0.22, 0.1, 0.08]} />
                    <meshStandardMaterial color="#111827" />
                </mesh>
            </group>
        </group>
    );
}

export default RoomProps;
