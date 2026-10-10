// FloorProps.jsx
import * as THREE from "three";

function FloorProps() {
    return (
        <group>
            {/* Pair of Sneakers near the edge of the woven rug */}
            <group position={[-2.4, 0.04, 3.2]} rotation={[0, 0.6, 0]}>
                {/* Left shoe */}
                <mesh position={[-0.15, 0.08, 0]} castShadow>
                    <boxGeometry args={[0.26, 0.16, 0.55]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.8} />
                </mesh>
                <mesh position={[-0.15, 0.04, 0.1]} castShadow>
                    <boxGeometry args={[0.27, 0.08, 0.57]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.9} />
                </mesh>

                {/* Right shoe */}
                <mesh position={[0.15, 0.08, -0.08]} castShadow>
                    <boxGeometry args={[0.26, 0.16, 0.55]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.8} />
                </mesh>
                <mesh position={[0.15, 0.04, 0.02]} castShadow>
                    <boxGeometry args={[0.27, 0.08, 0.57]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.9} />
                </mesh>
            </group>

            {/* Casually Draped Hoodie / Jacket on floor near the bed */}
            <group position={[3.2, 0.03, 1.0]} rotation={[0, -0.4, 0]}>
                <mesh position={[0, 0.05, 0]} castShadow>
                    <boxGeometry args={[1.1, 0.1, 0.9]} />
                    <meshStandardMaterial color="#334155" roughness={0.95} />
                </mesh>
                <mesh position={[0.4, 0.08, 0.2]} rotation={[0, 0, 0.5]} castShadow>
                    <boxGeometry args={[0.7, 0.08, 0.4]} />
                    <meshStandardMaterial color="#475569" roughness={0.95} />
                </mesh>
            </group>
        </group>
    );
}

export default FloorProps;