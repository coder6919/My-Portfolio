// DeskNotes.jsx
// Paper clutter: a ruled notepad with scribbled code notes, a pencil, and a
// sticky-note pad. StickyNote is also used on the monitor bezel.
import { useEffect, useMemo } from "react";
import * as THREE from "three";

function pixelTexture(width, height, draw) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext("2d"));
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

function useDisposable(factory) {
    const value = useMemo(factory, []);
    useEffect(() => () => value.dispose(), [value]);
    return value;
}

// Short ink strokes standing in for handwriting: [x, width] per line.
const NOTE_LINES = [
    [5, 14], [5, 20], [8, 12], [8, 16], [5, 9], [5, 18], [8, 13],
];

function drawNotepad(ctx) {
    ctx.fillStyle = "#e6dcc4";
    ctx.fillRect(0, 0, 32, 40);
    ctx.fillStyle = "#a9b6c9";
    for (let y = 7; y < 40; y += 4) ctx.fillRect(0, y, 32, 1);
    ctx.fillStyle = "#c98a86";
    ctx.fillRect(3, 0, 1, 40);
    ctx.fillStyle = "#3a3550";
    NOTE_LINES.forEach(([x, w], i) => ctx.fillRect(x, 5 + i * 4, w, 1));
    // A boxed "TODO"
    ctx.fillStyle = "#b5523d";
    ctx.fillRect(20, 28, 9, 1);
    ctx.fillRect(20, 34, 9, 1);
    ctx.fillRect(20, 28, 1, 7);
    ctx.fillRect(28, 28, 1, 7);
}

function drawSticky(ctx) {
    ctx.fillStyle = "#e3c65c";
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = "#cfae45";
    ctx.fillRect(0, 0, 16, 2);
    ctx.fillStyle = "#4a3b2a";
    ctx.fillRect(3, 5, 9, 1);
    ctx.fillRect(3, 8, 6, 1);
    ctx.fillRect(3, 11, 8, 1);
}

const MATERIALS = {
    paperEdge: new THREE.MeshStandardMaterial({ color: "#cbbf9f", roughness: 1 }),
    stickyEdge: new THREE.MeshStandardMaterial({ color: "#c9ad4c", roughness: 1 }),
    pencil: new THREE.MeshStandardMaterial({ color: "#d39a35", roughness: 0.6, flatShading: true }),
    wood: new THREE.MeshStandardMaterial({ color: "#e0bf8f", roughness: 0.8, flatShading: true }),
    eraser: new THREE.MeshStandardMaterial({ color: "#c98a86", roughness: 0.9 }),
    ferrule: new THREE.MeshStandardMaterial({ color: "#8f8a80", metalness: 0.6, roughness: 0.4 }),
};

const GEOMETRY = {
    notepad: new THREE.BoxGeometry(0.5, 0.03, 0.64),
    notepadFace: new THREE.PlaneGeometry(0.48, 0.62),
    pencilBody: new THREE.CylinderGeometry(0.018, 0.018, 0.34, 6),
    pencilTip: new THREE.ConeGeometry(0.018, 0.05, 6),
    ferrule: new THREE.CylinderGeometry(0.019, 0.019, 0.03, 6),
    eraser: new THREE.CylinderGeometry(0.018, 0.018, 0.025, 6),
    stickyStack: new THREE.BoxGeometry(0.26, 0.06, 0.26),
    stickyFace: new THREE.PlaneGeometry(0.26, 0.26),
};

export function StickyNote({ position, rotation = [0, 0, 0], size = 0.26 }) {
    const texture = useDisposable(() => pixelTexture(16, 16, drawSticky));
    return (
        <mesh position={position} rotation={rotation} geometry={GEOMETRY.stickyFace} scale={size / 0.26}>
            <meshStandardMaterial map={texture} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
    );
}

function DeskNotes({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
    const notepadTexture = useDisposable(() => pixelTexture(32, 40, drawNotepad));

    return (
        <group position={position} rotation={rotation}>
            {/* Notepad */}
            <mesh geometry={GEOMETRY.notepad} material={MATERIALS.paperEdge} position={[0, 0.015, 0]} castShadow receiveShadow />
            <mesh geometry={GEOMETRY.notepadFace} position={[0, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <meshStandardMaterial map={notepadTexture} roughness={0.95} />
            </mesh>

            {/* Pencil resting across the pad */}
            <group position={[0.2, 0.05, 0.02]} rotation={[0, 0.5, Math.PI / 2]}>
                <mesh geometry={GEOMETRY.pencilBody} material={MATERIALS.pencil} castShadow />
                <mesh geometry={GEOMETRY.pencilTip} material={MATERIALS.wood} position={[0, 0.195, 0]} />
                <mesh geometry={GEOMETRY.ferrule} material={MATERIALS.ferrule} position={[0, -0.185, 0]} />
                <mesh geometry={GEOMETRY.eraser} material={MATERIALS.eraser} position={[0, -0.21, 0]} />
            </group>

            {/* Sticky-note pad */}
            <group position={[0.5, 0, -0.42]} rotation={[0, 0.35, 0]}>
                <mesh geometry={GEOMETRY.stickyStack} material={MATERIALS.stickyEdge} position={[0, 0.03, 0]} castShadow receiveShadow />
                <StickyNote position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]} />
            </group>
        </group>
    );
}

export default DeskNotes;
