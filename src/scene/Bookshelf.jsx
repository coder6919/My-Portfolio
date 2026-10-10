// Bookshelf.jsx
// Tall bookshelf on the left, dressed like the reference: casework with a
// crown and plinth, every shelf in use (rows, a flat stack, a leaning book, a
// framed photo, a rubber duck) and plants trailing over the edges. The
// labeled row on shelf 3 opens the Books panel.
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { PixelBox } from "./textures/PixelBox";
import { getMaterials } from "./textures/materials";
import { bookRow } from "./textures/pixelTextures";
import { labeledBooks, photoTexture } from "./textures/textTextures";
import { PALETTE } from "./textures/palette";
import { LeafClump, TrailingVine } from "./Foliage";
import { useHoverLabel } from "../interactions/hoverLabel";

// A packed row of books: the spine texture on the front face, page edges on
// top, dark wood elsewhere.
function BookRow({ size, seed, labeled = false, ...props }) {
    const materials = useMemo(() => {
        const dark = new THREE.MeshStandardMaterial({ color: PALETTE.woodDeep, roughness: 0.9 });
        const pages = new THREE.MeshStandardMaterial({ color: PALETTE.creamShade, roughness: 0.9 });
        // Labeled titles get a touch of self-illumination so they read in the dark.
        const map = labeled ? labeledBooks() : bookRow(seed);
        const spines = new THREE.MeshStandardMaterial({
            map,
            roughness: 0.75,
            ...(labeled && { emissiveMap: map, emissive: "#ffffff", emissiveIntensity: 0.25 }),
        });
        return [dark, dark, pages, dark, spines, dark];
    }, [seed, labeled]);
    useEffect(() => () => materials.forEach((mat) => mat.dispose()), [materials]);
    return (
        <mesh material={materials} castShadow receiveShadow {...props}>
            <boxGeometry args={size} />
        </mesh>
    );
}

// A single book lying flat or leaning: cover colour, cream page edges on +x.
const PAGES = new THREE.MeshStandardMaterial({ color: PALETTE.cream, roughness: 0.9 });
const coverCache = new Map();
function cover(color) {
    if (!coverCache.has(color)) coverCache.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.8 }));
    return coverCache.get(color);
}

function Book({ size, color, ...props }) {
    const c = cover(color);
    return (
        <mesh material={[PAGES, c, c, c, c, c]} castShadow receiveShadow {...props}>
            <boxGeometry args={size} />
        </mesh>
    );
}

const POT = new THREE.MeshStandardMaterial({ color: "#a65a40", roughness: 0.85, flatShading: true });
const SOIL = new THREE.MeshStandardMaterial({ color: "#221510", roughness: 1 });

export function Pot({ radius = 0.2, height = 0.36, ...props }) {
    return (
        <group {...props}>
            <mesh material={POT} position={[0, height / 2, 0]} castShadow>
                <cylinderGeometry args={[radius, radius * 0.78, height, 7]} />
            </mesh>
            <mesh material={SOIL} position={[0, height - 0.02, 0]}>
                <cylinderGeometry args={[radius * 0.9, radius * 0.9, 0.03, 7]} />
            </mesh>
        </group>
    );
}

// The obligatory debugging duck.
const DUCK = new THREE.MeshStandardMaterial({ color: "#d8b23a", roughness: 0.6, flatShading: true });
const BEAK = new THREE.MeshStandardMaterial({ color: "#c9672f", roughness: 0.6 });
const EYE = new THREE.MeshBasicMaterial({ color: "#1a1418" });
const BLOB = new THREE.IcosahedronGeometry(1, 1);

function RubberDuck(props) {
    return (
        <group {...props}>
            <mesh geometry={BLOB} material={DUCK} position={[0, 0.11, 0]} scale={[0.17, 0.11, 0.13]} castShadow />
            <mesh geometry={BLOB} material={DUCK} position={[0.07, 0.25, 0]} scale={0.085} castShadow />
            <mesh material={BEAK} position={[0.16, 0.24, 0]}>
                <boxGeometry args={[0.07, 0.03, 0.06]} />
            </mesh>
            <mesh material={EYE} position={[0.12, 0.28, 0.06]}>
                <boxGeometry args={[0.02, 0.02, 0.01]} />
            </mesh>
        </group>
    );
}

function PhotoFrame(props) {
    const m = getMaterials();
    const material = useMemo(() => new THREE.MeshStandardMaterial({ map: photoTexture(), roughness: 0.8 }), []);
    useEffect(() => () => material.dispose(), [material]);
    return (
        <group {...props}>
            <PixelBox size={[0.5, 0.62, 0.05]} material={m.woodDark} position={[0, 0.31, 0]} castShadow />
            <mesh material={material} position={[0, 0.31, 0.027]}>
                <planeGeometry args={[0.4, 0.52]} />
            </mesh>
        </group>
    );
}

const SHELF_Y = [0.15, 1.7, 3.4, 5.0];

