# Marks

The art the generator draws on top of a matchup. Four files, one system.

| File | Shape | Used by |
|---|---|---|
| `vs-default.svg` | wide, outline only | every versus layout, once per gap between sides |
| `rank-1st.svg` | wide | nothing — see below |
| `rank-2nd.svg` | wide | nothing — see below |
| `rank-3rd.svg` | wide | nothing — see below |

## The rank marks are not placed any more

Both winners layouts used to draw a rank mark under each place. They no
longer do: the podium backgrounds carry their own 1st, 2nd and 3rd markers,
drawn into the art beside the plinth each card lands on, so a mark on top
would only double up.

The three files stay, and `marks.ts` still rasterises them on request. A
layout that wants them back has only to push a `MarkAnchor` again.

## How they work

`marks.ts` substitutes the colours and sets the root `width` and `height`
before rasterising, so a mark stays sharp at any size and a colour picker
could be added later without editing a single path.

Marks are sized by height, with width following the art. The versus mark also
carries a cap on its width, because it is a wide VS and the gap on a duos trio
runs out well before the height does.

## The versus mark is hollow

`vs-default.svg` has no fill. It is a pixel-art VS drawn as outline only, so
the matchup behind shows through the letters. That keeps it readable over any
background without having to choose a colour that suits every one of them.
`stroke` is the only colour it has.

It is generated, not hand-drawn. The letters are laid out on a pixel grid in
`scripts/frames/build-vs-mark.py`, their silhouette is traced into closed
polygons, and those are stroked. To change the lettering, edit the grids at the
top of that script and run:

    npm run build:vs

## The rank marks

Drawn on a shared grid so they read as one family. Numerals are 100 units tall
with 26-unit strokes; the ordinal suffix is 55 units tall with 12-unit strokes,
cap-aligned to the top of the numeral. Straight lines and chamfers only.

These have a white face and a black outline. `D` and `R` carry their counters
as a second subpath, which is why the group sets `fill-rule="evenodd"`.

## Why everything is a path

An SVG drawn into a canvas loads in an isolated context that cannot fetch
anything, fonts included. A `<text>` element would silently fall back to
whatever face the machine happens to have, which differs on every visitor's
computer. So every glyph here is a polygon, and no font has to be licensed,
shipped, or waited on.

## A note on the viewBox

The versus mark's viewBox has a negative origin, because its stroke straddles
the path and needs room outside it. Anything reading these files must handle
that rather than assuming a `0 0` origin.
