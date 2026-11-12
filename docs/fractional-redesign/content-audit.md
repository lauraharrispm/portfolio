# Content audit, November 12, 2026

Compared the four original PNGs in `public/case-studies/` against the recreated screens. Also compared every exported text label in all six new SVGs against the previous pushed revision. No screen wording changed in this spacing update.

| Original | Concepts and details preserved |
| --- | --- |
| intake-1.png | Care-type question first; therapy, evaluation, and both options with their descriptions; therapy selected; Continue; Need help; progress indicator. |
| intake-2.png, left | Coverage question; card details deferred; Oregon availability; Aetna, Blue Cross Blue Shield, Cigna, UnitedHealthcare / Optum, Medicaid; insurer search; optional secondary insurance; help. |
| intake-2.png, center | Cigna selected as primary; secondary insurance selection with Medicaid and Tricare; remove control; search; Get your match; help. |
| intake-2.png, right | Medicaid used despite Kaiser being out of network; Kaiser primary/not billed; Medicaid secondary/billed; both plans kept on file; notification and choice if Kaiser becomes in-network; Get your match. |
| portal-1.png | Jordan and Sam sample identities; Jane Doe matched as clinician; Step 2 of 4; consultation preparation; insurance done; $35 per visit and member ID on file; diagnosis required before choosing a time; report upload action; free consultation locked until diagnosis is on file; optional paperwork section and Review. |
| portal-2.png | Jordan and Sam sample identities; Jane Doe, PsyD matched as evaluator; evaluation purpose and report explanation; Step 2 of 3; insurance done; $40 evaluation estimate and member ID on file; book evaluation action; four documents optional until the evaluation is scheduled; Review. |

Both Recent Work images are built from the same screen functions as the detailed exports, so the story and details remain consistent across those placements. Line breaks, type, colors, spacing, and icon shapes differ from the originals. The treatment paperwork row was cropped in the original; the redesign exposes its existing title and Review action without inventing additional copy.

A structured comparison of `src/content/projects.ts` against `origin/main` also confirms that all case-study prose, captions, alt text, metrics, funding stages, and ordering remain unchanged. Only image paths and the preview image dimensions differ. Funding stages now appear on the summary cards using the existing values.

## Pre-existing inconsistencies, not introduced by the redesign

- The second portal caption/alt describes a no-match state, but the original image and current recreation show evaluation booking. This audit does not claim that the no-match concept is illustrated. The narrative still covers it. Recommended caption correction remains unapplied.
- The intake preview alt describes care-type selection while the original and current preview show insurance. The care-type selection is still present as the first detailed design image.
- The evaluation screen's original welcome sentence says “start therapy.” The exact wording is preserved rather than silently editing the approved copy.

Validation: visual comparison with original PNGs, exact SVG label comparison against the previous push, structured case-study content comparison against main, TypeScript check, and local browser review.
