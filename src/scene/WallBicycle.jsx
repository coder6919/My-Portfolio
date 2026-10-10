// WallBicycle.jsx
import * as THREE from "three";

function WallBicycle({ position = [-8.7, 5.2, 1.2], rotation = [0, Math.PI / 2, 0] }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Wall Mount Hooks */}
            <mesh position={[0, 0.4, -0.15]}>
                <boxGeometry args={[0.15, 0.08, 0.2]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.4, -0.15]}>
                <boxGeometry args={[0.15, 0.08, 0.2]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Main Frame Bar */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0.3]} castShadow>
                <cylinderGeometry args={[0.035, 0.035, 1.6, 8]} />
                <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Handlebars */}
            <mesh position={[0, 0.85, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.8, 8]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Front Wheel */}
            <group position={[0, 0.95, 0.15]}>
                <mesh castShadow>
                    <torusGeometry args={[0.7, 0.03, 8, 24]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.5} />
                </mesh>
                <mesh>
                    <cylinderGeometry args={[0.68, 0.68, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
                    <meshStandardMaterial color="#38bdf8" transparent opacity={0.15} />
                </mesh>
            </group>

            {/* Rear Wheel */}
            <group position={[0, -0.95, 0.15]}>
                <mesh castShadow>
                    <torusGeometry args={[0.7, 0.03, 8, 24]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.5} />
                </mesh>
                <mesh>
                    <cylinderGeometry args={[0.68, 0.68, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
                    <meshStandardMaterial color="#38bdf8" transparent opacity={0.15} />
                </mesh>
            </group>
        </group>
    );
}

export default WallBicycle;