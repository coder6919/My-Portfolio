// hoverLabel.js
// Which interactive object the pointer is over, and where its label goes.
// A tiny external store: the DOM label re-renders only when the hovered
// object changes; its per-frame position is written straight to the element
// by HoverTracker (inside the canvas), never through React state.
import { useMemo } from "react";
import * as THREE from "three";

let current = null; // { id, label, hint, anchor: Vector3, anchorBelow: Vector3 }
const listeners = new Set();

export const hoverStore = {
    get: () => current,
    set(value) {
        current = value;
        listeners.forEach((fn) => fn());
    },
    subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },
};

// The label's DOM node, registered by <HoverLabel /> while it's mounted.
export const labelElementRef = { current: null };

const _box = new THREE.Box3();

/**
 * Pointer handlers for an interactive object: pointer cursor plus a label
 * anchored at the top-centre of the hovered group. Spread onto the group that
 * has the onClick. (Use inside loops; components should prefer useHoverLabel.)
 */
export function hoverHandlers(label, hint) {
    return {
        onPointerOver: (e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            if (e.pointerType === "touch") return; // no hover on touch screens
            _box.setFromObject(e.eventObject);
            const cx = (_box.min.x + _box.max.x) / 2;
            const cz = (_box.min.z + _box.max.z) / 2;
            hoverStore.set({
                id: e.eventObject.uuid,
                label,
                hint,
                anchor: new THREE.Vector3(cx, _box.max.y, cz), // label above the object...
                anchorBelow: new THREE.Vector3(cx, _box.min.y, cz), // ...or below when there's no room
            });
        },
        onPointerOut: (e) => {
            document.body.style.cursor = "default";
            if (hoverStore.get()?.id === e.eventObject.uuid) hoverStore.set(null);
        },
    };
}

export function useHoverLabel(label, hint) {
    return useMemo(() => hoverHandlers(label, hint), [label, hint]);
}
