// WallDecor.jsx
// Wall dressing on the back wall right of the window, above the bed, like the
// reference's right side: two framed posters flanking the calendar, sticky
// notes, a floating shelf with a few personal things, and warm fairy lights.
//
// Posters: each entry in POSTERS shows a pixel-font placeholder until it gets
// an image. To use real artwork, put the file in /public/posters/ and set
// `src` (e.g. src: "/posters/better-code.png"); keep roughly the same aspect.
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { PixelBox, PixelBeam } from "./textures/PixelBox";
import { getMaterials } from "./textures/materials";
import { textPoster } from "./textures/textTextures";
import { PALETTE } from "./textures/palette";
import { StickyNote } from "./DeskNotes";
import { Pot } from "./Bookshelf";
import { LeafClump } from "./Foliage";

const WALL_Z = -4.83; // just in front of the back wall's face

export const POSTERS = [
    {
        key: "better-code",
        src: null,
        position: [4.45, 5.55],
        size: [1.1, 1.47],
        lines: ["Better", "Code", "Better", "Tomorrow", "</>"],
        texture: { width: 48, height: 64 },
    },
    {
        key: "good-things",
        src: null,
        position: [7.4, 5.6],
        size: [1.0, 1.36],
        lines: ["Good", "Things", "Take", "Time", ":)"],
        texture: { width: 44, height: 60, accent: "#e8b45a" },
    },
];

function PosterFrame({ size, children, position }) {
    const m = getMaterials();
    const [w, h] = size;
    return (
        <group position={[position[0], position[1], WALL_Z]}>
            <PixelBox size={[w + 0.14, h + 0.14, 0.06]} material={m.woodDark} castShadow />
            {children}
        </group>
    );
}

function PlaceholderPoster({ poster }) {
    const material = useMemo(() => {
        const map = textPoster({ key: poster.key, lines: poster.lines, ...poster.texture });
        // A little self-illumination keeps the lettering readable at night.
        return new THREE.MeshStandardMaterial({ map, emissiveMap: map, emissive: "#ffffff", emissiveIntensity: 0.3, roughness: 0.9 });
    }, [poster]);
    useEffect(() => () => material.dispose(), [material]);
    return (
        <mesh material={material} position={[0, 0, 0.032]}>
            <planeGeometry args={poster.size} />
        </mesh>
    );
}

function ImagePoster({ poster }) {
    const texture = useLoader(THREE.TextureLoader, poster.src);
    const material = useMemo(() => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        return new THREE.MeshStandardMaterial({ map: texture, emissiveMap: texture, emissive: "#ffffff", emissiveIntensity: 0.25, roughness: 0.9 });
    }, [texture]);
    useEffect(() => () => material.dispose(), [material]);
    return (
        <mesh material={material} position={[0, 0, 0.032]}>
            <planeGeometry args={poster.size} />
        </mesh>
    );
}

// ---------------------------------------------------------------- shelf

const ROBOT_BODY = new THREE.MeshStandardMaterial({ color: "#5a6070", roughness: 0.5, metalness: 0.3, flatShading: true });
const ROBOT_EYES = new THREE.MeshBasicMaterial({ color: "#7fd6e0" });
const BEACON = new THREE.MeshBasicMaterial({ color: "#ff5a4a" });
const bookCache = new Map();
function bookMaterial(color) {
    if (!bookCache.has(color)) bookCache.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.8 }));
    return bookCache.get(color);
}

function RobotFigure(props) {
    return (
        <group {...props}>
            <mesh material={ROBOT_BODY} position={[0, 0.14, 0]} castShadow>
                <boxGeometry args={[0.22, 0.24, 0.16]} />
            </mesh>
            <mesh material={ROBOT_BODY} position={[0, 0.36, 0]} castShadow>
                <boxGeometry args={[0.26, 0.18, 0.18]} />
            </mesh>
            <mesh material={ROBOT_EYES} position={[0, 0.37, 0.092]}>
                <boxGeometry args={[0.16, 0.04, 0.01]} />
            </mesh>
            <PixelBeam from={[0, 0.45, 0]} to={[0, 0.58, 0]} thickness={0.02} material={ROBOT_BODY} />
            <mesh material={BEACON} position={[0, 0.6, 0]}>
                <boxGeometry args={[0.04, 0.04, 0.04]} />
            </mesh>
        </group>
    );
}

