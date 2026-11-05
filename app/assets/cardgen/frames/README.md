# Frame templates

One image per frame the card bot can use. These are the empty templates: the
border artwork, with the middle left blank.

They exist so a card's code can be masked exactly. Each template shows the two
solid bars the bot prints onto, the code at the top and the edition and print
numbers at the bottom, and those bars move a long way between frames. Measured
across all of them, the code bar's centre runs from a seventh to seven eighths
of the way across. No default box could cover that, which is why the frame is
recognised rather than guessed.

## Adding frames

Drop the new templates in here, named `frame-<name>.jpg`, then run:

    npm run build:frames

That takes a minute or two and rewrites three things, all of which should be
committed:

- `app/utils/cardgen/frame-data.ts`, holding each frame's plate positions
- `public/card-frame-masks/<name>.png`, the plate outlines, clear everywhere
  else
- `public/card-frame-prints.png`, a sprite of small lightness pictures of
  every frame's border, which is what a card is compared against

A frame uploaded twice arrives as `frame-<name>(1).jpg`. The build keeps one
copy under the clean name and says which it dropped.

The script needs macOS, because it hands JPEG decoding to `sips` rather than
pulling an image library into a project that otherwise needs none.

## How a card finds its frame

The bot dyes every frame to the card's theme, so a card's colours say nothing
about which frame it has: celestial is blue and gold as a template and solid
green on a card. The pattern of light and dark in the border survives the dye,
so lightness is what is compared, by correlation, which also shrugs off a dye
that darkens or brightens the whole frame. Half the score is the border's
relief, each cell less the cells beside it: the thorns, petals and rivets.
Light against dark is easy to match by accident; a hundred small edges in the
right places are not.

Only a ring around the border is compared, and only the cells of it that are
wholly frame on the template, a cell in from the panel. The panel holds
character art on a real card, and art is what used to break this: a frame
whose border is a light bar on a dark margin read like any card whose art was
light right up to its frame. Many templates tint or speckle their panel, so
what is panel is decided by texture rather than colour: the smooth region
around the centre, petals and all, and the grey beyond the frame's outer
edge, which holds the glow on a card.

Every card the bot makes is the same shape: a 254 x 380 frame centred on a
274 x 405 image, with a glow in the ten pixel margin. The ring is read from
that position, then a pixel either way for the leading candidates, since
relief only lines up when the reading does. A picture with the margin cropped
off is tried as well, as a frame filling the whole of it.

A frame is only believed if the card is the right tone where that frame says
its plates are: dark under a dark plate, pale under a pale one. Then a match
is accepted on its score and on how far it leads the nearest frame whose
plates sit somewhere else. A card that owns its frame leads by a wide margin;
a card whose frame is missing is surrounded by equally poor candidates. Two
frames with the same plates are not rivals, since confusing them would not
move the mask.

The real cards in `../test-cards` are what this is calibrated and checked
against. Run `npm run check:cardgen` after changing any of it.

## What happens to a frame that is not here

Nothing breaks. A card that matches nothing falls back to finding the dark bars
by scanning, then to reading the text, and the boxes can always be nudged by
hand. Adding the template just makes it exact.

## Plates that are not plaques

Most frames print onto a solid bar, near black or near white, and the finder
prefers those: a bar found at a strict threshold beats one that only shows
up at a loose one. A few frames (banliang, candyland, frostedglass, panda,
poolside) have a cut-out instead, where the template shows the grey behind
it; those are found with the background allowed in, at a cost, so a cut-out
is never preferred to a solid bar beside it. The build lists them.
