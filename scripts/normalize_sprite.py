"""
Normalize a loosely-gridded character sprite sheet into a strict, aligned grid.

The source sheets we get from image generators place the character at a
slightly different offset in every cell, which makes a UV-stepping animation
jitter. This script crops every cell to its alpha bounding box and re-packs the
frames into uniform cells, aligned bottom-centre (the seated baseline).

Usage:
    python scripts/normalize_sprite.py public/character/idle.png public/character/idle-aligned.png --cols 4 --rows 4

Prints the output cell size; keep it in sync with src/scene/characterClips.js.
"""
import argparse

from PIL import Image

ALPHA_CUTOFF = 20
PAD = 4


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("src")
    parser.add_argument("dst")
    parser.add_argument("--cols", type=int, default=4)
    parser.add_argument("--rows", type=int, default=4)
    args = parser.parse_args()

    sheet = Image.open(args.src).convert("RGBA")
    cell_w = sheet.width / args.cols
    cell_h = sheet.height / args.rows

    frames = []
    for row in range(args.rows):
        for col in range(args.cols):
            cell = sheet.crop((
                round(col * cell_w), round(row * cell_h),
                round((col + 1) * cell_w), round((row + 1) * cell_h),
            ))
            mask = cell.getchannel("A").point(lambda v: 255 if v > ALPHA_CUTOFF else 0)
            bbox = mask.getbbox()
            if bbox is None:
                raise SystemExit(f"Empty frame at row {row}, col {col}")
            cropped = cell.crop(bbox)
            # Drop the faint anti-aliased fringe so nearest filtering stays crisp.
            alpha = cropped.getchannel("A").point(lambda v: 255 if v > ALPHA_CUTOFF else 0)
            cropped.putalpha(alpha)
            frames.append(cropped)

    out_w = max(f.width for f in frames) + PAD * 2
    out_h = max(f.height for f in frames) + PAD
    # Even widths keep the horizontal centre on a whole pixel.
    out_w += out_w % 2

    out = Image.new("RGBA", (out_w * args.cols, out_h * args.rows), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        row, col = divmod(i, args.cols)
        x = col * out_w + (out_w - frame.width) // 2
        y = row * out_h + (out_h - frame.height)
        out.alpha_composite(frame, (x, y))

    out.save(args.dst, optimize=True)
    print(f"cell {out_w}x{out_h}, sheet {out.width}x{out.height}, frames {len(frames)}")


if __name__ == "__main__":
    main()
