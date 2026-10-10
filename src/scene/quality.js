// quality.js
// Phones get the simpler look: no post-processing pass, everything else intact.
import { useSyncExternalStore } from "react";

const PHONE_QUERY = "(max-width: 767px), (pointer: coarse) and (max-width: 1024px)";

function subscribe(onChange) {
    const media = window.matchMedia(PHONE_QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
    return window.matchMedia(PHONE_QUERY).matches;
}

export function useIsPhone() {
    return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

// Decorative ambience (dust, city flicker, the passing plane) respects the
// visitor's "reduce motion" setting.
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange) {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
    return useSyncExternalStore(
        subscribeReducedMotion,
        () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
        () => false
    );
}
