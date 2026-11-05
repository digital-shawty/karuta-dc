# Test cards

Real cards from the bot, as a person would upload them, used by
`npm run check:cardgen` to prove the frame matcher works on the genuine
article rather than on templates dressed up as cards.

`frames.json` says which frame each one uses. The checks assert that the
matcher picks that frame, that it picks nothing when the frame is removed from
the library, and that the plates it returns sit where a code and an edition
number would.

Add a card by dropping the PNG here and adding its frame to the JSON. Cards
dyed an unusual colour, or with art spilling over the border, are the useful
ones: easy cards prove nothing.