function Bookshelf({
    position = [-5.2, 0, -3.8],
    rotation = [0, 0.15, 0],
    onBookClick = null,
}) {
    const m = getMaterials();
    const booksHover = useHoverLabel("Bookshelf", "Technical foundation");

    return (
        <group position={position} rotation={rotation}>
            {/* ---------------- casework ---------------- */}
            <PixelBox size={[0.16, 6.4, 1.4]} material={m.wood} position={[-1.25, 3.2, 0]} castShadow receiveShadow />
            <PixelBox size={[0.16, 6.4, 1.4]} material={m.wood} position={[1.25, 3.2, 0]} castShadow receiveShadow />
            <PixelBox size={[2.5, 6.4, 0.1]} material={m.woodDark} position={[0, 3.2, -0.65]} receiveShadow />
            {/* Crown: an overhanging cap over a stepped moulding */}
            <PixelBox size={[2.66, 0.12, 1.46]} material={m.woodDark} position={[0, 6.42, 0]} castShadow />
            <PixelBox size={[2.9, 0.14, 1.6]} material={m.wood} position={[0, 6.55, 0.03]} castShadow receiveShadow />
            {/* Plinth */}
            <PixelBox size={[2.5, 0.28, 0.08]} material={m.woodDark} position={[0, 0.14, 0.68]} castShadow />

            {/* Shelves, each with a lighter front lip */}
            {SHELF_Y.map((y, i) => (
                <group key={y}>
                    <PixelBox size={[2.4, i === 0 ? 0.2 : 0.16, 1.35]} material={m.wood} position={[0, y, 0]} castShadow receiveShadow />
                    <PixelBox size={[2.4, 0.07, 0.05]} material={m.deskTop} position={[0, y + 0.06, 0.69]} />
                </group>
            ))}

            {/* ---------------- shelf 1: a full row ---------------- */}
            <BookRow size={[2.25, 1.3, 0.9]} seed="bottom" position={[0, 0.9, 0.05]} />

            {/* ---------------- shelf 2: flat stack, photo, short row, a leaner ---------------- */}
            <Book size={[0.95, 0.16, 0.78]} color={PALETTE.navyMid} position={[-0.62, 1.86, 0.08]} />
            <Book size={[0.85, 0.14, 0.72]} color={PALETTE.rust} position={[-0.6, 2.01, 0.08]} rotation={[0, 0.08, 0]} />
            <Book size={[0.78, 0.12, 0.66]} color={PALETTE.mustard} position={[-0.64, 2.14, 0.08]} rotation={[0, -0.06, 0]} />
            <LeafClump radius={0.16} count={9} seed={4} position={[-0.6, 2.24, 0.1]} />
            <PhotoFrame position={[0.05, 1.78, 0.12]} rotation={[-0.12, -0.12, 0]} />
            <Book size={[0.1, 0.95, 0.72]} color={PALETTE.plum} position={[0.4, 2.24, 0.05]} rotation={[0, 0, 0.22]} />
            <BookRow size={[0.62, 1.05, 0.8]} seed="mid" position={[0.78, 2.31, 0.05]} />

            {/* ---------------- shelf 3: the labeled books (opens the Books panel) ---------------- */}
            <group
                position={[-0.1, 4.25, 0.05]}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onBookClick) onBookClick("all");
                }}
                {...booksHover}
            >
                <BookRow size={[2.0, 1.55, 0.95]} seed="main" labeled />
            </group>
            <mesh position={[0.95, 4.0, 0.05]} castShadow>
                <boxGeometry args={[0.12, 0.95, 0.85]} />
                <meshStandardMaterial color="#1a1c24" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* ---------------- shelf 4: plant, books, duck ---------------- */}
            <Pot radius={0.22} height={0.38} position={[-0.72, 5.08, 0.15]} />
            <LeafClump radius={0.3} count={16} seed={9} position={[-0.72, 5.46, 0.15]} />
            <TrailingVine strands={3} length={1.5} spread={0.35} seed={3} position={[-0.72, 5.12, 0.72]} />
            <Book size={[0.7, 0.13, 0.6]} color={PALETTE.teal} position={[0.05, 5.15, 0.05]} />
            <Book size={[0.62, 0.11, 0.55]} color={PALETTE.cream} position={[0.05, 5.27, 0.05]} rotation={[0, 0.1, 0]} />
            <RubberDuck position={[0.72, 5.08, 0.25]} rotation={[0, -0.6, 0]} />

            {/* ---------------- on top: ivy spilling over the crown ---------------- */}
            <Pot radius={0.2} height={0.32} position={[0.75, 6.62, 0.1]} />
            <LeafClump radius={0.26} count={12} seed={13} position={[0.75, 6.92, 0.1]} />
            <TrailingVine strands={4} length={1.9} spread={0.6} seed={11} position={[0.8, 6.62, 0.82]} />
        </group>
    );
}

export default Bookshelf;
