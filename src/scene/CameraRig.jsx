// CameraRig.jsx
// Perspective camera framed like the reference: looking over the desk at the
// window wall, bookshelf on the left, bed on the right. The framing adapts to
// the viewport so the room always fills the screen, and the render resolution
// is set so sprite pixels land on a whole number of render pixels.
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useInteraction } from "../interactions/InteractionContext";
import { CHARACTER_SHEET } from "./characterClips";

export const CAMERA_FOV = 30;
const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2));

// Each view: where it looks, the direction back toward the camera, and the
// box (world units, measured at the target) to frame.
//   contain - the whole box stays visible (extra space shows more of the
//             closed room box, never a void)
//   cover   - the box fills the screen and the excess is cropped
// Portrait screens can't fit the room's width, so they cover a smaller box
// centred on the desk and character instead.
const VIEWS = {
    room: {
        target: new THREE.Vector3(0.6, 2.9, -1.2),
        direction: new THREE.Vector3(0.9, 6.5, 16.8).normalize(),
        width: 14.4,
        height: 8.2,
        fit: "contain",
        portrait: {
            target: new THREE.Vector3(0.45, 3.0, -0.6),
            width: 6,
            height: 11,
            fit: "cover",
        },
    },
    monitor: {
        target: new THREE.Vector3(0.25, 4.1, -0.55),
        direction: new THREE.Vector3(0.05, 0.08, 1).normalize(),
        width: 4.2,
        height: 2.8,
        fit: "contain",
    },
};

// The character's chest: the depth used to match sprite pixels to screen pixels.
const CHARACTER_FOCUS = new THREE.Vector3(-0.85, 2.8, 1.4);
// Render pixels per sprite pixel. 2 keeps the sprite crisp (integer scale)
// while leaving enough resolution for pixel-font text on the monitor,
// drawers and calendar to read.
const RENDER_PX_PER_SPRITE_PX = 2;
const RENDER_PX_PER_UNIT = RENDER_PX_PER_SPRITE_PX / CHARACTER_SHEET.unitsPerPixel;

function framedPose(view, aspect, outPosition, outTarget) {
    const frame = aspect < 1 && view.portrait ? { ...view, ...view.portrait } : view;
    const { target } = frame;
    const fitWidth = frame.width / 2 / (TAN_HALF_FOV * aspect);
    const fitHeight = frame.height / 2 / TAN_HALF_FOV;
    const distance = frame.fit === "cover" ? Math.min(fitWidth, fitHeight) : Math.max(fitWidth, fitHeight);
    outTarget.copy(target);
    outPosition.copy(target).addScaledVector(view.direction, distance);
}

// Pixel ratio for the reduced-resolution render: chosen from the room view so
// each sprite pixel covers exactly RENDER_PX_PER_SPRITE_PX render pixels, then
// CSS upscales with crisp pixels.
export function roomPixelRatio(width, height) {
    const position = new THREE.Vector3();
    framedPose(VIEWS.room, width / Math.max(height, 1), position, new THREE.Vector3());
    const cssPxPerUnit = height / 2 / (position.distanceTo(CHARACTER_FOCUS) * TAN_HALF_FOV);
    return THREE.MathUtils.clamp(RENDER_PX_PER_UNIT / cssPxPerUnit, 0.3, 1);
}

function CameraRig() {
    const { camera, size } = useThree();
    const { focusedTarget } = useInteraction();
    const look = useRef(new THREE.Vector3());
    const placed = useRef(false);
    const dest = useMemo(() => ({ position: new THREE.Vector3(), target: new THREE.Vector3() }), []);
    const aspect = size.width / Math.max(size.height, 1);

    useFrame((_, delta) => {
        const view = focusedTarget === "monitor" ? VIEWS.monitor : VIEWS.room;
        framedPose(view, aspect, dest.position, dest.target);

        if (!placed.current) {
            camera.position.copy(dest.position);
            look.current.copy(dest.target);
            placed.current = true;
        }

        // Exponential damping stays in [0, 1) even after a long frame gap.
        const t = 1 - Math.exp(-delta * 5);
        camera.position.lerp(dest.position, t);
        look.current.lerp(dest.target, t);
        camera.lookAt(look.current);
    });

    return null;
}

export default CameraRig;
