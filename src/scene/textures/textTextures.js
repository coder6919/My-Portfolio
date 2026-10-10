// textTextures.js
// Textures that carry readable text, drawn with the bitmap pixel fonts.
// Each is sized so one texel covers slightly more than one render pixel at
// the room camera's distance, so glyph strokes never get dropped.
import { buildTexture } from "./pixelTextures";
import { drawText, measureText, FONT_5x7, FONT_3x5 } from "./pixelFont";
import { PALETTE as P } from "./palette";

const TEXT = { repeat: false, mipmaps: false };

// ---------------------------------------------------------------- monitor

export const MONITOR_MENU = ["whoami", "experience", "projects", "skills", "education", "contact"];

// Cursor cell on the 160x100 screen texture (the Monitor blinks a plane there).
export const MONITOR_CURSOR = { x: 17, y: 80, w: 5, h: 7, width: 160, height: 100 };

/** Terminal on the left, sunset wallpaper on the right (like the reference). */
export function monitorScreen() {
    return buildTexture("monitor-screen", 160, 100, (px) => {
        px(0, 0, "#0b0f1a", 160, 100);

        // Wallpaper: banded sunset with a little dithering between bands.
        const wx = 108;
        const wy = 4;
        const ww = 48;
        const wh = 56;
        const bands = ["#1a102a", "#2d163d", "#4b2256", "#7b3664", "#c45a69", "#f29e71"];
        const bandH = wh / bands.length;
        bands.forEach((color, i) => {
            const y0 = wy + Math.round(i * bandH);
            px(wx, y0, color, ww, Math.ceil(bandH));
            if (i > 0) for (let x = wx; x < wx + ww; x += 2) px(x + (i % 2), y0, bands[i - 1]);
        });
        px(wx + 34, wy + 9, "#ffe6b0", 5, 5); // sun
        px(wx + 35, wy + 8, "#ffe6b0", 3, 7);
        for (const [sx, sy] of [[4, 4], [14, 7], [22, 3], [41, 5], [9, 12]]) px(wx + sx, wy + sy, "#d9d2ff");
        // Two mountain ridges.
        for (let x = 0; x < ww; x++) {
            const far = Math.max(0, 18 - Math.abs(x - 14) * 0.9);
            const near = Math.max(0, 22 - Math.abs(x - 32) * 0.8);
            px(wx + x, wy + wh - Math.round(far), "#1e1333", 1, Math.round(far));
            px(wx + x, wy + wh - Math.round(near), "#120c22", 1, Math.round(near));
        }
        // Wallpaper frame.
        px(wx - 1, wy - 1, "#26344f", ww + 2, 1);
        px(wx - 1, wy + wh, "#26344f", ww + 2, 1);

        // Terminal.
        drawText(px, "syed@workspace:~$", 3, 4, "#5fd38d");
        MONITOR_MENU.forEach((item, i) => {
            const y = 17 + i * 10;
            const selected = i === 0;
            drawText(px, ">", 3, y, selected ? "#f2c14e" : "#5f7fbf");
            drawText(px, item, 12, y, selected ? "#f2c14e" : "#c9d4ea");
        });
        drawText(px, "~$", 3, MONITOR_CURSOR.y, "#5fd38d");

        // Now-playing widget under the wallpaper.
        drawText(px, "lofi.mp3", wx, 66, "#8a93b8");
        px(wx, 77, "#26344f", ww, 2);
        px(wx, 77, "#c45a69", 30, 2);

        // Status bar.
        px(0, 91, "#121a2b", 160, 9);
        px(4, 94, "#5fd38d", 3, 3);
        drawText(px, "online", 10, 92, "#8a93b8");
        drawText(px, "23:55", 160 - measureText("23:55") - 4, 92, "#8a93b8");
    }, TEXT);
}

// ---------------------------------------------------------------- drawers

/** Brass-edged label plate: folder icon in the drawer's accent colour + name. */
export function drawerLabel(text, accent) {
    return buildTexture(`drawer-${text}`, 64, 16, (px) => {
        px(0, 0, "#3a2a20", 64, 16);
        px(0, 0, "#7a5a3a", 64, 1);
        px(0, 0, "#7a5a3a", 1, 16);
        px(0, 15, "#1e140f", 64, 1);
        px(63, 0, "#1e140f", 1, 16);
        // Folder icon.
        px(3, 5, accent, 3, 1);
        px(3, 6, accent, 7, 6);
        px(4, 8, "#ffffff40", 5, 1);
        drawText(px, text, 13, 4, "#eadfc4");
    }, TEXT);
}

// ---------------------------------------------------------------- calendar

