// Room.jsx
// Room shell: wooden floorboards, plaster walls, dark ceiling and wood trim.
// The box is closed on every side the camera can see.
import { PixelBox, PixelPlane } from "./textures/PixelBox";
import { getMaterials } from "./textures/materials";
import { WINDOW_OPENING as O } from "./Window";

const sideW = 9 + O.x0; // from the side wall (x = ±9) to the opening

function Room() {
    const m = getMaterials();

    return (
        <group>
            {/* FLOOR: boards run left-right across the view */}
            <PixelPlane
                size={[18, 28]}
                material={m.floor}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 7]}
                receiveShadow
            />

            {/* BACK WALL, built around the window opening so moonlight and the
                view come through it. Pieces cast shadows: the light only enters
                through the window. */}
            <PixelBox size={[sideW, 8, 0.25]} material={m.wall} grain={false} position={[O.x0 - sideW / 2, 4, -5]} castShadow receiveShadow />
            <PixelBox size={[sideW, 8, 0.25]} material={m.wall} grain={false} position={[O.x1 + sideW / 2, 4, -5]} castShadow receiveShadow />
            <PixelBox size={[O.x1 - O.x0, O.y0, 0.25]} material={m.wall} grain={false} position={[0, O.y0 / 2, -5]} castShadow receiveShadow />
            <PixelBox size={[O.x1 - O.x0, 8 - O.y1, 0.25]} material={m.wall} grain={false} position={[0, (O.y1 + 8) / 2, -5]} castShadow receiveShadow />

            {/* SIDE WALLS (run the full floor depth so the room box is closed) */}
            <PixelBox
                size={[24, 8, 0.25]}
                material={m.wall}
                grain={false}
                position={[-9, 4, 7]}
                rotation={[0, Math.PI / 2, 0]}
                receiveShadow
            />
            <PixelBox
                size={[24, 8, 0.25]}
                material={m.wall}
                grain={false}
                position={[9, 4, 7]}
                rotation={[0, -Math.PI / 2, 0]}
                receiveShadow
            />

            {/* CEILING */}
            <mesh position={[0, 8.1, 7]} rotation={[Math.PI / 2, 0, 0]} material={m.ceiling}>
                <planeGeometry args={[18.5, 24]} />
            </mesh>

            {/* BASEBOARDS */}
            <PixelBox size={[18, 0.5, 0.18]} material={m.woodDark} position={[0, 0.25, -4.82]} receiveShadow />
            <PixelBox
                size={[24, 0.5, 0.18]}
                material={m.woodDark}
                position={[-8.82, 0.25, 7]}
                rotation={[0, Math.PI / 2, 0]}
                receiveShadow
            />
            <PixelBox
                size={[24, 0.5, 0.18]}
                material={m.woodDark}
                position={[8.82, 0.25, 7]}
                rotation={[0, -Math.PI / 2, 0]}
                receiveShadow
            />

            {/* CEILING BEAM */}
            <PixelBox size={[18, 0.5, 0.35]} material={m.woodDark} position={[0, 7.75, -4.8]} receiveShadow />
        </group>
    );
}

export default Room;
