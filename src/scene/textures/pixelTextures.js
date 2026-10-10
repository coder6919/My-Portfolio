// pixelTextures.js
// Small, deterministic pixel-art textures generated on a canvas. Each texture
// is built once and cached; the same seed always draws the same pixels.
//
// Density convention: 16 texels per world unit, so a 64px tile spans 4 units.
// Pair them with the size-aware UVs in uv.js so every surface keeps that
// density instead of stretching one tile across a whole face.
import * as THREE from "three";
import { PALETTE as P } from "./palette";

export const TEXELS_PER_UNIT = 16;

const cache = new Map();

// mulberry32: tiny seeded PRNG.
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

export function buildTexture(key, width, height, draw, { repeat = true, mipmaps = true } = {}) {
    if (cache.has(key)) return cache.get(key);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const px = (x, y, color, w = 1, h = 1) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    };
    draw(px, rng(hash(key)), ctx);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    // Nearest mipmaps keep distant floor/walls from sparkling at low resolution
    // without blurring the pixels. Text skips them so glyphs never drop a level.
    texture.minFilter = mipmaps ? THREE.NearestMipmapNearestFilter : THREE.NearestFilter;
    texture.generateMipmaps = mipmaps;
    if (repeat) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    }
    cache.set(key, texture);
    return texture;
}

function hash(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
    return h >>> 0;
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)];

// ---------------------------------------------------------------- wood

const WOOD_TONES = {
    floor: { base: [P.wood, P.woodMid, P.wood, P.woodDark], grain: P.woodDark, seam: P.woodDeep, hi: P.woodLight },
    desk: { base: [P.woodMid, P.woodLight, P.woodMid, P.wood], grain: P.wood, seam: P.woodDark, hi: P.woodHi },
    dark: { base: [P.woodDark, P.wood, P.woodDark], grain: P.woodDeep, seam: P.woodDeep, hi: P.woodMid },
};

/** Boards running along u, 8 texels (0.5 units) wide, staggered end joints. */
export function planks(tone = "floor") {
    const t = WOOD_TONES[tone];
    return buildTexture(`planks-${tone}`, 64, 64, (px, rand) => {
        for (let row = 0; row < 8; row++) {
            const y = row * 8;
            const joint = Math.floor(rand() * 64);
            const segments = [
                [0, joint],
                [joint, 64],
            ];
            for (const [a, b] of segments) {
                px(a, y, pick(rand, t.base), b - a, 8);
                px(a, y + 1, t.hi, b - a, 1); // light catch on the board's upper edge
                // Grain: short darker runs.
                for (let i = 0; i < 6; i++) {
                    const gx = a + Math.floor(rand() * Math.max(1, b - a));
                    const gy = y + 2 + Math.floor(rand() * 5);
                    px(gx, gy, t.grain, 3 + Math.floor(rand() * 8), 1);
                }
            }
            px(joint, y, t.seam, 1, 8);
            px(0, y + 7, t.seam, 64, 1); // gap between boards
            if (rand() < 0.5) px(Math.floor(rand() * 60) + 2, y + 3, t.seam); // nail
        }
    });
}

/** Furniture wood: long grain streaks along u and the odd knot. */
export function woodGrain(tone = "desk") {
    const t = WOOD_TONES[tone];
    return buildTexture(`grain-${tone}`, 64, 64, (px, rand) => {
        px(0, 0, t.base[0], 64, 64);
        for (let y = 0; y < 64; y++) {
            if (rand() < 0.35) px(0, y, t.base[1], 64, 1);
        }
        for (let i = 0; i < 70; i++) {
            px(Math.floor(rand() * 64), Math.floor(rand() * 64), rand() < 0.75 ? t.grain : t.hi, 4 + Math.floor(rand() * 14), 1);
        }
        for (let i = 0; i < 2; i++) {
            const kx = Math.floor(rand() * 58) + 3;
            const ky = Math.floor(rand() * 58) + 3;
            px(kx - 2, ky - 1, t.grain, 5, 3);
            px(kx - 1, ky, t.seam, 3, 1);
        }
    });
}

// ---------------------------------------------------------------- walls

/**
 * Matte plaster: soft mottled patches and sparse dither. No continuous
 * vertical lines; those read as wood panelling.
 */
export function plaster() {
    return buildTexture("plaster", 64, 64, (px, rand) => {
        px(0, 0, P.wall, 64, 64);
        for (let i = 0; i < 18; i++) {
            const w = 4 + Math.floor(rand() * 10);
            const h = 3 + Math.floor(rand() * 8);
            px(Math.floor(rand() * 64), Math.floor(rand() * 64), rand() < 0.6 ? P.wallLight : P.wallDeep, w, h);
        }
        for (let i = 0; i < 180; i++) {
            px(Math.floor(rand() * 64), Math.floor(rand() * 64), pick(rand, [P.wallLight, P.wallDeep]));
        }
    });
}

// ---------------------------------------------------------------- fabric

