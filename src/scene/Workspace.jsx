// Workspace.jsx
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { useInteraction } from "../interactions/InteractionContext";
import Room from "./Room";
import Window from "./Window";
import Desk from "./Desk";
import Chair from "./Chair";
import Character from "./Character";
import CharacterLegs from "./CharacterLegs";
import Monitor from "./Monitor";
import Keyboard from "./Keyboard";
import DeskLamp from "./DeskLamp";
import CoffeeMug from "./CoffeeMug";
import Bookshelf from "./Bookshelf";
import Calendar from "./Calendar";
import Drawers from "./Drawers";
import Phone from "./Phone";
import WallDecor from "./WallDecor";
import RoomProps from "./RoomProps";
import WallSconce from "./WallSconce";
import WallBicycle from "./WallBicycle";
import FloorProps from "./FloorProps";
import Bed, { QUILT_TOP } from "./Bed";
import Cat from "./Cat";
import Succulent from "./Succulent";
import Speakers from "./Speakers";
import DeskNotes from "./DeskNotes";
import Ambience from "./Ambience";
import CameraRig, { CAMERA_FOV, roomPixelRatio } from "./CameraRig";
import { useIsPhone } from "./quality";

// Desktop-only polish. Bloom works on the low-resolution buffer, so the glow is
// as chunky as the pixels. The composer skips the renderer's tone mapping, so
// it's re-applied as the last effect.
function PostEffects() {
    return (
        <EffectComposer multisampling={0}>
            <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.3} intensity={0.85} />
            <Vignette offset={0.3} darkness={0.55} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
    );
}

// Low warm fill from the front so the room reads, without competing with the
// desk lamp (the key light) or the window (cool moonlight). Dims with the lamp.
function RoomFillLight() {
    const { lampOn } = useInteraction();
    const lightRef = useRef(null);

    useFrame((_, delta) => {
        if (!lightRef.current) return;
        lightRef.current.intensity = THREE.MathUtils.lerp(
            lightRef.current.intensity,
            lampOn ? 1.3 : 0.45,
            1 - Math.exp(-delta * 8)
        );
    });

    return (
        <directionalLight
            ref={lightRef}
            position={[4, 10, 8]}
            intensity={1.3}
            color="#e0b88c"
            castShadow
            shadow-bias={-0.0005}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
        />
    );
}

function SceneContents() {
    const { openPanel } = useInteraction();

    return (
        <>
            <color attach="background" args={["#0c0b12"]} />

            {/* Night base: dim, cool, steady. Shadows stay readable but dark. */}
            <ambientLight intensity={0.5} color="#4a5080" />
            <hemisphereLight color="#7d8fd0" groundColor="#2a1e2a" intensity={0.75} />
            <RoomFillLight />

            {/* Back wall bounce */}
            <directionalLight position={[0, 7, -5]} color="#6473a8" intensity={0.35} />

            {/* Moonlight bounce on the bed side (the window itself lights the room) */}
            <pointLight position={[4.5, 4.5, -2.5]} color="#7d8fd8" intensity={0.7} distance={9} decay={2} />

            <Room />
            <Window />
            <WallDecor />
            <WallSconce />
            <WallBicycle />
            <FloorProps />

            <Calendar onClick={() => openPanel("calendar")} />
            <Bookshelf onBookClick={() => openPanel("books")} />

            <Desk />
            <Drawers />
            <Monitor />
            {/* Keyboard sits in front of the chair so the sprite's hands reach it */}
            <Keyboard position={[-1.15, 2.525, 0.1]} mouseOffset={2.1} />
            <DeskLamp />

            {/* Within the character's reach; handle turned toward his right hand */}
            <CoffeeMug position={[0.12, 2.525, 0.12]} yaw={-2.47} />
            <Phone onClick={() => openPanel("phone")} />
            <Speakers />
            <Succulent position={[3.45, 2.525, -1.3]} />
            <DeskNotes position={[2.85, 2.525, 0.05]} rotation={[0, -0.18, 0]} />

            <RoomProps />
            <Bed />
            <Cat position={[5.1, QUILT_TOP, -1.0]} rotation={[0, 0.2, 0]} />
            <Chair />
            <CharacterLegs />
            <Character />

            <Ambience />
        </>
    );
}

// The canvas fills the viewport, so the render resolution follows the window.
function useRoomPixelRatio() {
    const [dpr, setDpr] = useState(() => roomPixelRatio(window.innerWidth, window.innerHeight));
    useEffect(() => {
        const update = () => setDpr(roomPixelRatio(window.innerWidth, window.innerHeight));
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return dpr;
}

function Workspace() {
    const isPhone = useIsPhone();
    const dpr = useRoomPixelRatio();

    return (
        <div className="workspace">
            <Canvas
                dpr={dpr}
                camera={{ fov: CAMERA_FOV, near: 0.1, far: 100, position: [1.2, 7.4, 15.8] }}
                gl={{
                    antialias: false,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: true
                }}
                shadows={{ type: THREE.PCFShadowMap }}
            >
                <CameraRig />
                <SceneContents />
                {!isPhone && <PostEffects />}
            </Canvas>
        </div>
    );
}

export default Workspace;