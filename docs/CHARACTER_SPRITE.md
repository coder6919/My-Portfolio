# Seated character sprite

The character at the desk is a camera-facing sprite (`src/scene/Character.jsx`)
driven by the clip manifest in `src/scene/characterClips.js`.

## Asset

`public/character/seated-sheet.png` is drawn procedurally by
`scripts/generate_seated_sprite.py` (Pillow only, deterministic):

```bash
python scripts/generate_seated_sprite.py --preview preview.png
```

| Property | Value |
| --- | --- |
| Format | PNG, RGBA, alpha strictly 0 or 255 |
| Layout | 4 columns × 6 rows, row-major |
| Cell | 64 × 96 native px, upscaled ×4 nearest-neighbour → 256 × 384 |
| Sheet | 1024 × 2304 |
| Figure | head to hips (the legs are 3D, see Viewpoint) |
| Hip centre | x = 22 native px in every frame (the sprite's anchor) |

The hips are pixel-identical in all 24 frames. The head, torso top, and arms
move.

`public/character/idle.png` is the earlier front-facing placeholder. It's no
longer loaded.

## Viewpoint

The room camera is a perspective camera framed like the reference
(`src/scene/CameraRig.jsx`). It looks over the character's shoulder at the
window wall, about 29° off directly behind him (the chair is yawed −0.35 rad
toward the monitor) and 25° above. The sprite shows:

- the back of the head and hoodie;
- the right ear and a sliver of cheek;
- the back corner of the glasses.

He faces up and to the right. Turning toward the mug (`turn` 0 to 1 in the
generator) reveals the profile, lens, and eye.

Forearms reaching forward to the keyboard are hidden behind his head and
torso. That's physically right from this angle, so typing reads through the
elbows and shoulders.

The sprite ends at the hips. From this camera his feet would sit on the floor
below the cell, so the legs are 3D geometry (`src/scene/CharacterLegs.jsx`)
under the desk.

## Rows and clips

| Row | Frames | Clip | Content |
| --- | --- | --- | --- |
| 0 | 0–3 | `idle` | rest, inhale (shoulders/head +1px), elbow shifted, small head tilt |
| 1 | 4–7 | `typing` | four poses: elbows and shoulders shift as the hidden hands move |
| 2 | 8–11 | `adjustGlasses` | lift, touch the frame, push it up (glasses move 1px), lower |
| 3 | 12–15 | `lookAtMug` | head turns toward the mug in two steps, leans, hand lifts |
| 4 | 16–19 | `reachMug` | arm extends right, open hand, grip |
| 5 | 20–23 | `drink` | lift, at the lips (head in profile), sip (held), lower |
| — | 19→12 | `returnMug` | put-down: the reach frames in reverse, then the head turns back |

`returnMug` has no row of its own. It reuses row 4 in reverse.

## Mug

The mug is never drawn into the sprite. Frames that hold it carry
`mug: [x, y, tilt]` in native cell pixels (printed by the generator). The
controller converts that point to world space along the camera's right and up
axes and writes it to `mugState`. `CoffeeMug` glides there and tilts toward
the face. The held mug sits just behind the sprite plane, so the hand pixels
draw over the handle and the cheek hides the part at the lips.

The desk mug sits within the sprite's reach (beside the keyboard), so the hand
closes on it with only a few pixels of glide. The keyboard was moved in front
of the chair for the same reason: a 64px cell can't reach the original
keyboard and mug positions.

## Rendering notes

- **Filtering:** nearest-neighbour, no mipmaps, `alphaTest` 0.5.
- **Depth bias:** the sprite is slid 0.35 units toward the camera every frame.
  That stops the arms (which lean into the scene on a camera-facing plane)
  from clipping into the keyboard. With the perspective camera it also scales
  the sprite up about 2%. The chair backrest stays closer and hides the lower
  back.
- **Resolution:** the scene renders at low resolution, with the pixel ratio
  chosen so sprite pixels land about 1:1 (`roomPixelRatio` in `CameraRig.jsx`).
- **Lamp tint:** sprites are unlit, so the material colour follows the desk
  lamp: full colour when on, dim blue when off.

## Using an externally drawn sheet instead

Any 4 × 6 sheet with this row layout works. If its cells aren't aligned, run
`scripts/normalize_sprite.py <src> <dst> --cols 4 --rows 6`. Then update
`CHARACTER_SHEET` (`cellWidth`, `cellHeight`, `hipX`, `unitsPerPixel`) and the
`mug` anchors.