/** Tight woven fabric (chair cushions). */
export function weave(base = P.navy, light = P.navyMid, dark = P.navyDeep) {
    return buildTexture(`weave-${base}`, 16, 16, (px, rand) => {
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                const on = (x + y) % 2 === 0;
                px(x, y, on ? base : (y % 4 === 0 ? dark : light));
            }
        }
        for (let i = 0; i < 6; i++) px(Math.floor(rand() * 16), Math.floor(rand() * 16), light);
    });
}

/** Patchwork quilt with stitched seams. */
export function quilt() {
    const patches = [P.navyMid, P.plum, P.teal, P.navy, P.rust, P.navyLight, P.sage];
    return buildTexture("quilt", 64, 64, (px, rand) => {
        for (let gy = 0; gy < 4; gy++) {
            for (let gx = 0; gx < 4; gx++) {
                const x = gx * 16;
                const y = gy * 16;
                const color = patches[(gx * 3 + gy * 5 + Math.floor(rand() * 2)) % patches.length];
                px(x, y, color, 16, 16);
                // Pattern inside the patch: a small diamond or dots.
                if (rand() < 0.5) {
                    for (let i = 0; i < 4; i++) {
                        px(x + 7 - i, y + 4 + i, P.cream);
                        px(x + 8 + i, y + 4 + i, P.cream);
                        px(x + 4 + i, y + 8 + i, P.cream);
                        px(x + 11 - i, y + 8 + i, P.cream);
                    }
                } else {
                    for (let dy = 3; dy < 16; dy += 5) for (let dx = 3; dx < 16; dx += 5) px(x + dx, y + dy, P.creamShade);
                }
                // Stitches along the seams.
                for (let i = 0; i < 16; i += 3) {
                    px(x + i, y, P.creamDeep);
                    px(x, y + i, P.creamDeep);
                }
                px(x, y + 15, P.navyDeep, 16, 1);
                px(x + 15, y, P.navyDeep, 1, 16);
            }
        }
    });
}

/** Soft linen: cream with faint woven lines (pillows, sheets). */
export function linen() {
    return buildTexture("linen", 32, 32, (px, rand) => {
        px(0, 0, P.cream, 32, 32);
        for (let y = 0; y < 32; y += 4) px(0, y, P.creamShade, 32, 1);
        for (let i = 0; i < 40; i++) px(Math.floor(rand() * 32), Math.floor(rand() * 32), P.creamShade);
    });
}

/** Woven rug, drawn once to fit the rug plane (not tiled). */
export function rug() {
    return buildTexture("rug", 96, 72, (px, rand) => {
        px(0, 0, P.navy, 96, 72);
        // Border bands.
        px(2, 2, P.rust, 92, 68);
        px(4, 4, P.navyDeep, 88, 64);
        px(6, 6, P.mustard, 84, 60);
        px(7, 7, P.navy, 82, 58);
        // Central medallion field of diamonds.
        for (let cy = 14; cy < 66; cy += 14) {
            for (let cx = 14; cx < 90; cx += 14) {
                const color = (cx + cy) % 28 === 0 ? P.rustLight : P.navyMid;
                for (let i = 0; i <= 5; i++) {
                    px(cx - i, cy - 5 + i, color, i * 2 + 1, 1);
                    px(cx - i, cy + 5 - i, color, i * 2 + 1, 1);
                }
                px(cx, cy, P.cream);
            }
        }
        // Worn speckle so it doesn't look printed.
        for (let i = 0; i < 160; i++) px(Math.floor(rand() * 96), Math.floor(rand() * 72), pick(rand, [P.navyDeep, P.navyMid]));
        // Fringe along the short ends.
        for (let y = 3; y < 69; y += 2) {
            px(0, y, P.creamShade, 2, 1);
            px(94, y, P.creamShade, 2, 1);
        }
    }, { repeat: false });
}

// ---------------------------------------------------------------- books

const SPINES = [
    [P.plum, P.plumLight],
    [P.navyMid, P.navyLight],
    [P.rust, P.rustLight],
    [P.sage, P.sageLight],
    [P.mustard, P.mustardLight],
    [P.teal, P.tealLight],
    [P.cream, P.creamShade],
    [P.ink, P.navyMid],
];

/**
 * A packed shelf of book spines with varied widths and heights. The area
 * above shorter books shows the shelf's dark back.
 */
export function bookRow(seedKey = "books") {
    return buildTexture(`books-${seedKey}`, 64, 48, (px, rand) => {
        px(0, 0, P.woodDeep, 64, 48);
        let x = 0;
        while (x < 64) {
            const w = 3 + Math.floor(rand() * 4);
            const h = 30 + Math.floor(rand() * 17);
            const [body, band] = pick(rand, SPINES);
            const top = 48 - h;
            if (rand() < 0.12 && x > 0) {
                // A gap with a book leaning into it.
                px(x, 48 - 26, body, 2, 26);
                x += 3;
                continue;
            }
            px(x, top, body, w, h);
            px(x, top, P.woodDeep, 1, h); // gap/shadow between spines
            px(x + 1, top + 3, band, w - 1, 2); // head band
            px(x + 1, 48 - 6, band, w - 1, 1); // tail band
            // Title: a short pale bar.
            if (w > 3) px(x + Math.floor(w / 2), top + 9, P.cream, 1, Math.min(12, h - 16));
            x += w;
        }
    }, { repeat: false });
}
