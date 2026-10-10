// Ambience.jsx
// Small, slow signs of life that never compete with the portfolio:
//   - dust motes drifting in the desk lamp's light (fade out with the lamp)
//   - city windows switching on and off now and then; rooftop beacons blinking
//   - a distant plane crossing the night sky every so often
// All of it is skipped when the visitor prefers reduced motion. Timing lives
// in refs; nothing here triggers React re-renders per frame.
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useInteraction } from "../interactions/InteractionContext";
import { LAMP_BEAM } from "./DeskLamp";
import { skylineTexture, SKYLINE_META } from "./textures/cityTextures";
import { usePrefersReducedMotion } from "./quality";

function rng(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// ---------------------------------------------------------------- dust

const DUST_COUNT = 36;

function DustMotes() {
    const { lampOn } = useInteraction();

    const { geometry, material, motes, axis } = useMemo(() => {
        const rand = rng(77);
        const positions = new Float32Array(DUST_COUNT * 3);
        const colors = new Float32Array(DUST_COUNT * 3);
        const motes = Array.from({ length: DUST_COUNT }, (_, i) => {
            const glow = 0.55 + rand() * 0.45;
            colors.set([1.0 * glow, 0.82 * glow, 0.55 * glow], i * 3);
            return {
                t: 0.12 + rand() * 0.8, // position along the beam
                angle: rand() * Math.PI * 2,
                radius: Math.sqrt(rand()), // fraction of the beam's width
                speed: 0.008 + rand() * 0.012, // drifting slowly up toward the shade
                phase: rand() * 10,
            };
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        const mat = new THREE.PointsMaterial({
            size: 2.5,
            sizeAttenuation: false, // square pixels, like the rest of the art
            vertexColors: true,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const dir = LAMP_BEAM.to.clone().sub(LAMP_BEAM.from);
        const length = dir.length();
        dir.normalize();
        const u = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
        const v = new THREE.Vector3().crossVectors(dir, u).normalize();
        return { geometry: g, material: mat, motes, axis: { dir, length, u, v } };
    }, []);
    useEffect(
        () => () => {
            geometry.dispose();
            material.dispose();
        },
        [geometry, material]
    );

    const point = useMemo(() => new THREE.Vector3(), []);

    useFrame(({ clock }, delta) => {
        const time = clock.getElapsedTime();
        const dt = Math.min(delta, 0.1);
        const positions = geometry.attributes.position.array;
        motes.forEach((m, i) => {
            m.t -= m.speed * dt;
            if (m.t < 0.1) m.t = 0.92; // re-enter near the desk
            const sway = Math.sin(time * 0.35 + m.phase) * 0.5;
            const width = 0.2 + m.t * 0.95; // the cone widens toward the desk
            point
                .copy(LAMP_BEAM.from)
                .addScaledVector(axis.dir, axis.length * m.t)
                .addScaledVector(axis.u, Math.cos(m.angle + sway) * width * m.radius)
                .addScaledVector(axis.v, Math.sin(m.angle + sway) * width * m.radius * 0.6);
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;
        });
        geometry.attributes.position.needsUpdate = true;
        material.opacity = THREE.MathUtils.lerp(material.opacity, lampOn ? 0.85 : 0, 1 - Math.exp(-dt * 4));
    });

    return <points geometry={geometry} material={material} frustumCulled={false} />;
}

// ---------------------------------------------------------------- city

const BEACON_RED = "#ff5a4a";

function CityLife() {
    const layers = useMemo(
        () =>
            ["near", "mid", "far"].map((name) => {
                const texture = skylineTexture(name);
                return { name, texture, ctx: texture.image.getContext("2d"), meta: SKYLINE_META.get(name) };
            }),
        []
    );
    const state = useRef({ nextWindow: 2, turnOn: true, beaconTime: 0, beaconsOn: true });
    const rand = useMemo(() => rng(99), []);

    useFrame((_, delta) => {
        const s = state.current;
        const dt = Math.min(delta, 0.1);

        // Every couple of seconds one window changes. Alternating on/off keeps
        // the city's overall brightness steady.
        s.nextWindow -= dt;
        if (s.nextWindow <= 0) {
            s.nextWindow = 1.2 + rand() * 2.8;
            const layer = layers[rand() < 0.6 ? 0 : 1]; // near or mid: big enough to notice
            const candidates = layer.meta?.windows.filter((w) => w.on !== s.turnOn) ?? [];
            if (candidates.length) {
                const w = candidates[Math.floor(rand() * candidates.length)];
                w.on = s.turnOn;
                layer.ctx.fillStyle = w.on ? w.litColor : w.offColor;
                layer.ctx.fillRect(w.x, w.y, w.w, w.h);
                layer.texture.needsUpdate = true;
                s.turnOn = !s.turnOn;
            }
        }

        // Rooftop beacons blink together, slowly.
        s.beaconTime += dt;
        if (s.beaconTime > 1.1) {
            s.beaconTime = 0;
            s.beaconsOn = !s.beaconsOn;
            layers.forEach(({ ctx, meta, texture }) => {
                if (!meta?.beacons.length) return;
                meta.beacons.forEach((b) => {
                    ctx.fillStyle = s.beaconsOn ? BEACON_RED : b.off;
                    ctx.fillRect(b.x, b.y, 1, 1);
                });
                texture.needsUpdate = true;
            });
        }
    });

    return null;
}

// ---------------------------------------------------------------- plane

const PLANE_PATH = { y: 4.9, z: -12.8, from: -9, to: 8, speed: 0.4 };
const PLANE_LIGHT = new THREE.BoxGeometry(0.07, 0.07, 0.01);

function DistantPlane() {
    const group = useRef(null);
    const strobe = useRef(null);
    const state = useRef({ x: PLANE_PATH.from, wait: 6 });
    const materials = useMemo(() => {
        const red = new THREE.MeshBasicMaterial({ color: "#ff5a4a" });
        red.color.multiplyScalar(1.4);
        const white = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        white.color.multiplyScalar(2.4); // blooms
        return { red, white };
    }, []);
    useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

    useFrame(({ clock }, delta) => {
        const s = state.current;
        const dt = Math.min(delta, 0.1);
        if (!group.current) return;
        if (s.wait > 0) {
            s.wait -= dt;
            group.current.visible = false;
            return;
        }
        group.current.visible = true;
        s.x += PLANE_PATH.speed * dt;
        group.current.position.set(s.x, PLANE_PATH.y + Math.sin(s.x * 0.15) * 0.08, PLANE_PATH.z);
        if (strobe.current) strobe.current.visible = clock.getElapsedTime() % 1.3 < 0.09;
        if (s.x > PLANE_PATH.to) {
            s.x = PLANE_PATH.from;
            s.wait = 25 + Math.random() * 35;
        }
    });

    return (
        <group ref={group} visible={false}>
            <mesh geometry={PLANE_LIGHT} material={materials.red} />
            <mesh ref={strobe} geometry={PLANE_LIGHT} material={materials.white} position={[0.12, 0.02, 0]} />
        </group>
    );
}

function Ambience() {
    const reducedMotion = usePrefersReducedMotion();
    if (reducedMotion) return null;
    return (
        <>
            <DustMotes />
            <CityLife />
            <DistantPlane />
        </>
    );
}

export default Ambience;
