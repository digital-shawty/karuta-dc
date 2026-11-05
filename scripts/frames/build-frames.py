#!/usr/bin/env python3
"""Turn the frame templates into the lookup the generator uses at runtime.

Reads every image in app/assets/cardgen/frames, works out where each one puts
its code plate and its edition/print plate, takes a small lightness picture of
its border, and writes three things: app/utils/cardgen/frame-data.ts, the
plate masks, and a sprite of those border pictures.

Run it after adding frames:

    npm run build:frames

The plates are the solid bars the card bot prints its text onto, so masking
them exactly is what makes the redaction tight. The border picture is what a
real card is compared against to find its frame. It records lightness only:
the bot dyes frames, so a card's colours say nothing about which frame it has,
but the pattern of light and dark in the border survives the dye.

macOS only: JPEG decoding is handed to `sips`, which saves pulling an image
library into a project that otherwise needs none.
"""

import collections
import pathlib
import struct
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
FRAMES = ROOT / 'app' / 'assets' / 'cardgen' / 'frames'
TARGET = ROOT / 'app' / 'utils' / 'cardgen' / 'frame-data.ts'
MASKS = ROOT / 'public' / 'card-frame-masks'
SPRITE = ROOT / 'public' / 'card-frame-prints.png'

# ---------------------------------------------------------------- decoding

