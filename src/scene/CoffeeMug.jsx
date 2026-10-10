import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { emitCharacterEvent, REQUEST_DRINK, mugState } from "../interactions/characterEvents";
import { useHoverLabel } from "../interactions/hoverLabel";

const PUFF_SECONDS = 1.6;
const _viewAxis = new THREE.Vector3();
const _tilt = new THREE.Quaternion();

/**
 * Physical 3D Coffee Mug with subtle animated steam
 * Positioned on the desk surface (y = 2.525) in front of the character
 * Independent 3D object ready for future drink interactions
 */
// yaw turns the body/handle only; the steam planes stay facing the camera.
function CoffeeMug({ position = [-0.45, 2.525, 0.1], yaw = 0, onClick = null }) {
    const steamRef1 = useRef(null);
    const steamRef2 = useRef(null);
    const steamRef3 = useRef(null);
    const groupRef = useRef(null);
    const puffRef = useRef(0);
    const hover = useHoverLabel("Coffee", "Click to take a sip");
    const tiltRef = useRef(0);

    const restPosition = useMemo(() => new THREE.Vector3(...position), [position]);

    const handleClick = (e) => {
        e.stopPropagation();
        puffRef.current = PUFF_SECONDS;
        emitCharacterEvent(REQUEST_DRINK);
        onClick?.(e);
    };

    // Subtle gentle steam rising animation; a click briefly thickens it.
    useFrame(({ clock, camera }, delta) => {
        const t = clock.getElapsedTime();
        puffRef.current = Math.max(0, puffRef.current - delta);

        // Glide to the character's hand while held, back to the desk otherwise.
        if (groupRef.current) {
            const follow = 1 - Math.exp(-delta * 14);
            const target = mugState.held ? mugState.position : restPosition;
            groupRef.current.position.lerp(target, follow);
            // Sipping tilts the mug in the screen plane, toward the face.
            tiltRef.current = THREE.MathUtils.lerp(tiltRef.current, mugState.held ? mugState.tilt : 0, follow);
            _viewAxis.setFromMatrixColumn(camera.matrixWorld, 2);
            groupRef.current.quaternion.copy(_tilt.setFromAxisAngle(_viewAxis, tiltRef.current));
        }
        const puff = 1 + 1.6 * Math.sin((puffRef.current / PUFF_SECONDS) * Math.PI);

        if (steamRef1.current) {
            steamRef1.current.position.y = 0.38 + ((t * 0.25) % 0.35);
            steamRef1.current.material.opacity = Math.sin(((t * 0.25) % 0.35) / 0.35 * Math.PI) * 0.35 * puff;
            steamRef1.current.position.x = Math.sin(t * 1.5) * 0.03;
        }

        if (steamRef2.current) {
            steamRef2.current.position.y = 0.38 + (((t * 0.25) + 0.12) % 0.35);
            steamRef2.current.material.opacity = Math.sin((((t * 0.25) + 0.12) % 0.35) / 0.35 * Math.PI) * 0.25 * puff;
            steamRef2.current.position.x = 0.04 + Math.cos(t * 1.8) * 0.03;
        }

        if (steamRef3.current) {
            steamRef3.current.position.y = 0.38 + (((t * 0.25) + 0.24) % 0.35);
            steamRef3.current.material.opacity = Math.sin((((t * 0.25) + 0.24) % 0.35) / 0.35 * Math.PI) * 0.28 * puff;
            steamRef3.current.position.x = -0.04 + Math.sin(t * 2.0) * 0.03;
        }
    });

    return (
        <group
            ref={groupRef}
            position={position}
            onClick={handleClick}
            {...hover}
        >
            <group rotation={[0, yaw, 0]}>
                {/* Ceramic Mug Outer Body */}
                <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.18, 0.16, 0.32, 16]} />
                    <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
                </mesh>

                {/* Mug Inner Rim / Hollow */}
                <mesh position={[0, 0.17, 0]}>
                    <cylinderGeometry args={[0.15, 0.13, 0.31, 16]} />
                    <meshStandardMaterial color="#334155" roughness={0.6} />
                </mesh>

                {/* Coffee Liquid Surface */}
                <mesh position={[0, 0.28, 0]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
                    <meshStandardMaterial color="#2d1606" roughness={0.2} />
                </mesh>

                {/* Mug Handle */}
                <mesh position={[0.22, 0.16, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
                    <torusGeometry args={[0.09, 0.028, 8, 16, Math.PI]} />
                    <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
                </mesh>
            </group>

            {/* Steam Layer 1 */}
            <mesh ref={steamRef1} position={[0, 0.38, 0]}>
                <planeGeometry args={[0.1, 0.18]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.3}
                    depthWrite={false}
                />
            </mesh>

            {/* Steam Layer 2 */}
            <mesh ref={steamRef2} position={[0.04, 0.44, 0.02]}>
                <planeGeometry args={[0.08, 0.16]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.25}
                    depthWrite={false}
                />
            </mesh>

            {/* Steam Layer 3 */}
            <mesh ref={steamRef3} position={[-0.04, 0.5, -0.02]}>
                <planeGeometry args={[0.09, 0.15]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.25}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

export default CoffeeMug;
