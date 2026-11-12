# Fractional case-study screen refresh

A visual-only refresh of the anonymous patient intake and patient portal recreations, based on the screens published at lauraharrispm.com on November 12, 2026.

- Retains the existing screen wording, sample identities, clinical steps, and insurance examples.
- Uses ivory surfaces, deep green actions, lighter outlines, serif headings, consistent spacing, and restrained status treatments.
- Keeps the existing individual image dimensions. Recent Work previews use 1260 × 945 (4:3) so the website does not crop their sides.
- Original PNGs remain in `public/case-studies/`. The site references the new `*-refined.png` exports (second pass); `*-polished.png` retains the first pass.

## Editing

Edit `scripts/render-fractional-designs.mjs`, then run from the repository root:

```sh
node scripts/render-fractional-designs.mjs
```

This regenerates the six SVG sources here and six PNG exports in `public/case-studies/`. The renderer uses `sharp` and the development dependency `fontkit`. Bundled Cormorant Garamond and Instrument Sans fonts have their OFL notices in `fonts/`. Letterforms are outlined in SVG before PNG export, avoiding host font substitution. It does not call image-generation services.

## Existing content discrepancy

The second portal screen depicts an evaluation path. Its current caption and alt text describe a no-match state. Those strings were left unchanged to respect the visual-only scope. A future content edit should either describe the evaluation screen or replace it with an approved no-match design.

The intake summary image also depicts the insurance sequence while its existing alt text describes care-type selection. This refresh preserves that existing composition and alt text.

## Verification

Visually inspected all four design exports, both preview compositions, and the images in the local website. TypeScript check: `npx tsc --noEmit`.

## Design partner pass

Read Laura’s canonical persona at `/Users/lauraharris/context-directory-personal/.claude/agents/product-designer.md` and its creative-techniques, source-pack, brand typography/color, and craft references. Kept the approved green product direction distinct from the portfolio site branding.

- Removed bold text, decorative gradients, shadows, and icon background tiles.
- Uses three sans sizes (11, 13, 16) and two serif sizes (20, 28), with regular weight.
- Uses the actual Cormorant Garamond and Instrument Sans letterforms.
- Preserves all screen wording, identities, and clinical examples. Only line breaks and styling changed.
- Proposed caption, not applied: “Families seeking an evaluation see the right care path, coverage estimate, and next appointment to book.”

Measured contrasts: secondary text on white 6.15:1; on selected fill 5.53:1; on disabled fill 5.14:1; white on primary green 6.43:1; primary text on ivory 11.48:1.

Second-pass website screenshots: `refined-intake.jpg`, `refined-portal.jpg`. The original homepage screenshots retain the first pass for comparison. TypeScript and local browser review passed.