def read_bmp(path, cache):
    bmp = cache / (path.stem + '.bmp')
    if not bmp.exists():
        subprocess.run(['sips', '-s', 'format', 'bmp', str(path), '--out', str(bmp)],
                       check=True, capture_output=True)
    d = bmp.read_bytes()
    off = struct.unpack('<I', d[10:14])[0]
    w, h = struct.unpack('<ii', d[18:26])
    topdown = h < 0
    h = abs(h)
    stride = ((w * 3 + 3) // 4) * 4
    return d, off, w, h, stride, topdown

def row_luma(d, off, w, stride, topdown, h, y):
    base = off + (y if topdown else h - 1 - y) * stride
    out = bytearray(w)
    for x in range(w):
        i = base + x * 3
        out[x] = (d[i] * 114 + d[i + 1] * 587 + d[i + 2] * 299) // 1000
    return out

def pixel_reader(d, off, w, h, stride, topdown):
    def pixel(x, y):
        x = 0 if x < 0 else (w - 1 if x >= w else x)
        y = 0 if y < 0 else (h - 1 if y >= h else y)
        i = off + (y if topdown else h - 1 - y) * stride + x * 3
        return d[i + 2], d[i + 1], d[i]
    return pixel

# ------------------------------------------------------------ plate finding
#
# A plate is a solid bar, so rows are scanned for flat runs of roughly the
# right length and consecutive matching rows are stacked. A run that merges
# into neighbouring artwork comes out too long and is dropped, which is why
# several thresholds are tried and the best-shaped result wins.

# The library's own median plate, measured once the finder was trusted. A
# plate 14 pixels tall on a 570 pixel template is thin but real; with the
# ideal set at 0.042 it lost to a plate-shaped patch of white suit.
IDEAL_W, IDEAL_H = 0.285, 0.032
# Pixels the plate mask is grown by, at template resolution.
GROW = 3
IDEAL_TOP_Y, IDEAL_BOTTOM_Y = 0.048, 0.932
# Strictest first. A plate is a solid bar, near black or near white, so a box
# found at a strict threshold is the better bet: each step looser costs
# STRICTNESS on the shape score, which is what stops a dark tentacle found
# only at the loosest setting beating a black treasure-chest lid found at all
# of them on a hair's difference in shape.
DARK_THRESHOLDS = (10, 16, 24, 32, 42, 55, 70, 85)
LIGHT_THRESHOLDS = (225, 205, 190, 172, 155)
STRICTNESS = 0.04
# A plate that is a cut-out, showing the grey behind, costs this much more
# again, so it is only believed where nothing solid is on offer. So does a
# pale plate: fifteen frames in the library have one, and a pale patch the
# shape of a plate is found on any white frame.
CUTOUT = 0.15
PALE = 0.15
# Pixels within this of the grey the templates are rendered on, summed over
# the channels, are background: the empty panel and the margin beyond the
# frame. They are never part of a plate. The looser dark thresholds sit
# above that grey's luma, and before background was excluded they ran a
# plate into the margin, or found one there that did not exist.
BACKGROUND = 30

def background_colour(pixel, w, h):
    """The grey the template is rendered on.

    It is not one fixed grey: the templates were captured in batches, and
    the batches differ by a few levels. Nor is a corner reliable, since some
    frames run their art right into it. The commonest colour along the
    picture's outer edge is the margin on every template checked.
    """
    seen = collections.Counter()
    for x in range(w):
        seen[pixel(x, 0)] += 1
        seen[pixel(x, h - 1)] += 1
    for y in range(h):
        seen[pixel(0, y)] += 1
        seen[pixel(w - 1, y)] += 1
    return seen.most_common(1)[0][0]

def row_background(d, off, w, stride, topdown, h, y, grey):
    base = off + (y if topdown else h - 1 - y) * stride
    row = d[base:base + w * 3]
    gr, gg, gb = grey
    return bytes(map(lambda b, g, r: 1 if abs(r - gr) + abs(g - gg) + abs(b - gb) <= BACKGROUND else 0,
                     row[0::3], row[1::3], row[2::3]))

def runs(row, background, thresh, lo, hi, light):
    found, start = [], -1
    for x, v in enumerate(row):
        if not background[x] and ((v >= thresh) if light else (v <= thresh)):
            if start < 0:
                start = x
        elif start >= 0:
            if lo <= x - start <= hi:
                found.append((start, x - start))
            start = -1
    if start >= 0 and lo <= len(row) - start <= hi:
        found.append((start, len(row) - start))
    return found

def boxes_in(rows, w, thresh, lo, hi, min_h, light):
    live, done = [], []
    for y, row, background in rows:
        used = set()
        for sx, rw in runs(row, background, thresh, lo, hi, light):
            hit = -1
            for i, b in enumerate(live):
                if i not in used and b['last'] == y - 1 and sx < b['x1'] and sx + rw > b['x0']:
                    hit = i
                    break
            if hit >= 0:
                b = live[hit]
                b['x0'], b['x1'], b['last'] = min(b['x0'], sx), max(b['x1'], sx + rw), y
                used.add(hit)
            else:
                live.append({'x0': sx, 'x1': sx + rw, 'y0': y, 'last': y})
        done.extend(b for b in live if b['last'] != y)
        live = [b for b in live if b['last'] == y]
    done.extend(live)
    return [(b['x0'], b['y0'], b['x1'] - b['x0'], b['last'] - b['y0'] + 1)
            for b in done if b['last'] - b['y0'] + 1 >= min_h]

def shape_score(box, w, h, which):
    x, y, bw, bh = box
    wf, hf, aspect = bw / w, bh / h, bw / max(1, bh)
    if not (0.16 <= wf <= 0.50) or not (0.017 <= hf <= 0.095) or not (2.2 <= aspect <= 15):
        return None
    # A plate sits on the frame art, never against the picture's edge. A box
    # that reaches the edge is a border element with the margin behind it.
    if x <= w * 0.01 or x + bw >= w * 0.99:
        return None
    want_y = IDEAL_TOP_Y if which == 'top' else IDEAL_BOTTOM_Y
    return (abs(wf - IDEAL_W) / IDEAL_W + abs(hf - IDEAL_H) / IDEAL_H
            + abs(y / h - want_y) * 6)

def best_in_band(rows, w, h, thresh, which, light):
    candidates = boxes_in(rows, w, thresh, int(w * 0.14), int(w * 0.52),
                          max(3, int(h * 0.020)), light)
    scored = [(shape_score(b, w, h, which), b) for b in candidates]
    scored = [s for s in scored if s[0] is not None]
    return min(scored, key=lambda s: s[0]) if scored else None

def find_plates(d, off, w, h, stride, topdown):
    """Top and bottom may use different thresholds: some frames put the code on
    a dark plaque and the numbers on a pale one.

    A few frames have no plaque at all: the plate is a cut-out, and the
    template shows the grey behind it. Each band is also searched with the
    background allowed into a plate, at a cost, so a cut-out is found where
    nothing solid is, and never preferred to a solid bar beside it.

    Each plate comes back as (box, threshold, light, cutout): what found it,
    which is what the mask is cut with.
    """
    grey = background_colour(pixel_reader(d, off, w, h, stride, topdown), w, h)
    options = {'top': [], 'bottom': []}
    for cutout in (False, True):
        for label, y0, y1 in (('top', 0, int(h * 0.20)), ('bottom', int(h * 0.80), h)):
            rows = [(y, row_luma(d, off, w, stride, topdown, h, y),
                     bytes(w) if cutout else row_background(d, off, w, stride, topdown, h, y, grey))
                    for y in range(y0, y1)]
            for light, thresholds in ((False, DARK_THRESHOLDS), (True, LIGHT_THRESHOLDS)):
                for looseness, th in enumerate(thresholds):
                    hit = best_in_band(rows, w, h, th, label, light)
                    if hit:
                        score, box = hit
                        score += STRICTNESS * looseness + (CUTOUT if cutout else 0) + (PALE if light else 0)
                        options[label].append((score, (box, th, light, cutout)))

    best = None
    for ts, top in options['top']:
        for bs, bottom in options['bottom']:
            # Plates almost always match each other in size; prefer pairs that do.
            agree = abs(top[0][3] - bottom[0][3]) / h * 4 + abs(top[0][2] - bottom[0][2]) / w
            total = ts + bs + agree
            if best is None or total < best[0]:
                best = (total, top, bottom)
    return best

# ----------------------------------------------------------- border pictures
#
# A frame is recognised by a small lightness picture of its border. Lightness
# is (max + min) / 2 of the RGB, which is what survives the bot's dye: every
# frame it prints is recoloured to the card's theme, and the ring of border
# compared at match time is weighted by how much of each cell is frame rather
# than panel, which holds character art on a real card.
#
# What counts as panel is decided by texture, not colour. Many templates tint
# the panel: grimrose fades it to red and scatters petals over it, ashes glows
# orange at the ends. On a card that tint lies over the art, so the art's
# lightness is what shows through, and a cell there is noise whatever the tint
# looks like next to the plain grey at the centre. Comparing colours against
# that grey is what used to count a tinted panel as frame, and a card with
# light art in a tinted frame then matched nothing. Tints and gradients are
# smooth, though, where frame art is all edges, so the panel is taken to be
# the smooth region reachable from the centre, plus any specks enclosed in
# it. The grey beyond the frame's outer edge is smooth too and is not frame
# either: on a card it holds the glow, which takes the dye like everything.

PRINT_W, PRINT_H = 64, 96
# Outer sixth of the picture on each side is the ring that is compared.
RING_X, RING_Y = 11, 16
# Lightness and weight are quantised before they are written. Correlation does
# not care, and the sprite deflates to a third of the size.
PRINT_LEVELS, WEIGHT_LEVELS = 16, 4
# A pixel differing from a neighbour by more than this, summed over the three
# channels, is an edge. Gradients and JPEG noise stay well under it; the edge
# of a petal or a plate is several times over.
SMOOTH = 18
# Edges are found at full size, then pooled down by this factor before the
# panel is traced, so a one pixel line still fences the panel off and the
# tracing walks a few thousand cells rather than a few hundred thousand pixels.
POOL = 3
# An edged patch enclosed by panel smaller than this share of the picture is
# a speck on the panel. A plate sitting in the panel is bigger and stays frame.
SPECK = 0.005
# Two frames whose border pictures differ by less than this, with the same
# plates, are the same file uploaded twice.
DUPLICATE = 3.0

def edges(d, off, w, h, stride, topdown):
    """Where the template has an edge, pooled to 1/POOL: 1 for an edged cell.

    Neighbour differences are taken with map() over channel slices, which
    keeps the per-pixel work in C. Each POOL x POOL block then keeps its
    maximum, so a thin line is never averaged away.
    """
    def diff(a, b):
        return map(lambda p, q: abs(p - q), a, b)

    def total(a, b, c):
        return map(lambda p, q, s: p + q + s, a, b, c)

    channels = []
    for y in range(h):
        base = off + (y if topdown else h - 1 - y) * stride
        row = d[base:base + w * 3]
        channels.append((row[0::3], row[1::3], row[2::3]))

    edged = []
    for y in range(h):
        b, g, r = channels[y]
        across = list(total(diff(b[1:], b[:-1]), diff(g[1:], g[:-1]), diff(r[1:], r[:-1]))) + [0]
        if y + 1 < h:
            b2, g2, r2 = channels[y + 1]
            down = total(diff(b, b2), diff(g, g2), diff(r, r2))
        else:
            down = [0] * w
        edged.append(bytes(map(lambda p, q: 1 if p > SMOOTH or q > SMOOTH else 0, across, down)))

    pw, ph = -(-w // POOL), -(-h // POOL)
    out = bytearray(pw * ph)
    for py in range(ph):
        block = edged[py * POOL:(py + 1) * POOL]
        merged = block[0] if len(block) == 1 else bytes(map(max, *block))
        for px in range(pw):
            out[py * pw + px] = max(merged[px * POOL:(px + 1) * POOL])
    return out, pw, ph

def flood(pw, ph, seeds, passable):
    """Cells reachable from the seeds, moving only through passable cells."""
    seen = bytearray(pw * ph)
    queue = collections.deque()
    for i in seeds:
        if passable(i) and not seen[i]:
            seen[i] = 1
            queue.append(i)
    while queue:
        i = queue.popleft()
        x, y = i % pw, i // pw
        for j in (i - 1 if x > 0 else -1, i + 1 if x < pw - 1 else -1,
                  i - pw if y > 0 else -1, i + pw if y < ph - 1 else -1):
            if j >= 0 and not seen[j] and passable(j):
                seen[j] = 1
                queue.append(j)
    return seen

def neighbours(i, pw, ph):
    x, y = i % pw, i // pw
    return [j for j in (i - 1 if x > 0 else -1, i + 1 if x < pw - 1 else -1,
                        i - pw if y > 0 else -1, i + pw if y < ph - 1 else -1) if j >= 0]

def frame_mask(d, off, w, h, stride, topdown):
    """Which cells are frame, at 1/POOL scale, and whether the panel leaked.

    Frame is everything that is neither the panel nor the margin. The margin
    is whatever smooth region touches the picture's edge, seeded from every
    edge cell because a thorn or a leaf reaching the edge cuts it into
    pieces. The panel is the smooth region around the centre, which is
    allowed to step across a single edged cell to carry on: petals and
    doodles scattered over a tinted panel are one cell wide once pooled,
    where a border is at least two, and the margin is never entered at all.
    A leak means the panel reached the margin anyway, through a gap in the
    border; the frame is then only the edged cells, which still compares,
    but the frame is listed so someone can look at it.
    """
    edged, pw, ph = edges(d, off, w, h, stride, topdown)
    smooth = lambda i: not edged[i]

    rim = [i for i in range(pw * ph) if i % pw in (0, pw - 1) or i // pw in (0, ph - 1)]
    outside = flood(pw, ph, rim, smooth)
    inside = lambda i: not edged[i] and not outside[i]

    cx, cy = pw // 2, ph // 2
    seeds = [y * pw + x for y in range(cy - 3, cy + 4) for x in range(cx - 3, cx + 4)]
    panel = flood(pw, ph, seeds, inside)
    while True:
        # Edged cells beside the panel with open panel beyond them.
        steps = [i for i in range(pw * ph) if edged[i] and not panel[i]
                 and any(panel[j] for j in neighbours(i, pw, ph))
                 and any(inside(j) and not panel[j] for j in neighbours(i, pw, ph))]
        if not steps:
            break
        for i in steps:
            panel[i] = 1
        beyond = [j for i in steps for j in neighbours(i, pw, ph) if inside(j) and not panel[j]]
        grown = flood(pw, ph, beyond, lambda i: inside(i) and not panel[i])
        for i in range(pw * ph):
            if grown[i]:
                panel[i] = 1
    leaked = any(outside[j] for i in range(pw * ph) if panel[i] for j in neighbours(i, pw, ph))

    # Specks: edged patches with nothing but panel around them. Each patch of
    # cells that is neither panel nor margin is traced; one that never touches
    # the margin and is small is a petal or a doodle on the panel, not frame.
    seen = bytearray(pw * ph)
    for i0 in range(pw * ph):
        if panel[i0] or outside[i0] or seen[i0]:
            continue
        patch, k, touches = [i0], 0, False
        seen[i0] = 1
        while k < len(patch):
            i = patch[k]
            k += 1
            x, y = i % pw, i // pw
            for j in (i - 1 if x > 0 else -1, i + 1 if x < pw - 1 else -1,
                      i - pw if y > 0 else -1, i + pw if y < ph - 1 else -1):
                if j < 0:
                    touches = True
                elif outside[j]:
                    touches = True
                elif not seen[j] and not panel[j]:
                    seen[j] = 1
                    patch.append(j)
        if not touches and len(patch) < SPECK * pw * ph:
            for i in patch:
                panel[i] = 1

    frame = bytearray(pw * ph)
    for i in range(pw * ph):
        frame[i] = 0 if panel[i] or outside[i] else 255
    return frame, pw, ph, leaked

def shrink(rows, w, h):
    """Box-average a w x h picture, given as rows, down to PRINT_W x PRINT_H."""
    out = bytearray(PRINT_W * PRINT_H)
    for cy in range(PRINT_H):
        ay, by = cy * h // PRINT_H, max(cy * h // PRINT_H + 1, (cy + 1) * h // PRINT_H)
        for cx in range(PRINT_W):
            ax, bx = cx * w // PRINT_W, max(cx * w // PRINT_W + 1, (cx + 1) * w // PRINT_W)
            total = 0
            for y in range(ay, by):
                total += sum(rows[y][ax:bx])
            out[cy * PRINT_W + cx] = round(total / ((by - ay) * (bx - ax)))
    return out

def thumbnail(d, off, w, h, stride, topdown):
    """Lightness and frame share of the template at PRINT_W x PRINT_H.

    Rows are pulled apart into their channels with slices and combined with
    map(), which keeps the per-pixel work in C. A pure Python loop over every
    pixel of a few hundred templates would take minutes.
    """
    light_rows = []
    for y in range(h):
        base = off + (y if topdown else h - 1 - y) * stride
        row = d[base:base + w * 3]
        b, g, r = row[0::3], row[1::3], row[2::3]
        hi, lo = map(max, r, g, b), map(min, r, g, b)
        light_rows.append([(a + c) >> 1 for a, c in zip(hi, lo)])

    frame, pw, ph, leaked = frame_mask(d, off, w, h, stride, topdown)
    frame_rows = [frame[y * pw:(y + 1) * pw] for y in range(ph)]
    return shrink(light_rows, w, h), shrink(frame_rows, pw, ph), leaked

RING = [y * PRINT_W + x for y in range(PRINT_H) for x in range(PRINT_W)
        if x < RING_X or x >= PRINT_W - RING_X or y < RING_Y or y >= PRINT_H - RING_Y]

def ring_difference(a, b):
    """Mean absolute lightness difference over the ring."""
    return sum(abs(a[i] - b[i]) for i in RING) / len(RING)

def same_plates(p, q, tolerance=20):
    return all(abs(x - y) <= tolerance for x, y in zip(p, q))


def plate_mask(pixel, w, h, plates):
    """A full-size alpha mask holding just the plates.

    Cut with the same threshold that found each plate, so the mask follows the
    plate's real outline rather than its bounding box. Plates are only about
    88% rectangular, so a box would spill black onto the artwork around them.

    Only the plate regions are touched; the rest of the frame is left clear,
    which keeps this quick over a few hundred templates.
    """
    alpha = bytearray(w * h)
    regions = []
    gr, gg, gb = background_colour(pixel, w, h)
    for (box, thresh, light, cutout) in plates:
        x, y, bw, bh = box
        pad = GROW + 2
        x0, y0 = max(0, x - pad), max(0, y - pad)
        x1, y1 = min(w, x + bw + pad), min(h, y + bh + pad)
        regions.append((x0, y0, x1, y1))
        for yy in range(y0, y1):
            row = yy * w
            for xx in range(x0, x1):
                r, g, b = pixel(xx, yy)
                # Panel showing between the plate and the box's padding is
                # not plate, however dark the threshold that found it.
                if not cutout and abs(r - gr) + abs(g - gg) + abs(b - gb) <= BACKGROUND:
                    continue
                luma = (r * 299 + g * 587 + b * 114) // 1000
                if (luma >= thresh) if light else (luma <= thresh):
                    alpha[row + xx] = 255

    # Grow the mask a little. Partly to cover the plate's antialiased edge, and
    # partly because the frame is located to about a percent, so the mask can
    # land a few pixels out. The text sits inside the plate rather than at its
    # edge, so this margin is what keeps it covered when that happens.
    for _ in range(GROW):
        grown = bytearray(alpha)
        for (x0, y0, x1, y1) in regions:
            for yy in range(y0, y1):
                row = yy * w
                for xx in range(x0, x1):
                    if alpha[row + xx]:
                        continue
                    if ((xx + 1 < w and alpha[row + xx + 1])
                            or (xx > 0 and alpha[row + xx - 1])
                            or (yy + 1 < h and alpha[row + w + xx])
                            or (yy > 0 and alpha[row - w + xx])):
                        grown[row + xx] = 255
        alpha = grown
    return alpha


def write_mask_png(path, w, h, alpha):
    """Black where the plates are, clear everywhere else."""
    import zlib
    raw = bytearray()
    for y in range(h):
        raw.append(0)
        row = bytearray(w * 2)
        for x in range(w):
            row[x * 2 + 1] = alpha[y * w + x]   # grey 0, alpha
        raw.extend(row)

    def chunk(tag, data):
        body = tag + data
        return struct.pack('>I', len(data)) + body + struct.pack('>I', zlib.crc32(body) & 0xffffffff)

    path.write_bytes(
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 4, 0, 0, 0))
        + chunk(b'IDAT', zlib.compress(bytes(raw), 9))
        + chunk(b'IEND', b''))

def write_grey_png(path, w, h, grey):
    import zlib
    raw = bytearray()
    for y in range(h):
        raw.append(0)
        raw.extend(grey[y * w:(y + 1) * w])

    def chunk(tag, data):
        body = tag + data
        return struct.pack('>I', len(data)) + body + struct.pack('>I', zlib.crc32(body) & 0xffffffff)

    path.write_bytes(
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 0, 0, 0, 0))
        + chunk(b'IDAT', zlib.compress(bytes(raw), 9))
        + chunk(b'IEND', b''))


