// cityTextures.js
// The night view through the window: sky, moon, three skyline layers and
// glass glare. Deterministic like every other generated texture; the skyline
// layers are transparent above the rooftops so they can be stacked at
// different depths for parallax.
import { buildTexture } from "./pixelTextures";

const CLEAR = { repeat: false };

// mulberry32, seeded per layer so each skyline is stable.
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

/** Night sky: dithered bands from deep navy to a plum haze at the horizon, with stars. */
export function skyTexture() {
    return buildTexture("city-sky", 256, 150, (px) => {
        const rand = rng(11);
        const bands = ["#0a0c22", "#0d1130", "#11173a", "#171d48", "#1f2354", "#2a285e", "#372d66", "#46336a", "#563a6c"];
        const bandH = 150 / bands.length;
        bands.forEach((color, i) => {
            const y0 = Math.round(i * bandH);
            px(0, y0, color, 256, Math.ceil(bandH));
            // Checker dither into the band above for a soft transition.
            if (i > 0) {
                for (let x = 0; x < 256; x += 2) px(x, y0, bands[i - 1]);
                for (let x = 1; x < 256; x += 2) px(x, y0 + 1, bands[i - 1]);
            }
        });
        // Stars, thinning toward the hazy horizon.
        for (let i = 0; i < 110; i++) {
            const y = Math.floor(rand() * rand() * 120);
            px(Math.floor(rand() * 256), y, rand() < 0.3 ? "#e6e9ff" : "#8f9ad8");
        }
        // A few bright stars with a little cross.
        for (let i = 0; i < 7; i++) {
            const x = 6 + Math.floor(rand() * 244);
            const y = 4 + Math.floor(rand() * 60);
            px(x, y, "#ffffff");
            px(x - 1, y, "#9aa6e6");
            px(x + 1, y, "#9aa6e6");
            px(x, y - 1, "#9aa6e6");
            px(x, y + 1, "#9aa6e6");
        }
    }, CLEAR);
}

/** Full moon with soft craters and a shaded limb. */
export function moonTexture() {
    return buildTexture("city-moon", 32, 32, (px) => {
        const rand = rng(21);
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                const dx = x - 15.5;
                const dy = y - 15.5;
                const d = Math.hypot(dx, dy);
                if (d > 13) continue;
                // Lit from the upper left: the lower-right limb shades.
                const shade = dx * 0.5 + dy * 0.6 > 7 ? "#cfc6a8" : "#efe9d2";
                px(x, y, d > 12 ? "#dcd4b8" : shade);
            }
        }
        for (const [cx, cy, r] of [[11, 10, 3], [19, 17, 2], [13, 20, 2], [21, 9, 1]]) {
            for (let y = -r; y <= r; y++) {
                for (let x = -r; x <= r; x++) {
                    if (x * x + y * y <= r * r && rand() < 0.85) px(cx + x, cy + y, "#d6ccb0");
                }
            }
        }
    }, CLEAR);
}

/** Soft halo around the moon: three flat rings of decreasing strength. */
export function moonGlowTexture() {
    return buildTexture("city-moon-glow", 64, 64, (px) => {
        for (let y = 0; y < 64; y++) {
            for (let x = 0; x < 64; x++) {
                const d = Math.hypot(x - 31.5, y - 31.5);
                const alpha = d < 16 ? 0.55 : d < 22 ? 0.3 : d < 29 ? 0.12 : 0;
                if (alpha) px(x, y, `rgba(142,160,232,${alpha})`);
            }
        }
    }, CLEAR);
}

// Sizes are in texels; the planes in Window.jsx fix the world size, so these
// set the detail level (about 20 texels per world unit).
const LAYERS = {
    far: {
        seed: 31, width: 384, height: 128, minH: 36, maxH: 92, minW: 12, maxW: 34,
        body: "#262850", rim: "#34376a", lit: ["#a8976a", "#8a90c4"], litChance: 0.3,
        win: { w: 1, h: 1, sx: 3, sy: 3 }, details: 0.2,
    },
    mid: {
        seed: 41, width: 320, height: 144, minH: 48, maxH: 124, minW: 16, maxW: 40,
        body: "#1c1b3a", rim: "#2f2f5a", lit: ["#e8c46a", "#f2d58c", "#9cc4ff", "#e8955a"], litChance: 0.45,
        unlit: "#131230", win: { w: 2, h: 2, sx: 4, sy: 5 }, details: 0.35,
    },
    near: {
        seed: 51, width: 256, height: 160, minH: 60, maxH: 150, minW: 22, maxW: 48,
        body: "#0f0d1e", rim: "#25223f", lit: ["#f0c25e", "#ffd98a", "#a8ccff", "#ef9a5a", "#f0c25e"], litChance: 0.5,
        unlit: "#09081a", win: { w: 2, h: 3, sx: 5, sy: 6 }, details: 0.5,
    },
};

