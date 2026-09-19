# Updating portfolio content

## Start with an unsorted folder

Either copy relevant files into `raw/inbox/`, or tell Codex the path to an existing folder. There is no need to duplicate a large folder just to begin. Run `npm run inventory -- '/absolute/path'` to record supported files, sizes, and paths in `raw/inbox/inventory.json`. The inventory does not move, delete, upload, or publish anything. Codex can then propose a project mapping and copy selected originals into the proper source folders.

## Project structure

```
raw/projects/<slug>/
  content.md
  images/
  clips/
  model/
```

Each `content.md` uses a JSON object inside YAML frontmatter delimiters (`---`), followed by Markdown. Copy the structure of an existing project, set title, role, period, lenses, tools, source, specs, and missing fields, and write the actual narrative. Ingestion expects this JSON frontmatter format. Collections validate the generated result with Zod. An entry with invalid required fields fails the build.

Write from actual evidence: problem, personal contribution, method, setup, results with units, limitations, and what you would change. Do not infer a measured outcome from a screenshot caption or a simulated demonstration. Record conflicting claims in SOURCE_REVIEW.md.

`npm run dev` or either build command ingests sources. To resolve a future evidence item, supply and verify the missing field, then remove that item from the project’s `missing` list. Global gaps are tracked in `raw/content-gaps.json`. MISSING_CONTENT.md is generated; do not edit it by hand.

## Images

Keep original images in the relevant raw folder. Put approved publication derivatives in `src/assets/` and import them with Astro's Picture component, AVIF/WebP formats, width variants, explicit dimensions, and descriptive alt text. The build checks output raster images for EXIF/XMP metadata. The recovered car image is a surface-geometry render, not a CFD contour. The unverified glider image is excluded pending confirmation of its project association.

## 3D

The current viewer uses `raw/projects/sard-drone/model/drone.glb` when present, otherwise the committed optimized derivative `public/models/sard-drone.glb`. Maximum published size: 5 MB. Do not commit native engineering CAD to `public/`.

The recovered GLB is one node. The current S.A.R.D. slicer uses a moving section plane, schematic component markers, and the eight repository photographs; it is not a separated CAD assembly. For a replacement, export one named node per physical component, verify units in meters, remove internal/proprietary geometry, and provide a static assembly view. Exact CAD export steps depend on the source tool/version and assembly structure; Onshape and NX are mentioned in the sources, but the drone airframe export tool is unconfirmed. Supply that detail before creating an export recipe.

## Résumé

Preserve the original in `raw/resume/`. The updated one-page application PDF is `public/documents/aryaa-vijay-resume.pdf`, also delivered in `output/pdf/`. It uses GPA 3.8, May 2027 availability, the documented 200-trial comparison, and the source-confirmed tetrahedral CFD mesh. To update it, edit `scripts/build-application-resume.py` and run it with Python containing ReportLab and pypdf. Render the result and inspect its single page before rebuilding the website. The metadata check excludes author, creator, and XMP fields.

## Files still needed

See MISSING_CONTENT.md. Additional solver evidence and measured flight records remain optional source improvements.

## September upload batch

All 28 explicitly supplied files are preserved or safely extracted in `raw/inbox/september-2026/`. `manifest.json` records original paths, sizes and SHA-256 hashes. These originals are ignored by Git. Duplicate DNGs, MOV/MP4 alternatives and repeated exports are retained for provenance, not shipped multiple times to visitors.

`src/assets/evidence/` contains metadata-clean web derivatives, original presentation figures, rendered report pages and model preview screenshots. `src/lib/evidence.ts` maps those assets to captions, cards and project galleries. The normal build requires only these prepared assets; it does not require the original Downloads folder or temporary conversion tools.

Media preparation used Sharp, PDFium, Pillow/HEIF/RAW readers, and FFmpeg. The full three unique video recordings were converted to silent H.264/yuv420p MP4 with faststart and stripped metadata. The HDR camera clip was tone mapped to SDR. Recordings load on demand and include adjacent visual descriptions. Original audio and camera metadata remain only in the private source archive.

The Kia and SR-71 models were simplified for browser visualization; the original GLB/STL/STEP files remain in the private archive. STL-derived visualization meshes are not dimensionally certified CAD downloads. Every published GLB is below 5 MB. The public viewer's scale is explicitly described as unverified.

`IMG_3892.PNG` remains private and is excluded at the owner’s request. AI-assisted `image (4).png` and `SARDDRONE.png` are excluded from the application-facing pages. The supplied HTML teardown was inspected as reference; its old CDN imports, missing model URL and unverified telemetry were not embedded. Its system-exploration idea is represented by the local 3D section tools and an accessible subsystem walkthrough.


### S.A.R.D. component and sensor assets
`raw/sard-github-source.json` records the GitHub source revision and downloaded hashes. Originals are privately archived in `raw/inbox/sard-github/`; run `node scripts/import-sard-components.mjs` to regenerate the eight metadata-clean WebP images. Component copy is in `src/lib/sard-components.ts`. The inertial demo is a local adaptation of `simulation.html`; it needs no Python server or external CDN. The blue biomaterial specimen is excluded by the owner’s explicit request, not awaiting a caption.

### Application review revision
`src/lib/project-briefs.ts` controls the concise ownership, method, and outcome summaries and the three selected homepage projects. Additional projects remain available in the expandable archive. The S.A.R.D. gallery is limited to the project poster, vision bench, showcase demonstration, and original held-airframe sunset photograph. The early camera clip and four outdoor detail photographs stay excluded as requested. Its two remaining recordings are the vision interface and sensor bench.
