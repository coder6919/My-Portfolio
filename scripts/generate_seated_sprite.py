"""
Generate the seated character sprite sheet (rear three-quarter view).

Deterministic: no randomness, rerunning produces an identical PNG.

The character sits at the desk facing the monitor. The room camera looks over
his shoulder from behind (about 29 degrees off directly behind, 25 degrees
above), so the image shows the back of the head and hoodie, the right ear, a
sliver of cheek and the back corner of the glasses; he faces up and to the
right. Forearms reaching forward to the keyboard disappear behind his body.
The mug, desk, chair, keyboard and his legs (under the desk, drawn in 3D) are
never part of the sprite.

Layout: 4 columns x 6 rows, each cell 64x96 native pixels, upscaled 4x with
nearest-neighbour -> 1024x2304 PNG.

    row 0  idle            rest, inhale, rest (elbow shifted), head tilt
    row 1  typing          four alternating hand/forearm poses
    row 2  adjustGlasses   lift, touch frame, push up, lower
    row 3  lookAtMug       head turns toward the mug, lean, hand lifts
    row 4  reachMug        arm extends right, open hand, grip
    row 5  drink           lift, at the lips (head in profile), sip, lower

Usage:
    python scripts/generate_seated_sprite.py [--preview path.png]

Mug anchors used by src/scene/characterClips.js are printed at the end
(native pixels, cell-relative).
"""
import argparse
import math
from pathlib import Path

from PIL import Image, ImageDraw

W, H = 64, 96
SCALE = 4
COLS, ROWS = 4, 6
HIP_X = 22  # horizontal hip centre, identical in every frame
OUT = Path(__file__).resolve().parent.parent / "public" / "character" / "seated-sheet.png"

# ---------------------------------------------------------------- palette
C = {
    "outline": (12, 11, 16),
    "hair": (27, 26, 34),
    "hair_dark": (17, 16, 22),
    "hair_hi": (66, 64, 80),
    "hair_rim": (92, 84, 92),
    "skin": (238, 194, 166),
    "skin_hi": (250, 218, 194),
    "skin_sh": (210, 152, 128),
    "skin_deep": (168, 106, 92),
    "glasses": (10, 10, 14),
    "glint": (170, 208, 232),
    "eye": (36, 30, 40),
    "eye_white": (226, 224, 230),
    "hoodie": (46, 45, 56),
    "hoodie_sh": (32, 31, 40),
    "hoodie_hi": (82, 76, 86),
    "hoodie_side": (55, 53, 65),
    "hood_in": (20, 19, 26),
    "rib": (38, 37, 47),
    "trousers": (38, 42, 58),
    "trousers_sh": (27, 30, 42),
    "trousers_hi": (60, 65, 84),
    "shoe": (30, 28, 33),
    "shoe_hi": (58, 54, 60),
    "sole": (150, 146, 142),
}


# ---------------------------------------------------------------- mask helpers
def _mask_from(draw_fn):
    img = Image.new("L", (W, H), 0)
    draw_fn(ImageDraw.Draw(img))
    px = img.load()
    return {(x, y) for y in range(H) for x in range(W) if px[x, y]}


def poly(points):
    return _mask_from(lambda d: d.polygon(points, fill=1))


def capsule(p0, p1, r):
    def draw(d):
        d.line([p0, p1], fill=1, width=int(r * 2))
        for (x, y) in (p0, p1):
            d.ellipse((x - r + 0.5, y - r + 0.5, x + r - 0.5, y + r - 0.5), fill=1)
    return _mask_from(draw)