/** October 2026 page; today (the 10th) circled. */
export function calendarPage({ today = 10 } = {}) {
    return buildTexture("calendar-oct-2026", 64, 76, (px) => {
        px(0, 0, "#e6dcc4", 64, 76);
        // Header band with binding rings.
        px(0, 0, P.rust, 64, 5);
        for (const x of [14, 30, 46]) px(x, 0, "#2a1e1b", 3, 3);

        const title = "October";
        const year = "2026";
        const total = measureText(title) + 3 + measureText(year, FONT_3x5);
        const tx = Math.floor((64 - total) / 2);
        drawText(px, title, tx, 8, "#3b2d28");
        drawText(px, year, tx + measureText(title) + 3, 10, P.rust, FONT_3x5);

        // Weekday initials; weekends in rust.
        const cellX = (col) => 1 + col * 9;
        "SMTWTFS".split("").forEach((d, col) => {
            drawText(px, d, cellX(col) + 3, 18, col === 0 || col === 6 ? P.rust : "#6b6f80", FONT_3x5);
        });
        px(1, 24, "#c9bb9c", 62, 1);

        // Dates. October 1st 2026 is a Thursday.
        let day = 1;
        for (let row = 0; row < 5 && day <= 31; row++) {
            for (let col = row === 0 ? 4 : 0; col < 7 && day <= 31; col++, day++) {
                const label = String(day);
                const w = measureText(label, FONT_3x5);
                const x = cellX(col) + Math.floor((9 - w) / 2);
                const y = 27 + row * 7;
                let color = col === 0 || col === 6 ? P.rust : "#2f2a36";
                if (day === today) {
                    px(cellX(col), y - 1, P.rust, 9, 7);
                    color = "#f3ead6";
                }
                drawText(px, label, x, y, color, FONT_3x5);
            }
        }

        // Hint: the calendar opens the experience timeline.
        px(1, 62, "#c9bb9c", 62, 1);
        drawText(px, "experience", Math.floor((64 - measureText("experience")) / 2), 65, P.rust);
    }, TEXT);
}

// ---------------------------------------------------------------- posters

/**
 * Placeholder text poster: centred lines in the pixel font, the last line in
 * an accent colour. Real artwork replaces these via `src` in WallDecor.
 */
export function textPoster({ key, lines, width = 48, height = 64, background = "#1d1726", ink = "#e6dcc4", accent = "#5fb8d8" }) {
    return buildTexture(`poster-${key}`, width, height, (px) => {
        px(0, 0, background, width, height);
        // Thin inner border.
        px(2, 2, "#3a2f48", width - 4, 1);
        px(2, height - 3, "#3a2f48", width - 4, 1);
        px(2, 2, "#3a2f48", 1, height - 4);
        px(width - 3, 2, "#3a2f48", 1, height - 4);
        const top = Math.floor((height - lines.length * 10) / 2) + 1;
        lines.forEach((line, i) => {
            const color = i === lines.length - 1 ? accent : ink;
            drawText(px, line, Math.floor((width - measureText(line)) / 2), top + i * 10, color);
        });
    }, TEXT);
}

// ---------------------------------------------------------------- small props

/** Framed photo on the bookshelf: a pixel landscape at dusk. */
export function photoTexture() {
    return buildTexture("photo-dusk", 16, 20, (px) => {
        const sky = ["#2d163d", "#4b2256", "#7b3664", "#c45a69", "#f29e71"];
        sky.forEach((color, i) => px(0, i * 3, color, 16, 3));
        px(10, 5, "#ffe6b0", 3, 3); // sun
        for (let x = 0; x < 16; x++) {
            const h = Math.max(0, 7 - Math.abs(x - 5));
            px(x, 15 - h, "#1e1333", 1, h + 5);
        }
        px(0, 16, P.sage, 16, 4); // meadow
        px(3, 14, "#1a1418", 1, 2); // two tiny figures
        px(5, 14, "#1a1418", 1, 2);
    }, TEXT);
}

/** Alarm clock face: amber digits on black. */
export function clockFace(time = "23:55") {
    return buildTexture(`clock-${time}`, 24, 9, (px) => {
        px(0, 0, "#0c0a0e", 24, 9);
        drawText(px, time, Math.floor((24 - measureText(time, FONT_3x5)) / 2), 2, "#ffb347", FONT_3x5);
    }, TEXT);
}

// ---------------------------------------------------------------- books

const LABELED_BOOKS = [
    { filler: 4 },
    { lines: ["DSA"], body: P.rust, band: P.rustLight },
    { filler: 5 },
    { lines: ["SYSTEM", "DESIGN"], body: P.navyMid, band: P.navyLight },
    { lines: ["CLEAN", "CODE"], body: P.sage, band: P.sageLight },
    { filler: 4 },
    { lines: ["AI / ML"], body: P.plum, band: P.plumLight },
    { lines: ["WEB DEV"], body: P.mustard, band: P.mustardLight },
    { filler: 5 },
];
const FILLERS = [[P.teal, P.tealLight], [P.ink, P.navyMid], [P.cream, P.creamShade], [P.navy, P.navyMid], [P.woodLight, P.woodHi]];

/** The main shelf row: tall labeled spines (titles read bottom-to-top). */
export function labeledBooks() {
    return buildTexture("books-labeled", 84, 66, (px) => {
        px(0, 0, P.woodDeep, 84, 66);
        let x = 0;
        let fillerIndex = 0;
        for (const book of LABELED_BOOKS) {
            if (x >= 84) break;
            if (book.filler) {
                const [body, band] = FILLERS[fillerIndex++ % FILLERS.length];
                const h = 42 + ((fillerIndex * 7) % 16);
                px(x, 66 - h, body, book.filler, h);
                px(x + 1, 66 - h + 3, band, book.filler - 1, 2);
                px(x, 66 - h, P.woodDeep, 1, h);
                x += book.filler;
                continue;
            }
            // One 8px column per title line; the first line is the leftmost
            // (the top line when you tilt your head to read the spine).
            const w = 2 + book.lines.length * 8;
            px(x, 2, book.body, w, 64);
            px(x, 2, P.woodDeep, 1, 64);
            px(x + 1, 4, book.band, w - 1, 2);
            px(x + 1, 61, book.band, w - 1, 2);
            book.lines.forEach((line, i) => {
                const bottom = 58 - Math.floor((52 - measureText(line)) / 2);
                drawText(px, line, x + 2 + i * 8, bottom, "#f1e6cc", FONT_5x7, { vertical: true });
            });
            x += w;
        }
    }, TEXT);
}
