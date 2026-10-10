// DeskLamp.jsx
// Articulated desk lamp (the room's warm key light), after the reference:
// weighted base, paired arm rods with springs between three joints, and a
// cone shade aimed at the keyboard whose inside glows when it's on.
// Click to toggle.
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useInteraction } from "../interactions/InteractionContext";
import { useHoverLabel } from "../interactions/hoverLabel";
import { PixelBeam } from "./textures/PixelBox";

// Joint positions (lamp-local). The head hangs over the keyboard.
const PIVOT = new THREE.Vector3(0, 0.16, 0);
const ELBOW = new THREE.Vector3(0.18, 1.3, -0.12);
const HEAD = new THREE.Vector3(0.95, 1.72, 0.36);
// Where the light lands: on the keyboard, tilted toward the viewer so the
// glowing inside of the shade and the bulb show from the room camera.
const AIM = new THREE.Vector3(1.1, 0.0, 1.9);

export const LAMP_POSITION = new THREE.Vector3(-2.6, 2.525, -0.6);
// The light cone in world space (used by the dust motes in Ambience).
export const LAMP_BEAM = { from: HEAD.clone().add(LAMP_POSITION), to: AIM.clone().add(LAMP_POSITION) };

const BODY = new THREE.MeshStandardMaterial({ color: "#1f2027", metalness: 0.6, roughness: 0.4 });
const JOINT = new THREE.MeshStandardMaterial({ color: "#474a58", metalness: 0.8, roughness: 0.3 });
const SPRING = new THREE.MeshStandardMaterial({ color: "#8a8f9c", metalness: 0.8, roughness: 0.35 });
const SHADE_OUT = new THREE.MeshStandardMaterial({ color: "#26272e", metalness: 0.6, roughness: 0.4, side: THREE.FrontSide });

const DOWN = new THREE.Vector3(0, -1, 0);

// Pairs of rods either side of the arm's plane read as a real lamp arm.
function ArmSegment({ from, to }) {
    const side = useMemo(() => {
        const dir = to.clone().sub(from);
        return new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(0.045);
    }, [from, to]);
    const a1 = from.clone().add(side).toArray();
    const b1 = to.clone().add(side).toArray();
    const a2 = from.clone().sub(side).toArray();
    const b2 = to.clone().sub(side).toArray();
    // Spring runs alongside, slightly offset from the rods' plane.
    const spring = useMemo(() => {
        const lift = new THREE.Vector3(0, 0.07, 0);
        return [from.clone().lerp(to, 0.15).add(lift).toArray(), from.clone().lerp(to, 0.7).add(lift).toArray()];
    }, [from, to]);
    return (
        <group>
            <PixelBeam from={a1} to={b1} thickness={0.045} material={BODY} castShadow />
            <PixelBeam from={a2} to={b2} thickness={0.045} material={BODY} castShadow />
            <PixelBeam from={spring[0]} to={spring[1]} thickness={0.03} material={SPRING} />
        </group>
    );
}