def quantise(values, levels):
    step = 255 / (levels - 1)
    return bytes(round(round(v / step) * step) for v in values)


def write_sprite(path, prints, weights):
    """Every frame's ring, one per row, then every frame's weights the same way.

    Row i is frame i's lightness over the ring cells in RING order; row N + i
    is its weights. One greyscale PNG, so the browser can read it back off a
    canvas with no library. Only the ring is stored, since only the ring is
    ever compared.
    """
    w, h = len(RING), len(prints) * 2
    grey = bytearray()
    for tile in prints:
        grey.extend(quantise((tile[i] for i in RING), PRINT_LEVELS))
    for tile in weights:
        grey.extend(quantise((tile[i] for i in RING), WEIGHT_LEVELS))
    write_grey_png(path, w, h, grey)
    return w, h

# -------------------------------------------------------------------- main

def main():
    files = sorted((p for p in FRAMES.iterdir() if p.suffix.lower() in ('.jpg', '.jpeg', '.png')),
                   # A second upload of the same frame arrives as "name(1)".
                   # Clean names first, so that is the copy that gets dropped.
                   key=lambda p: ('(' in p.stem, p.stem))
    if not files:
        sys.exit(f'no frames found in {FRAMES}')

    MASKS.mkdir(parents=True, exist_ok=True)
    for stale in MASKS.glob('*.png'):
        stale.unlink()

    kept, skipped, duplicates, thin, leaked, cutouts = [], [], [], [], [], []
    with tempfile.TemporaryDirectory() as tmp:
        cache = pathlib.Path(tmp)
        for n, path in enumerate(files, 1):
            d, off, w, h, stride, topdown = read_bmp(path, cache)
            found = find_plates(d, off, w, h, stride, topdown)
            if not found:
                skipped.append(path.stem)
                continue

            score, top, bottom = found
            name = path.stem.removeprefix('frame-')

            def per_mille(box):
                return [round(v * 1000) for v in (box[0] / w, box[1] / h, box[2] / w, box[3] / h)]

            plates = per_mille(top[0]) + [int(top[2])] + per_mille(bottom[0]) + [int(bottom[2])]
            light, weight, leak = thumbnail(d, off, w, h, stride, topdown)
            if leak:
                leaked.append(name)

            twin = next((k for k in kept if same_plates(k['plates'], plates)
                         and ring_difference(k['light'], light) < DUPLICATE), None)
            if twin:
                duplicates.append(f"{name} = {twin['name']}")
                continue

            if sum(weight[i] for i in RING) < len(RING) * 255 * 0.05:
                thin.append(name)

            pixel = pixel_reader(d, off, w, h, stride, topdown)
            write_mask_png(MASKS / f'{name}.png', w, h, plate_mask(pixel, w, h, (top, bottom)))
            if top[3] or bottom[3]:
                cutouts.append(name)
            kept.append({'name': name, 'plates': plates, 'score': score, 'light': light, 'weight': weight})
            if n % 100 == 0:
                print(f'  {n}/{len(files)}', flush=True)

    sprite_w, sprite_h = write_sprite(SPRITE, [k['light'] for k in kept], [k['weight'] for k in kept])

    rows = []
    for k in kept:
        p = k['plates']
        rows.append('|'.join((k['name'], ','.join(map(str, p[:5])), ','.join(map(str, p[5:])),
                              str(round(k['score'] * 100)))))
    body = '\n'.join(rows)

    header = (
        '// Generated by scripts/frames/build-frames.py. Do not edit by hand.\n'
        '//\n'
        '// One line per frame, in the same order as the tiles in the sprite:\n'
        '//   name | code plate | numbers plate | confidence\n'
        '//\n'
        '// Plates are x,y,w,h in thousandths of the frame\'s width and height, taken\n'
        '// from the solid bar the card bot prints its text onto, then 1 for a pale\n'
        '// plate with dark text or 0 for the usual dark one. The box is the fallback\n'
        '// shape; the exact outline lives in public/card-frame-masks/<name>.png,\n'
        '// because a plate is only about 88% rectangular and a box would spill black\n'
        '// onto the artwork around it. The polarity is what a match is checked\n'
        '// against: a frame whose plates would land on the wrong tone is not the one.\n'
        '//\n'
        '// Confidence is the shape score the finder settled on, times 100. Higher means\n'
        '// the plate looked less like the usual one, so it is worth a glance.\n'
        '//\n'
        '// The border pictures a card is compared against live in the sprite named\n'
        '// below. Each is a w x h lightness picture of the frame, of which only the\n'
        '// outer ring, ringX and ringY cells deep, is kept: the middle of a template\n'
        '// is empty while the middle of a real card is art. Row i of the sprite is\n'
        '// frame i\'s ring, row N + i is how much of each ring cell is border.\n'
        '\n'
        f'export const FRAME_PRINT = {{ w: {PRINT_W}, h: {PRINT_H}, ringX: {RING_X}, ringY: {RING_Y}, '
        f'url: \'/{SPRITE.relative_to(ROOT / "public")}\' }} as const\n'
        '\n'
    )
    TARGET.write_text(header + 'export const FRAME_DATA = `' + body + '`\n')

    size = sum(f.stat().st_size for f in MASKS.glob('*.png'))
    print(f'\n{len(rows)} frames written to {TARGET.relative_to(ROOT)}')
    print(f'  masks in {MASKS.relative_to(ROOT)}, {size / 1024:.0f} KB total')
    print(f'  sprite {SPRITE.relative_to(ROOT)}, {sprite_w}x{sprite_h}, {SPRITE.stat().st_size / 1024:.0f} KB')
    if duplicates:
        print(f'  {len(duplicates)} duplicate(s) collapsed: {", ".join(duplicates)}')
    if thin:
        print(f'  little border in the ring, may be hard to recognise: {", ".join(thin)}')
    if leaked:
        print(f'  panel reached the edge, compared on edges only: {", ".join(leaked)}')
    if cutouts:
        print(f'  plates are cut-outs showing the grey behind: {", ".join(cutouts)}')
    if skipped:
        print(f'  no plates found, left out: {", ".join(skipped)}')
        print('  cards using those fall back to scanning for the bars.')


if __name__ == '__main__':
    main()