def dilate(mask):
    out = set(mask)
    for (x, y) in mask:
        out.update(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    return {(x, y) for (x, y) in out if 0 <= x < W and 0 <= y < H}


class Canvas:
    def __init__(self):
        self.px = {}

    def put(self, x, y, color):
        if 0 <= x < W and 0 <= y < H:
            self.px[(x, y)] = color

    def paint(self, mask, base, light=None, shade=None, outline=C["outline"], band=2, side=None):
        """Flat part with a 1px rim light on up-right edges, a shadow band on
        down-left edges and a dark outline drawn over whatever is behind."""
        if outline:
            for (x, y) in dilate(mask) - mask:
                self.put(x, y, outline)
        for (x, y) in mask:
            color = base
            if side and x >= side[0]:
                color = side[1]
            if shade and any((x - k, y + k) not in mask for k in range(1, band + 1)):
                color = shade
            if light and (x + 1, y - 1) not in mask:
                color = light
            self.put(x, y, color)

    def image(self):
        img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        for (x, y), c in self.px.items():
            img.putpixel((x, y), c + (255,))
        return img


# ---------------------------------------------------------------- head
# Head-local coordinates (0..33 x, 0..31 y), facing right. Chibi proportions:
# the head is about a third of the figure's height, like the reference.
HAIR_ROWS = {
    0: [(11, 12), (19, 20), (25, 25)],
    1: [(9, 13), (17, 21), (24, 26)],
    2: [(7, 27)],
    3: [(5, 28)],
    4: [(4, 29)],
    5: [(3, 30)],
    6: [(2, 30)],
    7: [(2, 31)],
    8: [(1, 31)],
    9: [(1, 32)],
    10: [(0, 32)],
    11: [(0, 32)],
    12: [(0, 32)],
    13: [(0, 32)],
}
# Lowest hair row per column on the face side: jagged bangs over the forehead.
BANGS = {21: 17, 22: 15, 23: 16, 24: 15, 25: 14, 26: 16, 27: 15, 28: 14, 29: 15, 30: 16, 31: 14, 32: 14}
# Right edge of the face (forehead / nose / chin silhouette) per row.
FACE_R = {14: 30, 15: 30, 16: 30, 17: 31, 18: 31, 19: 32, 20: 32, 21: 31, 22: 31,
          23: 30, 24: 30, 25: 29, 26: 28, 27: 26}
# Left inset of the back hair below the crown (skull curves in toward the nape).
BACK_INSET = {14: 0, 15: 0, 16: 0, 17: 1, 18: 1, 19: 1, 20: 2, 21: 2, 22: 3, 23: 3, 24: 4}
EAR_ROWS = {18: (1, 3), 19: (0, 4), 20: (0, 4), 21: (0, 4), 22: (0, 4), 23: (1, 4), 24: (2, 4), 25: (3, 4)}
HAIR_STRANDS = [
    (9, 3), (10, 3), (8, 4), (9, 4), (7, 5), (8, 5), (6, 6),
    (18, 3), (18, 4), (19, 4), (17, 5), (18, 5), (16, 6), (17, 6),
    (25, 6), (24, 7), (25, 7), (23, 8), (24, 8),
    (5, 10), (4, 11), (4, 12),
    (12, 10), (11, 11), (12, 11),
    (28, 11), (27, 12),
]


def head_pixels(turn=0, glasses_up=0, blink=False):
    """Returns {(x, y): colour_key} in head-local coordinates.

    turn: -2..1, how far the head has turned toward the character's right
    (the camera side). -2 is the neutral rear view (ear, a sliver of cheek,
    the back corner of the glasses); higher values reveal the cheek, lens,
    eye and nose as he turns toward the mug.
    """
    front = max(turn, 0)
    k = {}
    ear_l = 16 - turn
    ear_r = ear_l + 4

    # Face skin first; hair and glasses override.
    # Seen from behind, the cheek recedes behind the silhouette.
    face_r = {y: r + min(turn, 0) for y, r in FACE_R.items()}
    for y, right in face_r.items():
        for x in range(ear_r + 1, right + 1):
            k[(x, y)] = "skin"
    # Neck behind the jaw, then the jawline down to the chin.
    for y in range(24, 32):
        for x in range(13, 24):
            k[(x, y)] = "skin_sh"
    for y in range(24, 28):
        jaw = ear_r - 1 + (y - 24) * 2
        for x in range(jaw, face_r[y] + 1):
            k[(x, y)] = "skin"
        k[(jaw - 1, y)] = "skin_deep"

    # Ear.
    for y, (a, b) in EAR_ROWS.items():
        for x in range(ear_l + a, ear_l + b + 1):
            k[(x, y)] = "skin"
        k[(ear_l + a, y)] = "skin_deep" if y > 19 else "skin_sh"
    # Inner ear and the rim's shadowed underside.
    for (x, y) in [(2, 20), (2, 21), (3, 21), (2, 22), (3, 23)]:
        k[(ear_l + x, y)] = "skin_deep"
    k[(ear_l + 1, 19)] = "skin_hi"
    k[(ear_l + 3, 25)] = "skin_deep"

    # Hair: crown, jagged bangs, back of the head, hair over the ear, sideburn, nape.
    for y, spans in HAIR_ROWS.items():
        for (a, b) in spans:
            for x in range(a, b + 1):
                k[(x, y)] = "hair"
    for x, bottom in BANGS.items():
        for y in range(14, bottom + 1):
            k[(x - front, y)] = "hair"
    for y, inset in BACK_INSET.items():
        for x in range(inset, ear_l + (2 if y < 18 else 0)):
            k[(x, y)] = "hair"
    for x in range(ear_l, ear_l + 4):
        k[(x, 17)] = "hair"
    # A couple of notches and flicks so the back of the head isn't a smooth dome.
    for p in [(0, 11), (0, 12), (1, 17)]:
        k.pop(p, None)
    for p in [(0, 15), (0, 16), (1, 22), (2, 23)]:
        k[p] = "hair"
    for y in range(14, 23):
        k[(ear_r + 1, y)] = "hair"
        if y < 20:
            k[(ear_r + 2, y)] = "hair"
        if turn < 0 and y < 18:  # thicker sideburn when seen from behind
            k[(ear_r + 3, y)] = "hair"
    for x in range(4, 15):
        k[(x, 25)] = "hair"
    for x in (5, 6, 8, 9, 11, 12, 14):
        k[(x, 26)] = "hair"
    for x in (6, 9, 12):
        k[(x, 27)] = "hair"

    # Skin directly under hair sits in its shadow; the front edge catches light.
    for (x, y), v in list(k.items()):
        if v == "skin" and k.get((x, y - 1), "").startswith("hair"):
            k[(x, y)] = "skin_sh"
    for y, right in face_r.items():
        if k.get((right, y)) == "skin":
            k[(right, y)] = "skin_hi"

    # Nose and mouth only once he turns toward the camera side.
    if turn >= 0:
        k[(32, 19)] = "skin_hi"
        k[(32, 20)] = "skin"
        k[(31, 21)] = "skin_sh"
        k[(29, 24)] = "skin_deep"
    if turn >= 1:
        k[(28, 24)] = "skin_deep"

    # Glasses: temple over the ear to the hinge; thin rim around a narrow lens.
    gy = 19 - glasses_up
    lens_l = 27 - turn
    lens_w = 3 + turn
    for x in range(ear_r - 1, lens_l):
        k[(x, gy)] = "glasses"
    top, bottom = gy - 1, gy + 2
    for x in range(lens_l, lens_l + lens_w + 1):
        k[(x, top)] = "glasses"
        k[(x, bottom)] = "glasses"
    for y in range(top, bottom + 1):
        k[(lens_l, y)] = "glasses"
        k[(lens_l + lens_w, y)] = "glasses"
    for x in range(lens_l + 1, lens_l + lens_w):
        for y in (gy, gy + 1):
            k[(x, y)] = "skin"
    # Eye: white toward the temple, dark iris toward the front. From behind
    # only the frame's back corner shows.
    if turn >= 0:
        iris = lens_l + 1 + turn
        if blink:
            for x in range(lens_l + 1, iris + 1):
                k[(x, gy + 1)] = "skin_deep"
        else:
            for x in range(lens_l + 1, iris):
                k[(x, gy + 1)] = "eye_white"
            k[(iris, gy)] = "eye"
            k[(iris, gy + 1)] = "eye"
    if lens_w >= 2:
        k[(lens_l + lens_w - 1, gy)] = "glint"

    # Hair shading: rim light on the crown, shadow on the back and underside.
    mask = set(k)
    for (x, y), v in list(k.items()):
        if v != "hair":
            continue
        if (x + 1, y - 1) not in mask and y < 14:
            k[(x, y)] = "hair_rim"
        elif (x - 1, y + 1) not in mask or (x - 2, y + 2) not in mask or y >= 23 or x <= 1:
            k[(x, y)] = "hair_dark"
    for (x, y) in HAIR_STRANDS:
        if k.get((x, y), "").startswith("hair"):
            k[(x, y)] = "hair_hi"
    for (x, y) in [(ear_l - 1, yy) for yy in range(18, 25)] + [(ear_l + i, 17) for i in range(4)]:
        if k.get((x, y), "").startswith("hair"):
            k[(x, y)] = "hair_dark"
    return k


def draw_head(cv, ox, oy, **kw):
    k = head_pixels(**kw)
    mask = {(x + ox, y + oy) for (x, y) in k}
    for (x, y) in dilate(mask) - mask:
        cv.put(x, y, C["outline"])
    for (x, y), key in k.items():
        cv.put(x + ox, y + oy, C[key])


# ---------------------------------------------------------------- body parts
def draw_hips(cv):
    # Seated hips. The legs go forward under the desk and are drawn in 3D.
    cv.paint(poly([(9, 58), (36, 57), (40, 63), (38, 69), (12, 70), (8, 64)]),
             C["trousers"], C["trousers_hi"], C["trousers_sh"], band=3)


def draw_torso(cv, breath=0, left_shoulder=0):
    b = breath
    ls = left_shoulder
    pts = [(7, 41 - b + ls), (10, 36 - b + ls), (17, 33 - b), (30, 33 - b), (36, 35 - b),
           (39, 39 - b), (40, 46), (39, 54), (37, 61), (30, 63), (15, 63), (9, 61), (7, 53), (6, 46)]
    body = poly(pts)
    cv.paint(body, C["hoodie"], C["hoodie_hi"], C["hoodie_sh"], band=3, side=(34, C["hoodie_side"]))
    # Ribbed hem.
    for (x, y) in body:
        if y >= 58:
            cv.put(x, y, C["rib"] if x % 2 else C["hoodie_sh"])
    for x in range(8, 39):
        if (x, 57) in body:
            cv.put(x, 57, C["outline"])
    # Shoulder-blade folds, a back crease and the side seam.
    for (x, y) in [(12, 47), (13, 48), (14, 49), (28, 48), (29, 47), (30, 46), (20, 52), (21, 53), (22, 54)]:
        cv.put(x, y, C["hoodie_sh"])
    for y in range(41, 57):
        if (34, y) in body:
            cv.put(34, y, C["hoodie_sh"])


def draw_hood(cv, breath=0):
    b = breath
    hood = poly([(10, 35 - b), (13, 31 - b), (19, 30 - b), (24, 31 - b), (28, 34 - b), (28, 39 - b),
                 (25, 44 - b), (19, 46 - b), (14, 44 - b), (10, 40 - b)])
    cv.paint(hood, C["hoodie"], C["hoodie_hi"], C["hoodie_sh"], band=2)
    # Opening of the hood where the neck goes in.
    for (x, y) in hood:
        if (x, y - 2) not in hood and 13 <= x <= 25:
            cv.put(x, y, C["hood_in"])
    # Centre seam and folds.
    for y in range(33 - b, 45 - b):
        cv.put(19 + (y > 40 - b), y, C["hoodie_sh"])
    for (x, y) in [(14, 39 - b), (15, 40 - b), (24, 38 - b), (25, 39 - b)]:
        cv.put(x, y, C["hoodie_sh"])


def unit(dx, dy):
    d = math.hypot(dx, dy) or 1
    return dx / d, dy / d


HANDS = {
    # Offsets relative to the hand point; drawn as skin with outline.
    "rest": [(-1, 0), (0, 0), (1, 0), (2, 0), (-1, 1), (0, 1), (1, 1), (2, 1), (0, -1), (1, -1)],
    "type_a": [(-1, 0), (0, 0), (1, 0), (2, 0), (0, -1), (1, -1), (-1, 1), (1, 1), (3, 1)],
    "type_b": [(-1, 0), (0, 0), (1, 0), (2, 0), (0, -1), (1, -1), (0, 1), (2, 1), (3, 0)],
    "open": [(-1, 0), (0, 0), (1, 0), (2, 0), (3, 0), (0, -1), (1, -1), (2, -1), (0, 1), (1, 1), (2, 1), (3, 1), (4, 1), (1, -2)],
    "grip": [(-1, -1), (0, -1), (1, -1), (2, -1), (-1, 0), (0, 0), (1, 0), (2, 0), (-1, 1), (0, 1), (1, 1), (2, 1), (0, 2), (1, 2)],
    "pinch": [(0, 0), (1, 0), (2, 0), (0, 1), (1, 1), (2, 1), (-1, -1), (0, -1), (-1, -2), (-2, -3), (1, -1), (0, -2)],
}
HAND_LINES = {
    "grip": [(0, 0), (1, 0)],  # knuckle crease
    "type_a": [(0, 1)],
    "type_b": [(1, 1)],
    "open": [(1, 0)],
}


def draw_upper_arm(cv, shoulder, elbow, far=False):
    if far:
        cv.paint(capsule(shoulder, elbow, 4), C["hoodie_sh"], shade=C["hoodie_sh"])
        return
    cv.paint(capsule(shoulder, elbow, 4), C["hoodie"], C["hoodie_hi"], C["hoodie_sh"])
    cv.put(int(elbow[0]) - 1, int(elbow[1]) + 1, C["hoodie_sh"])  # elbow crease
    cv.put(int(elbow[0]), int(elbow[1]) + 2, C["hoodie_sh"])


def draw_forearm(cv, elbow, hand, kind, far=False):
    ux, uy = unit(hand[0] - elbow[0], hand[1] - elbow[1])
    wrist = (hand[0] - ux * 2.5, hand[1] - uy * 2.5)
    fore = capsule(elbow, wrist, 3.2)
    if far:  # the far arm sits in the body's shadow
        cv.paint(fore, C["hoodie_sh"], shade=C["hoodie_sh"])
    else:
        cv.paint(fore, C["hoodie"], C["hoodie_hi"], C["hoodie_sh"])
    for (x, y) in fore:  # ribbed cuff
        if math.hypot(x - wrist[0], y - wrist[1]) < 2.2:
            cv.put(x, y, C["rib"])
    hx, hy = hand
    skin = {(hx + dx, hy + dy) for (dx, dy) in HANDS[kind]}
    cv.paint(skin, C["skin_sh"] if far else C["skin"], C["skin_hi"], C["skin_sh"], band=1)
    for (dx, dy) in HAND_LINES.get(kind, []):
        cv.put(hx + dx, hy + dy, C["skin_deep"])


# ---------------------------------------------------------------- poses
# Arm targets come from projecting the room into the sprite's pixel grid:
# keys under the right hand ~(31, 33), under the left ~(5, 31) (hidden behind
# the head here), and the desk
# mug's centre ~(57, 31).
HEAD_ORIGIN = (7, 5)
SHOULDER_R = (36, 37)
SHOULDER_L = (9, 38)

# Right arm: elbow, hand, hand shape, and whether the forearm is in front of
# the body (raised to the face / reaching sideways) or behind it (reaching
# forward to the desk, hidden by the torso and head).
REST_R = dict(elbow=(42, 49), hand=(37, 40), kind="rest", front=False)
REST_L = dict(elbow=(5, 49), hand=(10, 40))


def typing(hand_r, kind, elbow_r, elbow_l, **extra):
    # From behind, the hands are hidden by the head; the motion reads through
    # the elbows and shoulders shifting as the hands move across the keys.
    return dict(turn=-2, right=dict(elbow=elbow_r, hand=hand_r, kind=kind, front=False),
                left=dict(elbow=elbow_l, hand=(12, 38)), **extra)


def raised(elbow, hand, kind, **extra):
    return dict(right=dict(elbow=elbow, hand=hand, kind=kind, front=True), left=REST_L, **extra)


FRAMES = [
    # idle
    dict(turn=-2, right=REST_R, left=REST_L),
    dict(turn=-2, breath=1, right=REST_R, left=REST_L),
    dict(turn=-2, right=dict(elbow=(43, 50), hand=(38, 41), kind="rest", front=False), left=REST_L),
    dict(turn=-2, head_dx=-1, head_dy=1, right=REST_R, left=REST_L),
    # typing
    typing((31, 33), "type_a", (42, 47), (4, 47)),
    typing((32, 32), "type_b", (43, 46), (4, 48), left_shoulder=1),
    typing((30, 33), "type_b", (42, 48), (3, 46)),
    typing((32, 33), "type_a", (43, 47), (4, 47), left_shoulder=1),
    # adjustGlasses
    raised((44, 46), (43, 37), "rest", turn=-2),
    raised((45, 40), (40, 27), "pinch", turn=-2),
    raised((45, 39), (40, 26), "pinch", turn=-2, glasses_up=1),
    raised((44, 45), (43, 36), "rest", turn=-2),
    # lookAtMug
    dict(turn=-1, right=REST_R, left=REST_L),
    dict(turn=0, right=REST_R, left=REST_L),
    dict(turn=0, head_dx=1, right=REST_R, left=REST_L),
    raised((44, 45), (44, 37), "open", turn=0, head_dx=1),
    # reachMug
    raised((45, 43), (45, 37), "open", turn=0, head_dx=1),
    raised((47, 41), (47, 35), "open", turn=0, head_dx=1),
    raised((48, 40), (49, 33), "open", turn=0, head_dx=1),
    raised((48, 40), (49, 33), "grip", turn=0, head_dx=1),
    # drink (head turned into profile so the mug shows at the lips)
    raised((47, 41), (48, 30), "grip", turn=0),
    raised((45, 37), (37, 28), "grip", turn=1, head_dy=-1),
    raised((45, 36), (37, 27), "grip", turn=1, head_dy=-1, head_dx=-1),
    raised((47, 41), (47, 33), "grip", turn=0),
]

# Where the mug's body centre sits for frames that hold it (native px). The
# handle points back toward the character, so the hand grips the mug's left
# side and the body sits to the right of the hand.
MUG_OFFSET = (8, -1)
HOLDING = {19, 20, 21, 22, 23}
TILT = {21: 0.35, 22: 0.7}


def render_frame(f):
    cv = Canvas()
    breath = f.get("breath", 0)
    right, left = f["right"], f["left"]
    shoulder_r = (SHOULDER_R[0], SHOULDER_R[1] - breath)
    shoulder_l = (SHOULDER_L[0], SHOULDER_L[1] - breath + f.get("left_shoulder", 0))

    # Behind the body: the far (left) arm, and the right forearm when it
    # reaches forward to the desk.
    draw_upper_arm(cv, shoulder_l, left["elbow"], far=True)
    draw_forearm(cv, left["elbow"], left["hand"], "type_b", far=True)
    if not right["front"]:
        draw_forearm(cv, right["elbow"], right["hand"], right["kind"])

    draw_hips(cv)
    draw_torso(cv, breath, f.get("left_shoulder", 0))
    draw_head(
        cv,
        HEAD_ORIGIN[0] + f.get("head_dx", 0),
        HEAD_ORIGIN[1] - breath + f.get("head_dy", 0),
        turn=f.get("turn", -2),
        glasses_up=f.get("glasses_up", 0),
        blink=f.get("blink", False),
    )
    draw_hood(cv, breath)

    # In front: the right upper arm at his side, and the forearm when raised.
    draw_upper_arm(cv, shoulder_r, right["elbow"])
    if right["front"]:
        draw_forearm(cv, right["elbow"], right["hand"], right["kind"])
    return cv.image()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--preview", help="optional enlarged preview with a backdrop")
    args = parser.parse_args()

    native = Image.new("RGBA", (W * COLS, H * ROWS), (0, 0, 0, 0))
    for i, f in enumerate(FRAMES):
        row, col = divmod(i, COLS)
        native.alpha_composite(render_frame(f), (col * W, row * H))

    sheet = native.resize((native.width * SCALE, native.height * SCALE), Image.NEAREST)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUT, optimize=True)
    print(f"wrote {OUT} {sheet.width}x{sheet.height} {sheet.mode}")

    if args.preview:
        bg = Image.new("RGBA", native.size, (74, 64, 96, 255))
        bg.alpha_composite(native)
        bg.resize((bg.width * 3, bg.height * 3), Image.NEAREST).save(args.preview)

    print("mug anchors (native px, frame: x, y, tilt):")
    for i in sorted(HOLDING):
        hx, hy = FRAMES[i]["right"]["hand"]
        print(f"  {i}: {hx + MUG_OFFSET[0]}, {hy + MUG_OFFSET[1]}, {TILT.get(i, 0)}")


if __name__ == "__main__":
    main()
