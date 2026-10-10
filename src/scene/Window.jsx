// Window.jsx
// The room's hero window, modelled on the reference: a real opening in the
// back wall looking out on a layered night city (sky, moon, far / mid / near
// skylines at different depths, so they shift with the camera), dark wood
// frame with six panes, glass glare and a deep sill with a plant.
//
// Light: moonlight comes from outside and passes through the opening, so the
// frame casts pane shadows into the room; a rectangular area light adds the
// soft window-shaped glow on the desk, walls and floor.
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { PixelBox } from "./textures/PixelBox";
import { getMaterials } from "./textures/materials";
import { skyTexture, moonTexture, moonGlowTexture, skylineTexture, glassGlareTexture } from "./textures/cityTextures";
import Succulent from "./Succulent";
import { useInteraction } from "../interactions/InteractionContext";

RectAreaLightUniformsLib.init();

// The hole in the back wall (Room.jsx builds the wall around it).
// Starts just above the desk top (2.525) like the reference, so no panes hide behind the desk.
export const WINDOW_OPENING = { x0: -3.4, x1: 3.4, y0: 2.6, y1: 6.9 };
const OPENING = WINDOW_OPENING;
const WIDTH = OPENING.x1 - OPENING.x0;
const HEIGHT = OPENING.y1 - OPENING.y0;
const CENTER = new THREE.Vector3(0, (OPENING.y0 + OPENING.y1) / 2, -5);
const PANE_Z = -5.0;

// Outside layers: texture, plane size (width = texels * texelSize) and where
// the bottom edge sits. Brightness > 1 pushes lit windows over the bloom
// threshold on the nearer layers.
const LAYERS = [
    { key: "sky", texture: skyTexture, z: -14, size: [24, 14.1], center: [0, 3], brightness: 1 },
    { key: "far", texture: () => skylineTexture("far"), z: -11, size: [20, 6.66], bottom: -1, brightness: 1 },
    { key: "mid", texture: () => skylineTexture("mid"), z: -8.5, size: [16, 7.2], bottom: -1.5, brightness: 1.35 },
    { key: "near", texture: () => skylineTexture("near"), z: -6.3, size: [12, 7.5], bottom: -1, brightness: 1.6 },
];

const MOON = { position: [2.6, 4.7, -13.5], size: 1.1 };
const MOON_LIGHT = { position: [3.5, 9.5, -12], target: [0.4, 2.4, -1.2] };

function OutsideLayer({ layer }) {
    const material = useMemo(() => {
        const mat = new THREE.MeshBasicMaterial({ map: layer.texture(), transparent: true, alphaTest: 0.5 });
        mat.color.setScalar(layer.brightness);
        return mat;
    }, [layer]);
    useEffect(() => () => material.dispose(), [material]);
    const [w, h] = layer.size;
    const y = layer.center ? layer.center[1] : layer.bottom + h / 2;
    return (
        <mesh position={[0, y, layer.z]} material={material}>
            <planeGeometry args={[w, h]} />
        </mesh>
    );
}

