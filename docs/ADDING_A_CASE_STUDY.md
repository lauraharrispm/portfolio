# Adding a case study

Case studies live as `Project` entries in `src/content/projects.ts`. To add
one, add a new object to the `projects` array with the next `order` number
and fill in the fields described by the `Project` interface at the top of
that file.

## The result block

Every case study needs a `keyMetric`:

```ts
keyMetric: { number: string; label: string }
```

This renders as a blush result block in the summary card's text column
(below the one-liner, above "See more"), and in the same style at the top
of the reading view (desktop overlay and mobile story view). Nothing
renders on top of the image anymore. Keep it tight:

- `number`: short, e.g. `"80%"`, `"4x"`, `"0"`. One line, no wrapping.
- `label`: sentence case (not uppercase), and short enough to fit in **two
  lines** of the block (roughly 40-50 characters at the summary card's
  block width). It's truncated past two lines, so don't rely on a third.

Good: `{ number: "80%", label: "lift in payments onboarding completion" }`
Too long: a label that runs past two lines at the block's ~300px max width.

## The `engagement` field

Optional. Set it to a short label like `"Fractional"` to mark a study as
fractional work rather than a full-time role. It renders as a small tag
next to the funnel tag(s) on the summary card, styled identically (same
`.tag` class). Studies from full-time roles don't set this field at all.

## The `crossLink` field

Optional. Links to one related study from the end of this one's
Reflection section:

```ts
crossLink: { toId: "other-study-id", label: "One-line link text →" }
```

Renders as a single underlined line, below the Reflection body, in both
the desktop reading view and the mobile story view. Clicking it switches
directly to the other study (same mechanism as the existing prev/next
nav), rather than closing and reopening.

## Image placeholders

When real images aren't ready yet, generate a placeholder PNG at the
exact path you'll eventually replace (so swapping in the real file later
is a drop-in, no code changes). A placeholder should be a `--warm-tint`
background box at the image's real aspect ratio, with "Image" centered in
bold and the alt text below it in small `--charcoal-muted` type. This is
what every image on the page should look like until real files land.
Keep the `alt`/`caption` data filled in with the real final copy either
way, since that doesn't change when the file is swapped.
