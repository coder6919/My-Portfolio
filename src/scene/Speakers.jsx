// Speakers.jsx
// Pair of compact bookshelf speakers flanking the monitor, angled toward the chair.
import * as THREE from "three";

const MATERIALS = {
    shell: new THREE.MeshStandardMaterial({ color: "#3a2b24", roughness: 0.85 }),
    baffle: new THREE.MeshStandardMaterial({ color: "#1a1a20", roughness: 0.95 }),
    cone: new THREE.MeshStandardMaterial({ color: "#0e0e12", roughness: 0.6, flatShading: true }),
    trim: new THREE.MeshStandardMaterial({ color: "#5b5650", metalness: 0.6, roughness: 0.4, flatShading: true }),
    led: new THREE.MeshBasicMaterial({ color: "#ffb05c" }),
};

const GEOMETRY = {
    shell: new THREE.BoxGeometry(0.44, 0.7, 0.42),
    baffle: new THREE.BoxGeometry(0.38, 0.64, 0.02),
    wooferRing: new THREE.CylinderGeometry(0.135, 0.135, 0.02, 12),
    woofer: new THREE.CylinderGeometry(0.115, 0.09, 0.03, 12),
    dustCap: new THREE.SphereGeometry(0.04, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2),
    tweeterRing: new THREE.CylinderGeometry(0.058, 0.058, 0.02, 10),
    tweeter: new THREE.SphereGeometry(0.035, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2),
    led: new THREE.BoxGeometry(0.03, 0.03, 0.01),
};

const FACE_FORWARD = [Math.PI / 2, 0, 0];

function Speaker({ position, rotation, withLed = false }) {
    return (
        <group position={position} rotation={rotation}>
            <mesh geometry={GEOMETRY.shell} material={MATERIALS.shell} position={[0, 0.35, 0]} castShadow receiveShadow />
            <mesh geometry={GEOMETRY.baffle} material={MATERIALS.baffle} position={[0, 0.35, 0.205]} />

            {/* Woofer */}
            <group position={[0, 0.24, 0.215]} rotation={FACE_FORWARD}>
                <mesh geometry={GEOMETRY.wooferRing} material={MATERIALS.trim} />
                <mesh geometry={GEOMETRY.woofer} material={MATERIALS.cone} position={[0, 0.005, 0]} />
                <mesh geometry={GEOMETRY.dustCap} material={MATERIALS.trim} position={[0, 0.015, 0]} />
            </group>

            {/* Tweeter */}
            <group position={[0, 0.5, 0.215]} rotation={FACE_FORWARD}>
                <mesh geometry={GEOMETRY.tweeterRing} material={MATERIALS.trim} />
                <mesh geometry={GEOMETRY.tweeter} material={MATERIALS.cone} position={[0, 0.01, 0]} />
            </group>

            {withLed && <mesh geometry={GEOMETRY.led} material={MATERIALS.led} position={[0.13, 0.08, 0.218]} />}
        </group>
    );
}

function Speakers({ deskY = 2.525 }) {
    return (
        <group>
            <Speaker position={[-2.1, deskY, -1.45]} rotation={[0, 0.28, 0]} />
            <Speaker position={[2.5, deskY, -1.45]} rotation={[0, -0.32, 0]} withLed />
        </group>
    );
}

export default Speakers;
