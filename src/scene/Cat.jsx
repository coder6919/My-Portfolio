// Cat.jsx
// Sleeping calico cat, curled up. Low-poly, flat-shaded to match the room's
// chunky geometry. Breathes slowly, twitches an ear or flicks its tail now and
// then, and reacts when clicked.
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const mat = (color) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.92, flatShading: true });

const MATERIALS = {
    white: mat("#e9dfd2"),
    orange: mat("#c9773a"),
    dark: mat("#2f2420"),
    pink: mat("#c98a86"),
};

const GEOMETRY = {
    blob: new THREE.IcosahedronGeometry(1, 1),
    ear: new THREE.ConeGeometry(0.07, 0.15, 4),
    eye: new THREE.BoxGeometry(0.055, 0.012, 0.012),
    nose: new THREE.BoxGeometry(0.024, 0.018, 0.012),
};

// Tail wraps around the front of the body; its root is at the group origin so
// the whole tail can pivot for a flick.
const TAIL_CURVE = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.08, -0.03, 0.2),
    new THREE.Vector3(0.12, -0.06, 0.4),
    new THREE.Vector3(0.38, -0.06, 0.44),
    new THREE.Vector3(0.56, -0.05, 0.38),
]);

const BREATH_PERIOD = 3.8;

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function Cat({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
    const bodyRef = useRef(null);
    const headRef = useRef(null);
    const earRef = useRef(null);
    const tailRef = useRef(null);
    const timers = useRef({ ear: randomBetween(4, 8), tail: randomBetween(8, 14), earT: -1, tailT: -1 });

    const tailGeometry = useMemo(() => new THREE.TubeGeometry(TAIL_CURVE, 14, 0.045, 5, false), []);
    useEffect(() => () => tailGeometry.dispose(), [tailGeometry]);

    useFrame(({ clock }, delta) => {
        const t = clock.getElapsedTime();
        const dt = Math.min(delta, 0.1);
        const timer = timers.current;

        const breath = Math.sin((t / BREATH_PERIOD) * Math.PI * 2);
        if (bodyRef.current) {
            bodyRef.current.scale.set(1 + breath * 0.012, 1 + breath * 0.035, 1 + breath * 0.012);
        }
        if (headRef.current) {
            headRef.current.position.y = 0.16 + breath * 0.006;
        }

        // Ear twitch: a quick flick that settles in ~0.3s.
        timer.ear -= dt;
        if (timer.ear <= 0) {
            timer.earT = 0;
            timer.ear = randomBetween(6, 12);
        }
        if (earRef.current) {
            let angle = 0;
            if (timer.earT >= 0) {
                timer.earT += dt;
                angle = Math.sin(timer.earT * 38) * Math.exp(-timer.earT * 9) * 0.5;
                if (timer.earT > 0.6) timer.earT = -1;
            }
            earRef.current.rotation.z = -0.25 + angle;
        }

        // Tail flick: a slow lift-and-settle.
        timer.tail -= dt;
        if (timer.tail <= 0) {
            timer.tailT = 0;
            timer.tail = randomBetween(10, 18);
        }
        if (tailRef.current) {
            let lift = 0;
            if (timer.tailT >= 0) {
                timer.tailT += dt;
                lift = Math.sin(Math.min(timer.tailT / 1.1, 1) * Math.PI) * 0.22;
                if (timer.tailT > 1.1) timer.tailT = -1;
            }
            tailRef.current.rotation.y = lift;
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        timers.current.earT = 0;
        timers.current.tailT = 0;
    };

    return (
        <group
            position={position}
            rotation={rotation}
            onClick={handleClick}
            onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => (document.body.style.cursor = "default")}
        >
            {/* Body + calico patches breathe together */}
            <group ref={bodyRef}>
                <mesh geometry={GEOMETRY.blob} material={MATERIALS.white} position={[0, 0.17, 0]} scale={[0.4, 0.19, 0.29]} castShadow />
                <mesh geometry={GEOMETRY.blob} material={MATERIALS.orange} position={[-0.12, 0.22, -0.04]} scale={[0.25, 0.14, 0.22]} />
                <mesh geometry={GEOMETRY.blob} material={MATERIALS.dark} position={[0.17, 0.235, -0.07]} scale={[0.15, 0.11, 0.17]} />
                <mesh geometry={GEOMETRY.blob} material={MATERIALS.orange} position={[-0.3, 0.13, 0.08]} scale={[0.13, 0.12, 0.17]} />
            </group>

            {/* Tail curled around the front */}
            <group ref={tailRef} position={[-0.36, 0.1, 0.02]}>
                <mesh geometry={tailGeometry} material={MATERIALS.orange} castShadow />
                <mesh geometry={GEOMETRY.blob} material={MATERIALS.dark} position={[0.56, -0.05, 0.38]} scale={0.05} />
            </group>

            {/* Front paws tucked under the chin */}
            <mesh geometry={GEOMETRY.blob} material={MATERIALS.white} position={[0.3, 0.035, 0.28]} rotation={[0, 0.3, 0]} scale={[0.06, 0.035, 0.075]} />
            <mesh geometry={GEOMETRY.blob} material={MATERIALS.white} position={[0.44, 0.035, 0.24]} rotation={[0, 0.3, 0]} scale={[0.06, 0.035, 0.075]} />

            {/* Head resting on the paws, facing the room */}
            <group ref={headRef} position={[0.38, 0.16, 0.16]} rotation={[0.1, 0.55, -0.12]}>
                <mesh geometry={GEOMETRY.blob} material={MATERIALS.white} scale={[0.16, 0.135, 0.15]} castShadow />
                {/* Orange cap over one eye, dark over the other */}
                <mesh geometry={GEOMETRY.blob} material={MATERIALS.orange} position={[-0.05, 0.05, -0.02]} scale={[0.12, 0.09, 0.12]} />
                <mesh geometry={GEOMETRY.blob} material={MATERIALS.dark} position={[0.06, 0.06, -0.03]} scale={[0.09, 0.07, 0.1]} />

                <mesh geometry={GEOMETRY.ear} material={MATERIALS.orange} position={[-0.085, 0.15, -0.01]} rotation={[-0.1, 0.4, 0.32]} />
                <mesh ref={earRef} geometry={GEOMETRY.ear} material={MATERIALS.dark} position={[0.085, 0.15, -0.01]} rotation={[-0.1, -0.4, -0.25]} />

                {/* Closed eyes + nose */}
                <mesh geometry={GEOMETRY.eye} material={MATERIALS.dark} position={[-0.055, 0.015, 0.142]} rotation={[0, 0, 0.15]} />
                <mesh geometry={GEOMETRY.eye} material={MATERIALS.dark} position={[0.055, 0.015, 0.142]} rotation={[0, 0, -0.15]} />
                <mesh geometry={GEOMETRY.nose} material={MATERIALS.pink} position={[0, -0.02, 0.15]} />
            </group>
        </group>
    );
}

export default Cat;