function DeskLamp({ position = LAMP_POSITION.toArray() }) {
    const { lampOn, toggleLamp } = useInteraction();
    const hover = useHoverLabel("Desk lamp", "Click to switch it on or off");

    const pointLightRef = useRef(null);
    const spotLightRef = useRef(null);
    const targetRef = useRef(null);
    const bulbRef = useRef(null);
    const innerRef = useRef(null);

    // Shade orientation: open end toward the aim point.
    const shade = useMemo(() => {
        const dir = AIM.clone().sub(HEAD).normalize();
        return {
            quaternion: new THREE.Quaternion().setFromUnitVectors(DOWN, dir),
            center: HEAD.clone().addScaledVector(dir, 0.26).toArray(),
            bulb: HEAD.clone().addScaledVector(dir, 0.36).toArray(),
            target: HEAD.clone().addScaledVector(dir, 3).toArray(),
        };
    }, []);

    const innerMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#3a2a1a",
                emissive: "#ffb05c",
                emissiveIntensity: 1.2,
                roughness: 0.6,
                side: THREE.BackSide,
            }),
        []
    );
    useEffect(() => () => innerMaterial.dispose(), [innerMaterial]);

    useEffect(() => {
        if (spotLightRef.current && targetRef.current) spotLightRef.current.target = targetRef.current;
    }, []);

    useFrame(({ clock }, delta) => {
        const t = clock.getElapsedTime();
        const smoothing = 1 - Math.exp(-delta * 9);
        // Subtle organic flicker/breathing when the lamp is on.
        const flicker = lampOn ? 1 + Math.sin(t * 4) * 0.03 + Math.cos(t * 7) * 0.02 : 0;

        if (pointLightRef.current) {
            pointLightRef.current.intensity = THREE.MathUtils.lerp(pointLightRef.current.intensity, lampOn ? 5.5 * flicker : 0, smoothing);
        }
        if (spotLightRef.current) {
            spotLightRef.current.intensity = THREE.MathUtils.lerp(spotLightRef.current.intensity, lampOn ? 130 * flicker : 0, smoothing);
        }
        if (bulbRef.current) {
            bulbRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
                bulbRef.current.material.emissiveIntensity,
                lampOn ? 60 * flicker : 0.05,
                smoothing
            );
        }
        if (innerRef.current) {
            innerRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
                innerRef.current.material.emissiveIntensity,
                lampOn ? 1.2 : 0,
                smoothing
            );
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        toggleLamp();
    };

    return (
        <group
            position={position}
            onClick={handleClick}
            {...hover}
        >
            {/* Weighted base and switch */}
            <mesh material={BODY} position={[0, 0.05, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.38, 0.42, 0.1, 10]} />
            </mesh>
            <mesh position={[0.18, 0.12, 0.14]}>
                <boxGeometry args={[0.1, 0.05, 0.08]} />
                <meshStandardMaterial
                    color={lampOn ? "#f59e0b" : "#4b5563"}
                    emissive={lampOn ? "#f59e0b" : "#000000"}
                    emissiveIntensity={lampOn ? 6 : 0}
                />
            </mesh>

            {/* Joints */}
            {[PIVOT, ELBOW, HEAD].map((p, i) => (
                <mesh key={i} material={JOINT} position={p.toArray()} rotation={[Math.PI / 2, 0, 0.3]} castShadow>
                    <cylinderGeometry args={[0.08, 0.08, 0.16, 8]} />
                </mesh>
            ))}

            {/* Arms */}
            <ArmSegment from={PIVOT} to={ELBOW} />
            <ArmSegment from={ELBOW} to={HEAD} />

            {/* Shade: dark outside, lit inside, bulb at the mouth */}
            <group position={shade.center} quaternion={shade.quaternion}>
                <mesh material={SHADE_OUT} castShadow>
                    <coneGeometry args={[0.34, 0.5, 12, 1, true]} />
                </mesh>
                <mesh ref={innerRef} material={innerMaterial} scale={0.96}>
                    <coneGeometry args={[0.34, 0.5, 12, 1, true]} />
                </mesh>
                <mesh material={JOINT} position={[0, 0.26, 0]}>
                    <cylinderGeometry args={[0.07, 0.09, 0.08, 8]} />
                </mesh>
            </group>
            <mesh ref={bulbRef} position={shade.bulb}>
                <sphereGeometry args={[0.1, 10, 10]} />
                <meshStandardMaterial color="#fffbeb" emissive="#ffb347" emissiveIntensity={0.05} roughness={0.1} />
            </mesh>

            {/* Lights: fill from the bulb; the spot casts the lamp's shadows */}
            <pointLight ref={pointLightRef} position={shade.bulb} color="#ffb05c" intensity={0} distance={11} decay={2} />
            <object3D ref={targetRef} position={shade.target} />
            <spotLight
                ref={spotLightRef}
                position={shade.bulb}
                color="#ffb05c"
                intensity={0}
                distance={11}
                angle={Math.PI / 2.6}
                penumbra={0.9}
                decay={1.5}
                castShadow
                shadow-bias={-0.0008}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
        </group>
    );
}

export default DeskLamp;