function Window() {
    const m = getMaterials();
    const { lampOn } = useInteraction();
    const moonLightRef = useRef(null);
    const targetRef = useRef(null);
    const areaRef = useRef(null);

    useEffect(() => {
        if (moonLightRef.current && targetRef.current) moonLightRef.current.target = targetRef.current;
    }, []);

    // With the lamp off the moonlight carries the room; with it on, it eases back.
    useFrame((_, delta) => {
        const t = 1 - Math.exp(-delta * 6);
        if (moonLightRef.current) {
            moonLightRef.current.intensity = THREE.MathUtils.lerp(moonLightRef.current.intensity, lampOn ? 140 : 200, t);
        }
        if (areaRef.current) {
            areaRef.current.intensity = THREE.MathUtils.lerp(areaRef.current.intensity, lampOn ? 1.6 : 2.6, t);
        }
    });

    const moonMaterials = useMemo(() => {
        const moon = new THREE.MeshBasicMaterial({ map: moonTexture(), transparent: true, alphaTest: 0.5 });
        moon.color.setScalar(2.2); // over the bloom threshold
        const glow = new THREE.MeshBasicMaterial({
            map: moonGlowTexture(),
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const glass = new THREE.MeshBasicMaterial({
            map: glassGlareTexture(),
            color: "#bcd0ff",
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        return { moon, glow, glass };
    }, []);
    useEffect(() => () => Object.values(moonMaterials).forEach((mat) => mat.dispose()), [moonMaterials]);

    const bar = 0.12;
    const columns = [-WIDTH / 6, WIDTH / 6];
    const transomY = OPENING.y0 + HEIGHT * 0.58;

    return (
        <group>
            {/* ---------------- outside ---------------- */}
            {LAYERS.map((layer) => (
                <OutsideLayer key={layer.key} layer={layer} />
            ))}
            <mesh position={[MOON.position[0], MOON.position[1], MOON.position[2] - 0.1]} material={moonMaterials.glow}>
                <planeGeometry args={[MOON.size * 3, MOON.size * 3]} />
            </mesh>
            <mesh position={MOON.position} material={moonMaterials.moon}>
                <planeGeometry args={[MOON.size, MOON.size]} />
            </mesh>

            {/* ---------------- light ---------------- */}
            <object3D ref={targetRef} position={MOON_LIGHT.target} />
            <spotLight
                ref={moonLightRef}
                position={MOON_LIGHT.position}
                color="#9db4ff"
                intensity={140}
                distance={32}
                angle={0.42}
                penumbra={0.35}
                decay={1.5}
                castShadow
                shadow-bias={-0.0004}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={2}
                shadow-camera-far={32}
            />
            <rectAreaLight
                ref={areaRef}
                position={[CENTER.x, CENTER.y, -4.86]}
                rotation={[0, Math.PI, 0]}
                width={WIDTH}
                height={HEIGHT}
                color="#7d93ff"
                intensity={1.6}
            />

            {/* ---------------- frame ---------------- */}
            {/* Casing on the wall face */}
            <PixelBox size={[WIDTH + 0.5, 0.25, 0.16]} material={m.woodDark} position={[0, OPENING.y1 + 0.12, -4.8]} castShadow receiveShadow />
            <PixelBox size={[0.25, HEIGHT + 0.5, 0.16]} material={m.woodDark} position={[OPENING.x0 - 0.12, CENTER.y, -4.8]} castShadow receiveShadow />
            <PixelBox size={[0.25, HEIGHT + 0.5, 0.16]} material={m.woodDark} position={[OPENING.x1 + 0.12, CENTER.y, -4.8]} castShadow receiveShadow />

            {/* Sash: two mullions and a transom make six panes */}
            {columns.map((x) => (
                <PixelBox key={x} size={[bar, HEIGHT, 0.12]} material={m.woodDark} position={[x, CENTER.y, PANE_Z]} castShadow />
            ))}
            <PixelBox size={[WIDTH, bar, 0.12]} material={m.woodDark} position={[0, transomY, PANE_Z]} castShadow />
            <PixelBox size={[WIDTH, bar, 0.12]} material={m.woodDark} position={[0, OPENING.y1 - bar / 2, PANE_Z]} castShadow />
            <PixelBox size={[bar, HEIGHT, 0.12]} material={m.woodDark} position={[OPENING.x0 + bar / 2, CENTER.y, PANE_Z]} castShadow />
            <PixelBox size={[bar, HEIGHT, 0.12]} material={m.woodDark} position={[OPENING.x1 - bar / 2, CENTER.y, PANE_Z]} castShadow />

            {/* Glass: faint glare streaks over each pane */}
            <mesh position={[0, CENTER.y, PANE_Z + 0.07]} material={moonMaterials.glass}>
                <planeGeometry args={[WIDTH, HEIGHT]} />
            </mesh>

            {/* Deep sill with a plant */}
            <PixelBox size={[WIDTH + 0.7, 0.14, 0.62]} material={m.wood} position={[0, OPENING.y0 - 0.07, -4.72]} castShadow receiveShadow />
            <group position={[-2.5, OPENING.y0, -4.65]} scale={1.5}>
                <Succulent />
            </group>
        </group>
    );
}

export default Window;
