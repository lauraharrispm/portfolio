# Adding a case study

Case studies live as `Project` entries in `src/content/projects.ts`. To add
one, add a new object to the `projects` array with the next `order` number
and fill in the fields described by the `Project` interface at the top of
that file.

## The result badge

Every case study needs a `keyMetric`:

```ts
keyMetric: { number: string; label: string }
```

This renders as the badge on the summary card's image, and in the same
style at the top of the reading view (desktop overlay and mobile story
view). Keep it tight:

- `number`: short, e.g. `"80%"`, `"4x"`, `"0"`. One line, no wrapping.
- `label`: sentence case (not uppercase), and short enough to fit in **two
  lines** of the badge (roughly 40-50 characters at the desktop badge
  width). It's truncated past two lines, so don't rely on a third.

Good: `{ number: "80%", label: "lift in payments onboarding completion" }`
Too long: a label that runs past two lines at the badge's ~300px max width.
