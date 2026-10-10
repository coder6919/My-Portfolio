// Desk.jsx
// Plank-top desk on trestle legs (posts, foot rails, crossbars) with a dark
// modesty panel, plus the small things that make it lived-in: a pen cup and a
// wastebasket with crumpled notes by the left leg.
import * as THREE from "three";
import { PixelBox, PixelBeam } from "./textures/PixelBox";
import { getMaterials } from "./textures/materials";
import { PALETTE } from "./textures/palette";

const CUP = new THREE.MeshStandardMaterial({ color: PALETTE.rust, roughness: 0.7, flatShading: true });
const PEN_COLORS = [PALETTE.navyLight, PALETTE.mustard, "#1a1418"].map(
    (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
);
const BASKET = new THREE.MeshStandardMaterial({ color: "#2b2f3a", roughness: 0.7, side: THREE.DoubleSide, flatShading: true });
const PAPER = new THREE.MeshStandardMaterial({ color: PALETTE.cream, roughness: 0.95, flatShading: true });
const CRUMPLE = new THREE.IcosahedronGeometry(1, 0);

function PenCup(props) {
    return (
        <group {...props}>
            <mesh material={CUP} position={[0, 0.18, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.13, 0.12, 0.36, 7]} />
            </mesh>
            <PixelBeam from={[-0.04, 0.2, 0]} to={[-0.09, 0.58, 0.03]} thickness={0.03} material={PEN_COLORS[0]} />
            <PixelBeam from={[0.03, 0.2, 0.02]} to={[0.07, 0.6, -0.04]} thickness={0.03} material={PEN_COLORS[1]} />
            <PixelBeam from={[0.0, 0.2, -0.04]} to={[0.02, 0.54, -0.1]} thickness={0.025} material={PEN_COLORS[2]} />
        </group>
    );
}

function Wastebasket(props) {
    return (
        <group {...props}>
            <mesh material={BASKET} position={[0, 0.32, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.36, 0.28, 0.64, 8, 1, true]} />
            </mesh>
            <mesh material={BASKET} position={[0, 0.01, 0]}>
                <cylinderGeometry args={[0.28, 0.28, 0.02, 8]} />
            </mesh>
            {/* Crumpled notes: two in the basket, one that missed */}
            <mesh geometry={CRUMPLE} material={PAPER} position={[0.06, 0.62, 0.04]} scale={0.14} rotation={[0.4, 0.2, 0]} castShadow />
            <mesh geometry={CRUMPLE} material={PAPER} position={[-0.1, 0.58, -0.06]} scale={0.12} rotation={[1, 0.5, 0.3]} castShadow />
            <mesh geometry={CRUMPLE} material={PAPER} position={[0.55, 0.1, 0.25]} scale={0.11} rotation={[0.2, 1.2, 0.6]} castShadow />
        </group>
    );
}

function TrestleLeg({ x, m }) {
    return (
        <group position={[x, 0, 0]}>
            {/* Two posts, a foot rail and a crossbar */}
            <PixelBox size={[0.24, 2.18, 0.24]} material={m.wood} position={[0, 1.09, 0.78]} castShadow />
            <PixelBox size={[0.24, 2.18, 0.24]} material={m.wood} position={[0, 1.09, -0.78]} castShadow />
            <PixelBox size={[0.3, 0.16, 2.0]} material={m.woodDark} position={[0, 0.08, 0]} castShadow receiveShadow />
            <PixelBox size={[0.14, 0.14, 1.4]} material={m.woodDark} position={[0, 0.85, 0]} castShadow />
            <PixelBox size={[0.3, 0.14, 2.0]} material={m.woodDark} position={[0, 2.1, 0]} castShadow />
        </group>
    );
}

function Desk() {
    const m = getMaterials();

    return (
        <group position={[0, 0, -0.8]}>
            {/* Desktop: planks running along the desk, with a lighter front lip */}
            <PixelBox size={[8, 0.35, 2.5]} material={m.deskTop} position={[0, 2.35, 0]} castShadow receiveShadow />
            <PixelBox size={[8.02, 0.06, 0.06]} material={m.deskTop} position={[0, 2.5, 1.24]} />

            {/* Front apron */}
            <PixelBox size={[8, 0.25, 0.18]} material={m.wood} position={[0, 2.12, 1.15]} castShadow />

            {/* Legs */}
            <TrestleLeg x={-3.45} m={m} />
            <TrestleLeg x={3.45} m={m} />

            {/* Modesty panel */}
            <PixelBox size={[6.9, 1.6, 0.12]} material={m.woodDark} position={[0, 1.3, -0.72]} castShadow />

            {/* Lived-in details (desk-local; the desk top is at y = 2.525) */}
            <PenCup position={[-3.25, 2.525, -0.45]} />
            <Wastebasket position={[-3.95, 0, 1.75]} />
        </group>
    );
}

export default Desk;
