import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import {
    CHARACTER_SHEET,
    CHARACTER_CLIPS,
    WORK_CYCLE,
    DRINK_SEQUENCE,
    hasClip,
    pickDuration,
} from "./characterClips";
import { onCharacterEvent, REQUEST_DRINK, mugState } from "../interactions/characterEvents";
import { useInteraction } from "../interactions/InteractionContext";

const { columns, rows, cellWidth, cellHeight, hipX, unitsPerPixel } = CHARACTER_SHEET;

// The sprite is a camera-facing plane, so its upper-right part (the arms)
// reaches deep into the scene and would clip into the keyboard and desk.
// Sliding it toward the camera doesn't change where it appears (orthographic
// camera) but keeps the arms in front of the desk; the chair backrest is
// still closer and keeps hiding the lower body.
const SPRITE_DEPTH_BIAS = 0.35;
// The held mug sits just behind the sprite plane: the sprite's hand pixels
// draw over the handle, and the face hides the part of the mug at the lips.
const MUG_TOWARD_CAMERA = -0.15;
// Mug group origin is its base; anchors mark where the hand grips (mid-body).
const MUG_GRIP_HEIGHT = 0.16;

// Sprites are unlit, so follow the desk lamp by tinting: near full colour under the
// lamp (slightly warm, so it sits in the lamplight), dim moonlit blue without it.
const LAMP_ON_TINT = new THREE.Color("#f2e6da");
const LAMP_OFF_TINT = new THREE.Color("#7f88ad");

const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _towardCamera = new THREE.Vector3();

// Sprite-sheet animation controller. Plays one clip at a time and walks the
// WORK_CYCLE routine, skipping any state the sheet has no frames for. All
// timing lives in plain objects so animation never causes React re-renders.
function createAnimator(texture) {
    const anim = {
        state: null,
        clip: null,
        frame: 0,
        frameTime: 0,
        stateTime: 0,
        stateDuration: null,
        cycleIndex: 0,
        queue: [],
    };

    const showFrame = () => {
        const { index } = anim.clip.frames[anim.frame];
        const column = index % columns;
        const row = Math.floor(index / columns);
        texture.offset.set(column / columns, 1 - (row + 1) / rows);
    };

    const start = (state, duration) => {
        if (!hasClip(state)) return false;
        anim.state = state;
        anim.clip = CHARACTER_CLIPS[state];
        anim.frame = 0;
        anim.frameTime = pickDuration(anim.clip.frames[0].hold);
        anim.stateTime = 0;
        anim.stateDuration = duration != null ? pickDuration(duration) : null;
        showFrame();
        return true;
    };

    const next = () => {
        while (anim.queue.length) {
            if (start(anim.queue.shift())) return;
        }
        for (let i = 0; i < WORK_CYCLE.length; i++) {
            const step = WORK_CYCLE[anim.cycleIndex];
            anim.cycleIndex = (anim.cycleIndex + 1) % WORK_CYCLE.length;
            if (start(step.state, step.duration)) return;
        }
        start("idle");
    };

    const tick = (delta) => {
        if (!anim.clip) return;
        anim.stateTime += delta;
        anim.frameTime -= delta;
        if (anim.frameTime > 0) return;

        const { frames, loop } = anim.clip;
        const atEnd = anim.frame === frames.length - 1;
        const expired = anim.stateDuration != null && anim.stateTime >= anim.stateDuration;

        // A queued request (mug click) cuts a looping clip at a frame boundary;
        // every clip starts from the same seated base pose, so nothing jumps.
        if ((atEnd && !loop) || (atEnd && expired) || (loop && anim.queue.length)) {
            next();
            return;
        }

        anim.frame = (anim.frame + 1) % frames.length;
        anim.frameTime = pickDuration(frames[anim.frame].hold);
        showFrame();
    };

    const request = (states) => {
        const playable = states.filter(hasClip);
        // Ignore repeat clicks while a sequence is queued or already playing.
        if (!playable.length || anim.queue.length || playable.includes(anim.state)) return;
        anim.queue.push(...playable);
        // Don't sit out a long rest hold before reacting to the click.
        if (anim.clip?.loop) anim.frameTime = Math.min(anim.frameTime, 0.08);
    };

    // Hand anchor for the current frame in sheet pixels: [x, y, tilt?], or null.
    const currentMugAnchor = () => anim.clip?.frames[anim.frame].mug ?? null;

    return { next, tick, request, currentMugAnchor };
}

// position: world point under the hips at the bottom of the cell.
function Character({ position = [-0.85, 1.06, 1.4] }) {
    const sourceTexture = useLoader(THREE.TextureLoader, CHARACTER_SHEET.url);

    // Own copy so offset/repeat changes never leak into the loader cache.
    const texture = useMemo(() => {
        const tex = sourceTexture.clone();
        tex.repeat.set(1 / columns, 1 / rows);
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.generateMipmaps = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        return tex;
    }, [sourceTexture]);

    const { lampOn } = useInteraction();
    const spriteRef = useRef(null);
    const animator = useMemo(() => createAnimator(texture), [texture]);
    const origin = useMemo(() => new THREE.Vector3(...position), [position]);

    useEffect(() => {
        animator.next();
        const off = onCharacterEvent(REQUEST_DRINK, () => animator.request(DRINK_SEQUENCE));
        return () => {
            off();
            mugState.held = false;
            texture.dispose();
        };
    }, [animator, texture]);

    useFrame(({ camera }, delta) => {
        // Clamp so a backgrounded tab doesn't skip through a whole clip at once.
        animator.tick(Math.min(delta, 0.1));

        camera.matrixWorld.extractBasis(_right, _up, _towardCamera);
        const sprite = spriteRef.current;
        if (sprite) {
            sprite.position.copy(origin).addScaledVector(_towardCamera, SPRITE_DEPTH_BIAS);
            sprite.material.color.lerp(lampOn ? LAMP_ON_TINT : LAMP_OFF_TINT, 1 - Math.exp(-delta * 9));
        }

        const anchor = animator.currentMugAnchor();
        mugState.held = Boolean(anchor);
        if (!anchor || !sprite) return;

        // Sprite is camera-facing and anchored at the hips, so a sheet pixel
        // maps to world space along the camera's right/up axes.
        const [px, py, tilt = 0] = anchor;
        mugState.position
            .copy(sprite.position)
            .addScaledVector(_right, (px - hipX) * unitsPerPixel)
            .addScaledVector(_up, (cellHeight - py) * unitsPerPixel - MUG_GRIP_HEIGHT)
            .addScaledVector(_towardCamera, MUG_TOWARD_CAMERA);
        mugState.tilt = tilt;
    });

    return (
        <sprite
            ref={spriteRef}
            position={position}
            center={[hipX / cellWidth, 0]}
            scale={[cellWidth * unitsPerPixel, cellHeight * unitsPerPixel, 1]}
            renderOrder={10}
        >
            <spriteMaterial
                map={texture}
                transparent
                alphaTest={0.5}
                depthWrite={false}
                depthTest={true}
            />
        </sprite>
    );
}

export default Character;
