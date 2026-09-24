# Site v1 snapshot (pre-fractional repositioning)

This folder is the rollback reference for the site as it existed before the
fractional-first rebuild that started on the `site-v2-fractional` branch.

## What "v1" means here

The `v1-pre-fractional` tag points at the commit that was live on `main` at
the time this rebuild started (September 2026): "Update page title from
Product Manager to Product Lead" (`a314f5a`). That commit is the source of
truth for v1. It does **not** include the logo strip work — that was still
uncommitted on `logo-strip` at the time and was merged into this history
afterward, in "Add logo strip and new headshot."

## Restoring v1

**Roll back the whole site to v1:**

```bash
git checkout v1-pre-fractional
```

This puts your working tree in a detached-HEAD state at the v1 commit. To
make it a branch you can commit on top of:

```bash
git checkout -b restore-v1 v1-pre-fractional
```

**Pull back a single file from v1** without touching anything else:

```bash
git checkout v1-pre-fractional -- <path>
```

For example, to restore the pre-rebuild homepage:

```bash
git checkout v1-pre-fractional -- src/app/page.tsx
```

## Other places v1 still exists

- **The `v1-pre-fractional` tag** is pushed to `origin`, so it's recoverable
  even if local history is lost.
- **Vercel's deployment history** also keeps the v1 production build
  viewable/restorable from the Vercel dashboard, independent of git, since
  `main` was live at that commit before this rebuild began.

## Visual snapshot

Full-page screenshots at 1440px and 375px belong in this folder. They
weren't captured by the assistant that scaffolded this rebuild (no
in-session tool could save a rendered screenshot to disk without adding a
new dependency, which was out of scope) — Laura is adding them manually.