function FloatingShelf() {
    const m = getMaterials();
    const y = 3.45;
    const books = [
        [5.42, 0.42, PALETTE.navyMid],
        [5.52, 0.36, PALETTE.rust],
        [5.61, 0.4, PALETTE.sage],
        [5.72, 0.32, PALETTE.cream],
    ];
    return (
        <group>
            <PixelBox size={[2.6, 0.08, 0.42]} material={m.wood} position={[5.9, y, -4.66]} castShadow receiveShadow />
            <PixelBox size={[0.08, 0.22, 0.3]} material={m.woodDark} position={[4.9, y - 0.15, -4.72]} />
            <PixelBox size={[0.08, 0.22, 0.3]} material={m.woodDark} position={[6.9, y - 0.15, -4.72]} />

            <RobotFigure position={[4.85, y + 0.04, -4.62]} rotation={[0, -0.3, 0]} />
            {books.map(([x, h, color]) => (
                <mesh key={x} material={bookMaterial(color)} position={[x, y + 0.04 + h / 2, -4.66]} castShadow>
                    <boxGeometry args={[0.09, h, 0.3]} />
                </mesh>
            ))}
            <mesh material={bookMaterial(PALETTE.plum)} position={[5.86, y + 0.2, -4.66]} rotation={[0, 0, -0.32]} castShadow>
                <boxGeometry args={[0.09, 0.38, 0.3]} />
            </mesh>
            <Pot radius={0.13} height={0.22} position={[6.6, y + 0.04, -4.64]} />
            <LeafClump radius={0.17} count={9} seed={21} position={[6.6, y + 0.27, -4.64]} />
        </group>
    );
}

// ---------------------------------------------------------------- fairy lights

const WIRE = new THREE.MeshStandardMaterial({ color: "#1a1612", roughness: 0.8 });
const BULB_GEOMETRY = new THREE.IcosahedronGeometry(0.045, 0);
const LIGHT_START = new THREE.Vector3(3.95, 7.05, -4.76);
const LIGHT_END = new THREE.Vector3(8.2, 6.95, -4.76);
const BULB_COUNT = 11;
const SAG = 0.35;

function FairyLights() {
    const group = useRef(null);
    const points = useMemo(
        () =>
            Array.from({ length: BULB_COUNT + 2 }, (_, i) => {
                const t = i / (BULB_COUNT + 1);
                const p = LIGHT_START.clone().lerp(LIGHT_END, t);
                p.y -= Math.sin(t * Math.PI) * SAG; // gentle drape
                return p;
            }),
        []
    );
    const bulbs = useMemo(
        () =>
            points.slice(1, -1).map((p, i) => {
                const material = new THREE.MeshBasicMaterial({ color: i % 3 === 1 ? "#ffd99a" : "#ffb866" });
                return { position: p.toArray(), material, phase: i * 1.7 };
            }),
        [points]
    );
    useEffect(() => () => bulbs.forEach((b) => b.material.dispose()), [bulbs]);

    // Slow, uneven twinkle; brightness > 1 so the bulbs bloom.
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        bulbs.forEach((b) => b.material.color.setScalar(1.4 + Math.sin(t * 0.9 + b.phase) * 0.35).multiply(BULB_TINT));
    });

    return (
        <group ref={group}>
            {points.slice(0, -1).map((p, i) => (
                <PixelBeam key={i} from={p.toArray()} to={points[i + 1].toArray()} thickness={0.018} material={WIRE} />
            ))}
            {bulbs.map((b, i) => (
                <mesh key={i} geometry={BULB_GEOMETRY} material={b.material} position={b.position} />
            ))}
        </group>
    );
}
const BULB_TINT = new THREE.Color("#ffc278");

// ---------------------------------------------------------------- composition

function WallDecor() {
    return (
        <group>
            {POSTERS.map((poster) => (
                <PosterFrame key={poster.key} size={poster.size} position={poster.position}>
                    {poster.src ? <ImagePoster poster={poster} /> : <PlaceholderPoster poster={poster} />}
                </PosterFrame>
            ))}

            {/* Sticky notes under the left poster */}
            <StickyNote position={[4.05, 4.45, WALL_Z]} rotation={[0, 0, 0.08]} size={0.3} />
            <StickyNote position={[4.45, 4.38, WALL_Z]} rotation={[0, 0, -0.06]} size={0.28} />
            <StickyNote position={[4.85, 4.5, WALL_Z]} rotation={[0, 0, 0.1]} size={0.26} />

            <FloatingShelf />
            <FairyLights />
        </group>
    );
}

export default WallDecor;
