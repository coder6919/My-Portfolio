// characterEvents.js
// Shared channel between scene objects and the character animator.
// Kept outside React state so per-frame animation never triggers re-renders.
import * as THREE from "three";

const listeners = new Map();

export function onCharacterEvent(type, handler) {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type).add(handler);
    return () => listeners.get(type).delete(handler);
}

export function emitCharacterEvent(type, payload) {
    listeners.get(type)?.forEach((handler) => handler(payload));
}

// Event types
export const REQUEST_DRINK = "request-drink";

// Written by the character animator, read by the mug every frame.
// held: the mug follows `position` (world space) and `tilt` instead of resting on the desk.
export const mugState = {
    held: false,
    position: new THREE.Vector3(),
    tilt: 0,
};
