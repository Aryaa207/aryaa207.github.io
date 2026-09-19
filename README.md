# Aryaa Vijay — engineering portfolio

Static Astro portfolio for GNC, CFD, and embedded systems roles. Includes URL-based project lenses, a tested Joukowski flow interactive, eight project pages, a local PDF viewer, five on-demand 3D models, two local demonstration videos, a keyboard-accessible systems walkthrough, and original image galleries. The studio theme uses graphite surfaces, translucent glass, cyan accents, and authentic project photography.

## Run

Use Node 24.16 or later (Node 24 LTS recommended).

```sh
npm ci
npm run dev
```

## Verify and preview

```sh
npm run check
npm run lint
npm test
npm run build:preview
npm run check:links
npm run preview -- --port 4321
npm run test:e2e
npm run lighthouse
```

`npm run build` creates the publishable site and checks assets, metadata, and JavaScript size. Optional evidence improvements stay in MISSING_CONTENT.md and do not block the reviewed site. Set REQUIRE_COMPLETE_CONTENT=1 to run the stricter content-completeness check.

The local browser tests use installed Google Chrome on macOS. CI uses Playwright Chromium. The preview command starts Astro's managed background server; use `npx astro preview stop` to stop it.

## Content

You do not need to sort your files. Copy unsorted files into `raw/inbox/`, or provide their existing folder path. `npm run inventory -- /path/to/files` produces a read-only inventory, preserving originals. See CONTENT_GUIDE.md.

- `raw/profile/`: approved profile data and future photos
- `raw/resume/`: private original résumé (ignored by Git)
- `raw/projects/<slug>/content.md`: project source of truth
- `src/content/projects/`: generated MDX, do not edit directly
- `src/assets/`: recovered project images, processed by Astro
- `public/models/`, `public/documents/`, `public/videos/`: selected published derivatives
- `archive/`: previous scaffold and recovery reference (ignored)
- `scripts/`: ingestion, quality gates, inventory, sharing images, Lighthouse
- `tests/`: route, browser, accessibility, and interaction tests

The production address is https://aryaa207.github.io/. GitHub Actions verifies and publishes changes pushed to main; editing the website does not change that address. See DEPLOY.md for the update workflow.
