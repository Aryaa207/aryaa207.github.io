# Publishing and updating the portfolio

Production URL: https://aryaa207.github.io/
Repository: https://github.com/Aryaa207/aryaa207.github.io

The website is an Astro static site. Changes pushed to `main` run the quality workflow and replace the deployed site at the same URL. The last successful deployment remains online if a later check fails.

## Update workflow

1. Edit the site in this workspace. Project narratives live in `raw/projects/<slug>/content.md`; concise summaries live in `src/lib/project-briefs.ts`.
2. Run `npm run check`, `npm run lint`, `npm test`, `npm run build`, and `npm run check:links`. Preview at `http://127.0.0.1:4321/`.
3. Inspect the diff and stage only intended changes. Commit and push to `main`.
4. Wait for the GitHub Actions workflow to pass, then verify the live pages and résumé download.

GitHub Pages uses the GitHub Actions publishing source. The workflow runs the browser checks and Lighthouse on the preview build before publishing. Local browser checks use Chrome on macOS; CI installs Playwright Chromium. Optional future evidence items remain in MISSING_CONTENT.md; `REQUIRE_COMPLETE_CONTENT=1 npm run build` enforces the stricter content inventory.

## Publication boundaries

The repository contains website source, reviewed narratives, and selected public media. Original uploads, native CAD, the original résumé, removed media, local review notes, and tool credentials stay excluded by `.gitignore`. The public résumé is the current application version.

Do not add native CAD, credentials, private source archives, or temporary conversion output to `public/`; that entire directory ships to visitors. Check newly added images for metadata and verify their captions before publishing.

## Recovery

Use a new commit to revert a problematic change and push it. Do not force-push or delete history. The website URL stays the same. This workspace keeps the full source for continuing development.

## Hosting behavior

The site uses GitHub Pages HTTPS and a content-security-policy meta tag. GitHub Pages does not apply custom `_headers`; no custom HSTS or server-side response-header configuration is claimed. There is no paid hosting subscription, custom-domain migration, or Squarespace billing change in this deployment.

Official reference: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