// Where each layer's windows and antenna beacons are, recorded while drawing
// so the ambience can switch windows on/off and blink beacons later.
// { windows: [{ x, y, w, h, on, litColor, offColor }], beacons: [{ x, y, off }] }
export const SKYLINE_META = new Map();

/** One skyline layer: buildings with rooftop details and a grid of windows. */
export function skylineTexture(name) {
    const L = LAYERS[name];
    return buildTexture(`city-${name}`, L.width, L.height, (px) => {
        const rand = rng(L.seed);
        const meta = { windows: [], beacons: [] };
        SKYLINE_META.set(name, meta);
        let x = 0;
        while (x < L.width) {
            const w = L.minW + Math.floor(rand() * (L.maxW - L.minW));
            const h = L.minH + Math.floor(rand() * (L.maxH - L.minH));
            const top = L.height - h;
            px(x, top, L.body, w, h);
            px(x, top, L.rim, w, 1); // moonlit roof edge
            // Stepped crown on some towers.
            if (rand() < 0.3 && w > 10) {
                const inset = 2 + Math.floor(rand() * 3);
                const crown = 3 + Math.floor(rand() * 5);
                px(x + inset, top - crown, L.body, w - inset * 2, crown);
                px(x + inset, top - crown, L.rim, w - inset * 2, 1);
            }
            // Rooftop details: antenna with a red beacon, or a water tower.
            if (rand() < L.details) {
                if (rand() < 0.5) {
                    const ax = x + Math.floor(w / 2);
                    const ah = 4 + Math.floor(rand() * 6);
                    px(ax, top - ah, L.rim, 1, ah);
                    px(ax, top - ah - 1, "#ff5a4a");
                    meta.beacons.push({ x: ax, y: top - ah - 1, off: L.rim });
                } else if (w > 8) {
                    const tx = x + 2 + Math.floor(rand() * (w - 7));
                    px(tx, top - 5, L.body, 5, 3);
                    px(tx + 1, top - 2, L.body, 1, 2);
                    px(tx + 3, top - 2, L.body, 1, 2);
                    px(tx, top - 5, L.rim, 5, 1);
                }
            }
            // Windows.
            const { w: ww, h: wh, sx, sy } = L.win;
            for (let wy = top + 3; wy < L.height - 2; wy += sy) {
                // Whole floors are sometimes dark, like real buildings at night.
                const floorLit = rand() < 0.8;
                for (let wx = x + 2; wx + ww <= x + w - 1; wx += sx) {
                    const offColor = L.unlit ?? L.body;
                    if (floorLit && rand() < L.litChance) {
                        const litColor = L.lit[Math.floor(rand() * L.lit.length)];
                        px(wx, wy, litColor, ww, wh);
                        meta.windows.push({ x: wx, y: wy, w: ww, h: wh, on: true, litColor, offColor });
                    } else {
                        if (L.unlit) px(wx, wy, L.unlit, ww, wh);
                        const litColor = L.lit[(wx + wy) % L.lit.length];
                        meta.windows.push({ x: wx, y: wy, w: ww, h: wh, on: false, litColor, offColor });
                    }
                }
            }
            x += w + (rand() < 0.25 ? 1 + Math.floor(rand() * 3) : 0);
        }
    }, CLEAR);
}

/** Faint diagonal glare streaks for the window glass (mostly transparent). */
export function glassGlareTexture() {
    return buildTexture("glass-glare", 64, 48, (px) => {
        const streak = (start, width, color) => {
            for (let y = 0; y < 48; y++) {
                const x0 = start - y;
                px(x0, y, color, width, 1);
            }
        };
        streak(40, 3, "#ffffff59");
        streak(48, 1, "#ffffff33");
        streak(70, 2, "#ffffff40");
    }, CLEAR);
}
