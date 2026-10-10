// WallSconce.jsx
import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function WallSconce({ position = [-8.8, 4.5, -2.0] }) {
    const [sconceOn, setSconceOn] = useState(true);

    const coreLightRef = useRef(null);
    const ambientSpreadRef = useRef(null);
    const bulbRef = useRef(null);

    useFrame(({ clock }, delta) => {
        const t = clock.getElapsedTime();
        const smoothing = 1 - Math.exp(-delta * 9);
        const flicker = sconceOn ? 1 + Math.sin(t * 3.5 + 1) * 0.025 : 0;

        if (coreLightRef.current) {
            coreLightRef.current.intensity = THREE.MathUtils.lerp(
                coreLightRef.current.intensity,
                sconceOn ? 6.5 * flicker : 0,
                smoothing
            );
        }

        if (ambientSpreadRef.current) {
            ambientSpreadRef.current.intensity = THREE.MathUtils.lerp(
                ambientSpreadRef.current.intensity,
                sconceOn ? 1.6 * flicker : 0,
                smoothing
            );
        }

        if (bulbRef.current) {
            bulbRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
                bulbRef.current.material.emissiveIntensity,
                sconceOn ? 50 * flicker : 0.1,
                smoothing
            );
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        setSconceOn((prev) => !prev);
    };

    return (
        <group
            position={position}
            rotation={[0, Math.PI / 2, 0]}
            onClick={handleClick}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "default")}
        >
            <mesh position={[0, 0, -0.06]} castShadow>
                <cylinderGeometry args={[0.32, 0.32, 0.08, 16]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
            </mesh>

            <mesh position={[0, -0.35, 0.18]} castShadow>
                <torusGeometry args={[0.28, 0.04, 8, 16, Math.PI]} rotation={[0, Math.PI / 2, 0]} />
                <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.25} />
            </mesh>

            <mesh position={[0, -0.62, 0.32]} castShadow>
                <cylinderGeometry args={[0.08, 0.1, 0.15, 10]} />
                <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.3} />
            </mesh>

            <mesh position={[0, -0.92, 0.32]} castShadow>
                <coneGeometry args={[0.38, 0.55, 14, 1, true]} />
                <meshStandardMaterial
                    color="#fef3c7"
                    emissive="#fde68a"
                    emissiveIntensity={sconceOn ? 0.3 : 0.05}
                    side={THREE.DoubleSide}
                    roughness={0.4}
                />
            </mesh>

            <mesh ref={bulbRef} position={[0, -0.85, 0.32]}>
                <sphereGeometry args={[0.1, 10, 10]} />
                <meshStandardMaterial color="#fffbeb" emissive="#fbbf24" emissiveIntensity={50} roughness={0.1} />
            </mesh>

            <pointLight
                ref={coreLightRef}
                position={[0, -1.0, 0.35]}
                color="#ffb732"
                intensity={6.5}
                distance={6.0}
                decay={1.5}
                castShadow
                shadow-bias={-0.0008}
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
            />

            <pointLight
                ref={ambientSpreadRef}
                position={[0.5, -1.5, 1.2]}
                color="#ffd175"
                intensity={1.6}
                distance={8}
                decay={1.8}
            />
        </group>
    );
}

export default WallSconce;