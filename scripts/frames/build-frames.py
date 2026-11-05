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

IDEAL_W, IDEAL_H = 0.285, 0.042
# Pixels the plate mask is grown by, at template resolution.
GROW = 3
IDEAL_TOP_Y, IDEAL_BOTTOM_Y = 0.048, 0.932
DARK_THRESHOLDS = (10, 16, 24, 32, 42, 55, 70, 85)
LIGHT_THRESHOLDS = (225, 205, 190, 172, 155)

def runs(row, thresh, lo, hi, light):
    found, start = [], -1
    for x, v in enumerate(row):
        if (v >= thresh) if light else (v <= thresh):
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
    for y, row in rows:
        used = set()
        for sx, rw in runs(row, thresh, lo, hi, light):
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
    a dark plaque and the numbers on a pale one."""
    bands = {}
    for label, y0, y1 in (('top', 0, int(h * 0.20)), ('bottom', int(h * 0.80), h)):
        bands[label] = [(y, row_luma(d, off, w, stride, topdown, h, y)) for y in range(y0, y1)]

    options = {'top': [], 'bottom': []}
    for label, rows in bands.items():
        for light, thresholds in ((False, DARK_THRESHOLDS), (True, LIGHT_THRESHOLDS)):
            for th in thresholds:
                hit = best_in_band(rows, w, h, th, label, light)
                if hit:
                    options[label].append((*hit, th, light))

    best = None
    for ts, tb, tth, tlight in options['top']:
        for bs, bb, bth, blight in options['bottom']:
            # Plates almost always match each other in size; prefer pairs that do.
            agree = abs(tb[3] - bb[3]) / h * 4 + abs(tb[2] - bb[2]) / w
            total = ts + bs + agree
            if best is None or total < best[0]:
                best = (total, (tb, tth, tlight), (bb, bth, blight))
    return best

# ----------------------------------------------------------- border pictures
#
# A frame is recognised by a small lightness picture of its border. Lightness
# is (max + min) / 2 of the RGB, which is what survives the bot's dye: every
# frame it prints is recoloured to the card's theme, and the ring of border
# compared at match time is weighted by how much of each cell is artwork
# rather than the empty middle, which holds character art on a real card.

PRINT_W, PRINT_H = 64, 96
# Outer sixth of the picture on each side is the ring that is compared.
RING_X, RING_Y = 11, 16
# Lightness and weight are quantised before they are written. Correlation does
# not care, and the sprite deflates to a third of the size.
PRINT_LEVELS, WEIGHT_LEVELS = 16, 4
# Colour distance from the empty panel beyond which a pixel counts as border.
BORDER = 40
# Two frames whose border pictures differ by less than this, with the same
# plates, are the same file uploaded twice.
DUPLICATE = 3.0

def thumbnail(d, off, w, h, stride, topdown):
    """Lightness and border share of the frame at PRINT_W x PRINT_H.

    Rows are pulled apart into their channels with slices and combined with
    map(), which keeps the per-pixel work in C. A pure Python loop over every
    pixel of a few hundred templates would take minutes.
    """
    mid = off + ((h // 2) if topdown else (h - 1 - h // 2)) * stride + (w // 2) * 3
    eb, eg, er = d[mid], d[mid + 1], d[mid + 2]

    light_rows, border_rows = [], []
    for y in range(h):
        base = off + (y if topdown else h - 1 - y) * stride
        row = d[base:base + w * 3]
        b, g, r = row[0::3], row[1::3], row[2::3]
        hi, lo = map(max, r, g, b), map(min, r, g, b)
        light_rows.append([(a + c) >> 1 for a, c in zip(hi, lo)])
        border_rows.append([255 if abs(pr - er) + abs(pg - eg) + abs(pb - eb) >= BORDER else 0
                            for pr, pg, pb in zip(r, g, b)])

    def shrink(rows):
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

    return shrink(light_rows), shrink(border_rows)

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
    for (box, thresh, light) in plates:
        x, y, bw, bh = box
        pad = GROW + 2
        x0, y0 = max(0, x - pad), max(0, y - pad)
        x1, y1 = min(w, x + bw + pad), min(h, y + bh + pad)
        regions.append((x0, y0, x1, y1))
        for yy in range(y0, y1):
            row = yy * w
            for xx in range(x0, x1):
                r, g, b = pixel(xx, yy)
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

    kept, skipped, duplicates, thin = [], [], [], []
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

            plates = per_mille(top[0]) + per_mille(bottom[0])
            light, weight = thumbnail(d, off, w, h, stride, topdown)

            twin = next((k for k in kept if same_plates(k['plates'], plates)
                         and ring_difference(k['light'], light) < DUPLICATE), None)
            if twin:
                duplicates.append(f"{name} = {twin['name']}")
                continue

            if sum(weight[i] for i in RING) < len(RING) * 255 * 0.05:
                thin.append(name)

            pixel = pixel_reader(d, off, w, h, stride, topdown)
            write_mask_png(MASKS / f'{name}.png', w, h, plate_mask(pixel, w, h, (top, bottom)))
            kept.append({'name': name, 'plates': plates, 'score': score, 'light': light, 'weight': weight})
            if n % 100 == 0:
                print(f'  {n}/{len(files)}', flush=True)

    sprite_w, sprite_h = write_sprite(SPRITE, [k['light'] for k in kept], [k['weight'] for k in kept])

    rows = []
    for k in kept:
        p = k['plates']
        rows.append('|'.join((k['name'], ','.join(map(str, p[:4])), ','.join(map(str, p[4:])),
                              str(round(k['score'] * 100)))))
    body = '\n'.join(rows)

    header = (
        '// Generated by scripts/frames/build-frames.py. Do not edit by hand.\n'
        '//\n'
        '// One line per frame, in the same order as the tiles in the sprite:\n'
        '//   name | code plate | numbers plate | confidence\n'
        '//\n'
        '// Plates are x,y,w,h in thousandths of the frame\'s width and height, taken\n'
        '// from the solid bar the card bot prints its text onto. They are the fallback\n'
        '// shape; the exact outline lives in public/card-frame-masks/<name>.png,\n'
        '// because a plate is only about 88% rectangular and a box would spill black\n'
        '// onto the artwork around it.\n'
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
    if skipped:
        print(f'  no plates found, left out: {", ".join(skipped)}')
        print('  cards using those fall back to scanning for the bars.')


if __name__ == '__main__':
    main()
