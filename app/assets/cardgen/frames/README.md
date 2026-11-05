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
so only lightness is compared, by correlation, which also shrugs off a dye
that darkens or brightens the whole frame.

Only a ring around the border is compared, because the middle is character
art that differs on every card. Each cell of the ring is weighted by how much
of it is artwork on the template, so a frame with thin side borders is not
compared on the empty middle.

Every card the bot makes is the same shape: a 254 x 380 frame centred on a
274 x 405 image, with a glow in the ten pixel margin. The ring is read from
that fixed position, which is what makes the match a few milliseconds and the
mask land exactly. There is no search for the frame's position.

A match is accepted on how far the winner leads the nearest frame whose plates
sit somewhere else, not on its score alone. A card that owns its frame leads by
a wide margin; a card whose frame is missing is surrounded by equally poor
candidates. Two frames with the same plates are not rivals, since confusing
them would not move the mask.

The real cards in `../test-cards` are what this is calibrated and checked
against. Run `npm run check:cardgen` after changing any of it.

## What happens to a frame that is not here

Nothing breaks. A card that matches nothing falls back to finding the dark bars
by scanning, then to reading the text, and the boxes can always be nudged by
hand. Adding the template just makes it exact.

## Known gaps

`frame-tarotcard` has no entry: its plates sit on a navy card at too low a
contrast for the finder. Cards using it take the fallback path.
