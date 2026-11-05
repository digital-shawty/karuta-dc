# Karuta Stuff

A repository for tools for [Karuta](https://karuta.fandom.com/wiki/Karuta_Wiki),
the Discord trading card bot.

One tool so far. More will be added here.

| Tool | Route | What it does |
|---|---|---|
| Card Comp Generator | `/cc-gen` | Turns card images into finished competition graphics |

## Card Comp Generator

Give it a background and a handful of card screenshots, and it returns the
competition graphics: matchups for a bracket, or a podium for the winners.
Every card has its code and print numbers blacked out first.

It is a three-step wizard, not a freeform canvas. Positions come from presets,
so nothing is dragged into place.

```
Step 1  Setup          background + two toggles ........ Next
Step 2  Winners        three or six slots, one image ... Download
        or Versus      add matchups, gallery of them ... Download (zip)
```

Two toggles on Step 1 decide the layout: **Versus or Winners**, and **Singles
or Duos**. In versus mode, Pair and Trio on Step 2 pick how many sides are in
each matchup; Duos puts two cards on each side, so a duos trio is six cards in
three teams of two.

### Covering the code

Each card carries a code at the top and an edition and print number at the
bottom, printed onto two solid bars. Those bars move a long way between
frames, so no fixed box can cover them. The generator finds them in three
steps, falling back as needed:

1. **Match the frame.** Every frame the bot can use is in the library as a
   lightness picture of its border. A card is compared against all of them by
   correlation, which survives the dye the bot applies for the card's theme.
   A match places the bars exactly.
2. **Scan for the bars.** If the frame is not recognised, the card is scanned
   for the dark pills themselves.
3. **Read the text.** Whenever the frame was not recognised, the card is also
   read, and the boxes tighten if the text says where the code really is.

The first two stages finish before a card appears, so a card is never on
screen, and never exportable, with its code showing. Whatever the tool lands
on can still be nudged by hand: click a card to drag either box or resize it.

### It never uploads anything

The whole thing runs in the browser. Cards, backgrounds and finished images
stay on the machine that made them: no server, no accounts, nothing stored.

## Running it

```sh
npm install
npm run dev
```

Nuxt 4 and Tailwind 4. It builds to static files (`npm run generate`), since
there is nothing for a server to do.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm run generate` | Static build |
| `npm run check:cardgen` | The generator's checks — run after touching its maths |
| `npm run build:frames` | Rebuilds the frame library from the templates |
| `npm run build:vs` | Rebuilds the VS mark |

## Layout

```
app/
  components/cardgen/   the generator's interface, one file per step
  composables/          useCardgen, which holds all of its state
  utils/cardgen/        the maths: layouts, frame matching, detection, drawing
  assets/cardgen/
    frames/             468 frame templates, read only by npm run build:frames
    marks/              the VS and 1st/2nd/3rd art, as SVG paths
    test-cards/         real cards the frame matcher is checked against
public/
  card-frame-masks/     where each frame puts its two bars
  card-frame-prints.png the sprite every card is matched against
scripts/                the checks, and the Python that builds the frame library
```

Adding frames is documented in `app/assets/cardgen/frames/README.md`; the marks
in `app/assets/cardgen/marks/README.md`.
