# Open-source building blocks and prior art

- **Dimension:** `oss_building_blocks`
- **Findings:** 58 (29 load-bearing)
- **Adversarial verification:** corrected: 12

> Epistemic markers: `verified` = official Brilliant source; `observed` = docs, demos, archives,
> reviews; `inferred` = reasoning. Tier: 1 official … 7 third-party.

## Findings

### OSS-01 ★: Mafs (React interactive-math components) is MIT-licensed but has stalled: its last release was Oct 2024 and its last push was Mar 2025.

- **Status:** `verified` · Tier 1 · <https://api.github.com/repos/stevenpetryk/mafs/releases/latest>
- **Verification:** **corrected**. Correction: Mafs is MIT-licensed and has had no repo pushes since 2025-03-30, about 18 months before this check. Its latest release is v0.21.0 ('v0.21.x - Images!'), published 2024-10-20. The repo is not archived; it has 3,443 stars and open_issues_count 28, a figure that includes PRs. The README describes it as 'a set of opinionated React components for creating math visualizations'. Calling it stalled, and saying it does nothing for chemistry or physics, are inferences. (`observed`). Note: Every numeric and date fact matched on re-fetch: the releases/latest API, the repo API and the README. This is a label correction only. 'verified' is reserved for official Brilliant sources, and a third-party project's own repo or API counts as observed. The repo's updated_at of 2026-10-10 reflects stars, not commits, so it does not contradict the stall. The fetched mafs.dev landing page did not list components, so the 2D plot/point/function coverage comes from general knowledge and was not re-confirmed here.
- **Detail:** GitHub API: license MIT, 3,443 stars, pushed_at 2025-03-30, not archived, 28 open issues. Latest release v0.21.0 ('Images!') published 2024-10-20. The README calls it 'opinionated React components for creating math visualizations'. It covers 2D Cartesian plots, movable points and functions, and nothing for chemistry or physics. The MIT license allows forking, but the project shows no development in the last ~18 months.

### OSS-02 ★: JSXGraph is an actively maintained, dependency-free interactive geometry and plotting library. It is dual-licensed LGPL-3.0 OR MIT, so the MIT option allows permissive embedding.

- **Status:** `verified` · Tier 1 · <https://github.com/jsxgraph/jsxgraph>
- **Verification:** **corrected**. Correction: JSXGraph is actively maintained: v1.14.0 shipped 2026-10-05 and the repo was pushed 2026-10-10. It has 1,469 stars and 9,433 commits. The README says it is 'dual licensed under the GNU LGPL or MIT License' (GitHub auto-detects LGPL-3.0) and that it 'does not rely on any other library'. It renders via SVG, canvas or VML and 'supports multi-touch events'. The repo describes it as covering interactive geometry, function plotting, charting and data visualization. That it fits draggable geometry and physics diagrams better than Mafs is an inference. (`observed`). Note: All facts confirmed against the repo API, the releases API and the README. The README does not give an LGPL version; '3.0' comes only from GitHub's detection. Label corrected from verified to observed because this is not a Brilliant source. The fit comparison with Mafs is reasoning, not something a source states.
- **Detail:** README: 'dual licensed under the GNU LGPL or MIT License' (GitHub auto-detects LGPL-3.0). v1.14.0 released 2026-10-05; pushed 2026-10-10; 1,469 stars; 9,433 commits. Renders to SVG or canvas, supports multi-touch, and has no dependencies. It covers geometry constructions, function plots, sliders and charts. This is a better fit than Mafs for draggable geometry and physics-diagram exercises.

### OSS-03: GeoGebra is not usable as an embedded engine in a distributable app without a commercial agreement. Its source is EUPL-1.2, but the product, installers, materials and language files are non-commercial only.

- **Status:** `verified` · Tier 1 · <https://www.geogebra.org/license>
- **Detail:** License page: commercial use 'requires a special license'. Installers, web services and materials are non-commercial with attribution ('Made with GeoGebra'). Language files are CC BY-NC-SA 4.0. The source code is EUPL v1.2. The FAQ says the complete program 'would probably not be considered free software'.

### OSS-04 ★: KaTeX (MIT) is actively released and ships an official mhchem extension for chemical equations. It therefore covers math and chemistry notation with a single fast synchronous renderer.

- **Status:** `verified` · Tier 2 · <https://katex.org/docs/libs>
- **Verification:** **corrected**. Correction: KaTeX is MIT-licensed and actively released: v0.19.0 shipped 2026-10-01, it has 20,439 stars, and the repo was pushed 2026-10-09. katex.org/docs/libs lists its official extensions: auto-render, copy-tex, the math/tex script type, and mhchem ('Write beautiful chemical equations easily'). The README says KaTeX 'renders its math synchronously and doesn't need to reflow the page'. mhchem is a separate contrib script that must be loaded alongside KaTeX. (`observed`). Note: Facts confirmed, so this is a label correction only (not a Brilliant source). The release and star counts come from the GitHub API, not from the cited docs page, which supports only the extension list. The main KaTeX README does not mention mhchem; chemistry support depends on loading the contrib extension.
- **Detail:** Latest release v0.19.0 on 2026-10-01; 20.4k stars; MIT. Official extensions: auto-render, copy-tex, math/tex script type, and mhchem ('Write beautiful chemical equations easily', contrib/mhchem).

### OSS-05: MathJax v4 (Apache-2.0) is maintained and its strength is accessibility (semantic enrichment and speech). It is the heavier choice compared with KaTeX.

- **Status:** `verified` · Tier 1 · <https://api.github.com/repos/mathjax/MathJax-src/releases/latest>
- **Detail:** MathJax-src latest release 4.1.3 on 2026-07-03, a bug-fix release that stops infinite loops in semantic enrichment and speech generation. The main repo is Apache-2.0 with 10.9k stars, and the install docs point to mathjax@4. A good choice if screen-reader speech output for math is a requirement.

### OSS-06 ★: MathLive (MIT) provides a <math-field> web component with a mobile virtual keyboard. It is the best available OSS math-input widget for typed algebra and calculus answers.

- **Status:** `verified` · Tier 1 · <https://github.com/arnog/mathlive>
- **Verification:** **corrected**. Correction: MathLive (MIT) provides the <math-field> editor with 'Mobile-ready virtual keyboards'. Its README describes 'text-area like APIs (value, selection, executeCommand())', input and change events, and static <math-span>/<math-div> renderers. On npm, mathlive is at 0.111.1 (MIT). The repo was pushed 2026-10-10 and has 2,176 stars. The last GitHub release object is v0.100.0 from 2024-06-12, so npm is the version signal. The FAQ says major releases come 'around June and January'. Calling it 'the best available OSS math-input widget' is a judgment, not a sourced fact. (`observed`). Note: Every factual element was confirmed: npm latest, the repo API, the releases/latest API and the README/FAQ. The superlative 'best available' is unsupported by any source and should be tagged inferred. The rest needs only the verified-to-observed relabel.
- **Detail:** npm mathlive 0.111.1, MIT; pushed 2026-10-10; 2.2k stars. The last GitHub 'release' object is v0.100.0 from 2024-06, so npm is the authoritative version signal. Features: text-area-like API (value, selection, executeCommand), input/change events, custom virtual keyboard layouts, and static <math-span>/<math-div>. Two major releases a year (around June and January).

### OSS-07 ★: Cortex Compute Engine (MIT) parses LaTeX to MathJSON and can simplify, expand, solve and evaluate in pure JS. That makes it a client-side candidate for checking free-form math answers without Python.

- **Status:** `verified` · Tier 1 · <https://github.com/cortex-js/compute-engine>
- **Verification:** **corrected**. Correction: Cortex Compute Engine is MIT-licensed; npm @cortex-js/compute-engine is at 0.151.0, with npm maintainer arnog, who also owns the MathLive repo. The repo was pushed 2026-10-09, has 482 stars and shows open_issues_count 5, which includes PRs. The README says it parses LaTeX to MathJSON and can format, simplify and evaluate; the README code shows expand and solve. It does have built-in equivalence checks, documented in the symbolic-computing guide rather than the README. isSame() is structural, on canonical forms. isEqual() compares values numerically within ce.tolerance only when the difference is constant, does no expansion, simplification or sampling, and may return undefined. isIdenticallyEqual() asks whether two expressions are 'the same function of their free variables' by symbolic transformation plus evaluation 'at a number of pseudo-random points'. Its result is 'not a formal proof' and may be undefined. Pre-1.0 versioning implies likely API churn. (`observed`). Note: This correction is substantive and load-bearing. The finding said equivalence would have to be hand-built from simplified forms or numeric sampling, but the docs (mathlive.io/compute-engine/guides/symbolic-computing/) provide isIdenticallyEqual() for this. An answer checker should call it and treat an undefined result as 'fall back to a CAS such as SymPy or ask for a rewrite'. The open-issue count of 5 vs the claimed 4 is minor drift.
- **Detail:** npm @cortex-js/compute-engine 0.151.0, MIT; pushed 2026-10-09; 482 stars; 4 open issues. It pairs with MathLive (same author, MathJSON interchange). The README does not explicitly advertise an equivalence check (inferred: compare simplified forms and/or numeric sampling). Pre-1.0 versioning means API churn is likely.

### OSS-08 ★: math.js (Apache-2.0) adds an expression parser with physical units, matrices, complex numbers, fractions and symbolic derivatives. Unit-aware answer checking for physics and chemistry is the gap the math-only libraries leave.

- **Status:** `verified` · Tier 1 · <https://github.com/josdejong/mathjs>
- **Verification:** **corrected**. Correction: math.js: npm mathjs is at 15.2.0 under Apache-2.0, with 15,085 stars; the repo was pushed 2026-09-13. The README says it 'Supports numbers, bignumbers, bigints, complex numbers, fractions, units, strings, arrays, and matrices' and 'Does symbolic computation'. Its examples include evaluate('12.7 cm to inch') giving 5 inch and derivative('x^2 + x','x') giving 2 * x + 1. It bundles a CSparse port under LGPL-2.1+. That unit-aware physics and chemistry answer checking is the gap other libraries leave is an inference. (`observed`). Note: Facts confirmed verbatim from the README, npm and the API. The 'gap' framing is reasoning, so tag it inferred. Label corrected because this is not a Brilliant source. The LGPL-2.1+ CSparse component matters only if sparse-matrix code is redistributed in modified form.
- **Detail:** npm mathjs 15.2.0, Apache-2.0; 15.1k stars. Example: evaluate('12.7 cm to inch'); derivative('x^2 + x','x') returns 2*x+1. The README notes a CSparse port under LGPL-2.1+.

### OSS-09 ★: SymPy is BSD-licensed and actively developed. Its latest release, 1.14.0, is from April 2025.

- **Status:** `verified` · Tier 1 · <https://pypi.org/pypi/sympy/json>
- **Verification:** **corrected**. Correction: SymPy is BSD-licensed: PyPI shows license 'BSD' with the classifier 'OSI Approved :: BSD License'. The repo LICENSE is the 3-clause ('New') BSD license, and the bundled latex2sympy files carry an MIT-style notice. Development is active (repo pushed 2026-10-10, 14,995 stars), but releases are not frequent. The latest release, 1.14.0, was uploaded 2025-04-27, and PyPI shows no 1.15 release or release candidate, so about 17.5 months have passed without a release. (`observed`). Note: Facts confirmed. The BSD-3-Clause SPDX, which the finding left unconfirmed, is now confirmed from raw LICENSE. 'Actively developed' holds for commits, but the gap since the last release should be stated, because consumers such as Pyodide pin 1.14.0. The sympy.physics units claim was not re-checked. Label corrected because this is not a Brilliant source.
- **Detail:** PyPI: version 1.14.0, uploaded 2025-04-27, classifier 'OSI Approved :: BSD License'. GitHub reports NOASSERTION because of the custom license file; I am assuming the SPDX is BSD-3-Clause, which this check did not confirm. Repo pushed 2026-10-10; ~15k stars. It is the reference CAS for authoritative equivalence checking, solving, units (sympy.physics) and generating answer keys.

### OSS-10 ★: Pyodide (MPL-2.0) runs CPython in the browser with SymPy 1.14.0, NumPy, SciPy, matplotlib and networkx as built-in packages. Fully offline use requires self-hosting the 200+ MB full distribution.

- **Status:** `verified` · Tier 2 · <https://pyodide.org/en/stable/usage/downloading-and-deploying.html>
- **Verification:** **corrected**. Correction: Pyodide 314.0.7 (GitHub release 2026-09-14) is MPL-2.0. Since 314.0 its version numbers track CPython 3.14, per the Pyodide blog '314 release'. Its package list includes sympy 1.14.0, mpmath 1.4.1, numpy 2.4.6, scipy 1.18.0, matplotlib 3.10.8 and networkx 3.6.1. The deploy docs say the full distribution is 'quite large (200+ megabytes)'. pyodide-core is the 'minimal set of files needed to start Pyodide' and is aimed at Node, which fetches missing packages from the CDN. loadPackage is for 'packages built with Pyodide'; micropip handles pure-Python wheels and Pyodide packages from PyPI, jsDelivr or other URLs. It is unconfirmed that full offline use needs the whole 200+ MB tarball: self-hosting only the core plus the needed packages and pyodide-lock.json appears feasible but is not documented on the fetched page. (`observed`). Note: Every version number matched the packages-in-pyodide page. The load-bearing correction is that 'fully offline requires the 200+ MB full distribution' overstates what the docs say. The page says only that the full distribution is 200+ MB and that self-hosted files must be served yourself. A subset self-host is an inference to test before sizing the offline bundle. The MPL-2.0 license was not re-checked in this pass.
- **Detail:** Latest Pyodide release 314.0.7 (2026-09-14; version numbers now track CPython 3.14). Built-in packages: sympy 1.14.0, mpmath 1.4.1, numpy 2.4.6, scipy 1.18.0, matplotlib 3.10.8, networkx 3.6.1. The deploy docs say the full tarball is 'quite large (200+ megabytes)', while pyodide-core relies on the CDN. loadPackage is for Pyodide-built packages and micropip for PyPI wheels. Pyodide serves two roles: running learner Python code and providing a SymPy CAS in a Web Worker.

### OSS-11 ★: CodeMirror 6 (MIT) supports mobile native selection and screen readers. Its GitHub monorepo was archived in April 2026 and development moved to a self-hosted forge.

- **Status:** `verified` · Tier 1 · <https://github.com/codemirror/dev>
- **Verification:** **corrected**. Correction: CodeMirror 6 is MIT-licensed; npm @codemirror/view is at 6.43.14 (MIT), and its repository field points to code.haverbeke.berlin. The GitHub repo codemirror/dev 'was archived by the owner on Apr 15, 2026' and its README says it 'has moved to https://code.haverbeke.berlin/codemirror/dev'. The homepage says CodeMirror can 'Use the platform's native selection and editing features on phones', 'Works well with screen readers and keyboard-only users', supports bidirectional text, and has full parsers for JavaScript, Python and other languages. (`observed`). Note: All facts confirmed through the GitHub page, the API (archived: true, pushed 2026-04-15), npm latest and codemirror.net. The GitHub API reports the license as NOASSERTION for the dev repo, while npm says MIT. Label corrected because this is not a Brilliant source.
- **Detail:** github.com/codemirror/dev was archived 2026-04-15 and now points to code.haverbeke.berlin/codemirror/dev. npm @codemirror/view 6.43.14, MIT. The homepage claims phone support using native selection and editing, screen-reader and keyboard-only support, bidi, and parsers for JS, Python and others. Watch npm, not GitHub, for activity.

### OSS-12 ★: Monaco (MIT) is the VS Code editor core but officially does not support mobile browsers. That is a poor fit for a touch-friendly lesson player.

- **Status:** `verified` · Tier 1 · <https://github.com/microsoft/monaco-editor>
- **Verification:** **corrected**. Correction: Monaco Editor is MIT-licensed; v0.57.0 shipped 2026-09-24 and it has 46,859 stars. The README says it is 'generated straight from VS Code's sources with some shims'. Its FAQ asks 'Is the editor supported in mobile browsers or mobile web app frameworks?' and answers 'No.' That this makes it a poor fit for a touch-friendly lesson player is an inference. (`observed`). Note: Facts confirmed verbatim. The 'poor fit' conclusion is reasoning, so tag it inferred. Label corrected because this is not a Brilliant source.
- **Detail:** FAQ: 'Is the editor supported in mobile browsers...?' Answer: 'No.' Latest v0.57.0 on 2026-09-24; 46.9k stars; generated from VS Code sources.

### OSS-13: Blockly (Apache-2.0) moved from Google to the Raspberry Pi Foundation on 2025-11-10. It is actively maintained there, with accessibility work promised.

- **Status:** `verified` · Tier 1 · <https://registry.npmjs.org/blockly/latest>
- **Detail:** npm blockly 13.3.0, Apache-2.0; repo RaspberryPiFoundation/blockly pushed 2026-10-10; 13.6k stars. The Google OSS blog (Oct 2025) says the core library stays Apache 2.0. It suits block-based intro programming and logic and order-of-operations puzzles.

### OSS-14: Rive's web runtime (MIT) is open source and actively maintained. Brilliant uses Rive for streak and path-node animation.

- **Status:** `verified` · Tier 1 · <https://api.github.com/repos/rive-app/rive-wasm>
- **Detail:** rive-app/rive-wasm: MIT, pushed 2026-10-10, 973 stars. npm @rive-app/canvas 2.44.2, MIT. The runtime has state machines with inputs, so an animation reacting to learner state (as with Koji or streak flames) is driven by setting inputs.

### OSS-15 ★: The Rive editor is a proprietary hosted or desktop tool, and exporting .riv files for runtime use moved to paid plans in October 2025. Current Rive pages disagree on whether the free plan can still export with a splash screen.

- **Status:** `verified` · Tier 2 · <https://rive.app/blog/rive-s-new-9-mo-plan>
- **Verification:** **corrected**. Correction: The Rive Editor is proprietary. It runs in the browser or as a desktop app; the docs offer downloads 'for macOS or Windows', with no Linux build. A 2025-10-20 Rive blog post said 'exports now move to paid plans'. That post introduced Cadet at $9/month billed annually ($17 month-to-month), said existing exports keep working 'forever', and said there is 'No runtime fee', with runtimes staying MIT. The docs still say 'Exporting for runtime is available on paid plans.' The current pricing page is more specific and more recent. It says the Free plan can 'Export .riv files with a splash screen' and that 'Free exports play a Rive splash screen. Upgrade to remove it.' Shipping animations without a splash screen therefore needs a paid seat, at least Cadet. (`observed`). Note: Facts confirmed across the blog, docs, pricing page and get-rive page. The disagreement between pages is real; the pricing page appears to reflect a later relaxation and the docs note looks stale. The design implication: a free-plan Rive mascot or streak animation would carry a Rive splash screen. The options are a Cadet subscription, the browser editor on Linux, or a non-Rive animation path. The pricing page also lists a 'Rive Editor and CLI' on Free. Label corrected because this is not a Brilliant source.
- **Detail:** Rive blog (2025-10-20): exports move to paid plans; Cadet is $9/mo annually. Already-exported files keep working forever and there is no runtime fee. The docs say 'Exporting for runtime is available on paid plans.' However, the pricing page fetched Oct 2026 says the Free plan can 'Build and ship with a Rive splash screen'. A native desktop app exists for Mac and Windows only, with no Linux build. Any custom Rive authoring therefore carries a SaaS dependency.

### OSS-16: Motion (formerly framer-motion) is MIT and very active, but some extras (Motion+ components, examples, AI Kit) are a paid one-time purchase.

- **Status:** `verified` · Tier 1 · <https://motion.dev/>
- **Detail:** npm motion 14.1.0, MIT; motiondivision/motion pushed 2026-10-09; 33.9k stars. The homepage says it is 'Completely free to use, MIT licensed' for React, JavaScript and Vue. Motion+ includes UI sections and components and 490+ premium examples. Only the MIT core is needed for transitions, layout animation and gesture-driven drag.

### OSS-17: lottie-web (MIT) development has slowed (last push Sep 2025), while LottieFiles' dotlottie-web (MIT) is the actively versioned Lottie player.

- **Status:** `verified` · Tier 1 · <https://registry.npmjs.org/@lottiefiles/dotlottie-web/latest>
- **Detail:** npm lottie-web 5.13.0, MIT; airbnb/lottie-web pushed 2025-09-01; 32.2k stars. npm @lottiefiles/dotlottie-web 0.81.0, MIT ('Lottie and DotLottie player for the web'). Lottie needs After Effects or other authoring tools but no paid runtime export.

### OSS-18: perfect-freehand (MIT) turns pointer and pen input, with real or simulated pressure, into stroke-outline polygons. It is a small dependency for a scratchpad or ink-annotation layer.

- **Status:** `verified` · Tier 1 · <https://github.com/steveruizok/perfect-freehand>
- **Detail:** npm perfect-freehand 1.2.3, MIT; pushed 2026-04-13; ~5.8k stars. The getStroke(points) output is rendered as an SVG path or on canvas. The README asks commercial users to consider sponsoring, which is not a requirement.

### OSS-19: Excalidraw (MIT) can be embedded as an npm React package for a hand-drawn whiteboard with export and shape libraries. Real-time collaboration is not in the package.

- **Status:** `verified` · Tier 1 · <https://github.com/excalidraw/excalidraw>
- **Detail:** npm @excalidraw/excalidraw 0.18.1, MIT; repo pushed 2026-10-10; 133.6k stars. Package features: hand-drawn style, PNG/SVG/clipboard export, shape libraries. Collaboration and autosave belong to the excalidraw.com app and are planned as future plugins.

### OSS-20 ★: tldraw is not open source. Its custom license bars production use without a trial or commercial license key and enforces a watermark, though a free 'Hobby' license exists for personal non-commercial projects.

- **Status:** `verified` · Tier 1 · <https://raw.githubusercontent.com/tldraw/tldraw/main/LICENSE.md>
- **Verification:** **corrected**. Correction: tldraw is source-available, not open source. LICENSE.md permits use in Development Environments but requires 'Not to use the Software in Production Environments'. It forbids interfering with 'License Key enforcement' and describes technical measures that 'ensure proper watermark display'. Production use needs a license key. A 100-day free trial, a value-based commercial license (contact sales) with startup discounts, and a free 'hobby' license are all available. The hobby license is discretionary and application-reviewed, for 'personal projects and early experiments' and 'ideas that aren't a business yet', and requires the 'made with tldraw' watermark. Commercial licenses remove the watermark. Keys are validated client-side and work offline. npm tldraw is at 5.5.2 ('SEE LICENSE IN LICENSE.md'); GitHub reports NOASSERTION; 50,835 stars. (`observed`). Note: Core facts confirmed from LICENSE.md, tldraw.dev/pricing, /get-a-license/hobby, /community/license and npm. Two refinements. The watermark is a hobby-license requirement, not a blanket one, since commercial keys remove it. The hobby key also unlocks production use, which the claim's first sentence omits. For a single-user, local-first, non-commercial rebuild, the hobby license may be enough, but it is granted at tldraw's discretion and is not guaranteed. Label corrected because this is not a Brilliant source.
- **Detail:** LICENSE.md: you agree 'Not to use the Software in Production Environments' without a license, and not to interfere with License Key enforcement or watermark display. Development and staging use is allowed. The pricing page lists a 100-day free trial, a value-based commercial license (contact sales), startup pricing, and a free Hobby license for non-commercial projects. npm tldraw 5.5.2 says 'SEE LICENSE IN LICENSE.md'. GitHub reports NOASSERTION; 50.8k stars.

### OSS-21 ★: ts-fsrs (MIT) implements the FSRS-6 spaced-repetition scheduler in TypeScript and has a companion optimizer that fits per-user parameters from review logs.

- **Status:** `verified` · Tier 1 · <https://github.com/open-spaced-repetition/ts-fsrs>
- **Detail:** npm ts-fsrs 5.4.2, MIT; pushed 2026-10-10; 810 stars. API: fsrs() scheduler, createEmptyCard(), repeat(card, date) previews all Rating outcomes, next(card, date, Rating.Good) returns the updated card and a log. @open-spaced-repetition/binding trains parameters. It can drive review-set and retrieval scheduling per skill or item.

### OSS-22 ★: pyBKT (MIT) is a maintained Python library for Bayesian Knowledge Tracing and its variants. Its fast C++ path is not offered on Windows, so it fits offline parameter fitting better than a runtime dependency.

- **Status:** `verified` · Tier 1 · <https://github.com/CAHLR/pyBKT>
- **Detail:** PyPI pyBKT 1.4.3 uploaded 2026-08-05, MIT; repo pushed 2026-10-09; 283 stars. Variants: per-student priors, item guess/slip (KT-IDEM), item learn rates, forgets, multigs, multilearn, cross-validation, Roster for cohort mastery. C++ fits 5k synthetic students in ~45 s versus ~1 h 30 m in pure Python, and Windows gets pure Python only. Citation: Badrinath, Wang & Pardos, EDM 2021.

### OSS-23: XState v5 (MIT) is actively maintained and suits modeling the lesson-player flow as an explicit statechart, including hint escalation and level-check gating.

- **Status:** `verified` · Tier 1 · <https://registry.npmjs.org/xstate/latest>
- **Detail:** npm xstate 5.33.2, MIT; statelyai/xstate pushed 2026-10-09; 30.3k stars. The flow states would be: show prompt, attempt, feedback, hint escalation, explanation, advance.

### OSS-24 ★: Zod 4 (MIT) can emit JSON Schema (z.toJSONSchema), and Ollama's docs use exactly that to constrain local-LLM output. One Zod schema can therefore type, validate and constrain the generation of puzzle and lesson configs.

- **Status:** `verified` · Tier 2 · <https://docs.ollama.com/capabilities/structured-outputs>
- **Detail:** npm zod 4.6.5, MIT; 44k stars; pushed 2026-10-10. Ollama structured-outputs docs: define a Zod schema, pass z.toJSONSchema() as the format parameter, then .parse() the reply. Temperature 0 is recommended.

### OSS-25: better-sqlite3 (MIT) is the maintained synchronous SQLite binding for Node and Electron main processes.

- **Status:** `verified` · Tier 1 · <https://api.github.com/repos/WiseLibs/better-sqlite3/releases/latest>
- **Detail:** Latest v13.0.3 on 2026-08-05; repo pushed 2026-08-10; 7.5k stars; MIT. It is a native module, so it must be rebuilt for Electron's ABI. That last point is inferred and not stated in the fetched content.

### OSS-26: libSQL (MIT) is maintained but no longer where new features land. Turso says new feature work goes into its separate Rust rewrite, which is in beta.

- **Status:** `verified` · Tier 1 · <https://github.com/tursodatabase/libsql>
- **Detail:** README: 'libSQL is actively maintained, but new features are being developed in Turso.' Still embeddable, with embedded replicas. Offline bi-directional sync is attributed to the Turso Rust database, not libSQL. Repo pushed 2026-10-01; 17.3k stars. For a single-user local app, plain SQLite gives the same value with less churn (inferred).

### OSS-27 ★: For pure-browser persistence there are three viable SQLite builds: sql.js (MIT, in-memory, released Aug 2026), wa-sqlite (MIT, OPFS/IndexedDB VFS examples marked 'proof of concept'), and the official SQLite WASM package.

- **Status:** `verified` · Tier 1 · <https://github.com/rhashimoto/wa-sqlite>
- **Detail:** sql.js v1.14.2 on 2026-08-14. wa-sqlite: MIT since 2023-02-10, pushed 2026-10-10; VFSs include IDBBatchAtomicVFS, OPFSCoopSyncVFS and AccessHandlePoolVFS, and the README calls the IndexedDB/OPFS VFS classes 'proof of concept'. The official build is npm @sqlite.org/sqlite-wasm 3.53.4-build2 ('SQLite Wasm conveniently wrapped as an ES Module'), with an Apache-2.0 wrapper; SQLite itself is public domain.

### OSS-28: PGlite runs Postgres in WASM (~3 MB gzipped) in browser, Node, Bun and Deno with pgvector support. It is limited to a single connection and still at version 0.x.

- **Status:** `verified` · Tier 1 · <https://github.com/electric-sql/pglite>
- **Detail:** License: Apache-2.0 OR PostgreSQL (dual, either may be chosen). npm @electric-sql/pglite 0.5.8; repo pushed 2026-10-10; 16.1k stars. Persistence goes to IndexedDB (idb://) in the browser or the filesystem in Node. It is overkill unless vector search (pgvector), for example for semantic retrieval for the tutor, is wanted in-DB.

### OSS-29: Drizzle ORM (Apache-2.0) is actively developed, still pre-1.0 on npm, and works as a typed schema and migration layer over SQLite or PGlite.

- **Status:** `verified` · Tier 1 · <https://api.github.com/repos/drizzle-team/drizzle-orm>
- **Detail:** npm drizzle-orm latest 0.45.4. GitHub reports Apache-2.0, pushed 2026-10-09, 36k stars. A 0.x version means breaking changes are possible; pin the version.

### OSS-30 ★: Tauri v2 (MIT OR Apache-2.0) is very active and targets Windows, macOS, Linux, iOS and Android from one codebase using the system webview.

- **Status:** `verified` · Tier 1 · <https://github.com/tauri-apps/tauri>
- **Detail:** README licenses: 'MIT or MIT/Apache 2.0 where applicable.' tauri-cli v2.12.2 published 2026-10-10; 111.7k stars. Linux needs webkit2gtk 4.1. Because it uses the system webview, WASM, OPFS and WebGPU behavior varies by OS: WebView2 on Windows, WebKit on macOS and Linux (inferred).

### OSS-31 ★: Electron (MIT) is very active and bundles Chromium, so every OS gets a consistent engine for WASM-heavy pieces (Pyodide, RDKit, ngspice) at the cost of app size.

- **Status:** `verified` · Tier 1 · <https://api.github.com/repos/electron/electron/releases/latest>
- **Detail:** Latest v44.7.0 on 2026-10-07; 123.3k stars; MIT. It hosts native Node modules such as better-sqlite3 directly.

### OSS-32 ★: Ollama (MIT) is very active and supports JSON-schema-constrained structured outputs through its native format parameter and its OpenAI-compatible response_format.

- **Status:** `verified` · Tier 2 · <https://docs.ollama.com/capabilities/structured-outputs>
- **Detail:** Latest v0.40.2 on 2026-10-08; 182.7k stars; MIT. The docs say structured outputs are not supported on Ollama Cloud, only on local models. This makes it suitable for local LLM generation of puzzle configs that must match a schema.

### OSS-33: llama.cpp (MIT) supports GBNF grammars and converts a subset of JSON Schema into grammars. Its server accepts json_schema on completions and response_format on chat completions.

- **Status:** `verified` · Tier 2 · <https://raw.githubusercontent.com/ggml-org/llama.cpp/master/grammars/README.md>
- **Detail:** Grammars README: grammars are usable in the cli, completion and server tools; the -j/--json flag takes a JSON schema. The schema constrains output but is not added to the prompt, so describe the structure in the prompt too. Repo: 130.8k stars, pushed 2026-10-10, MIT.

### OSS-34: The Vercel AI SDK (Apache-2.0) offers a unified provider API (including Anthropic) with Zod-typed structured output, tool calling, an agent loop and UI hooks. Its default model-string routing goes through the Vercel AI Gateway.

- **Status:** `verified` · Tier 1 · <https://github.com/vercel/ai>
- **Detail:** npm ai 7.0.137, Apache-2.0; 27.2k stars. Model strings like 'anthropic/...' route via the Vercel AI Gateway by default; install @ai-sdk/anthropic to call providers directly. Other pieces: generateText with Output.object(zod), ToolLoopAgent, and useChat in @ai-sdk/react. A local-first build must configure direct providers so it does not send traffic to Vercel's gateway (inferred).

### OSS-35: The Anthropic TypeScript SDK (MIT) has browser use disabled by default to protect API keys, so tutor calls should be made from the desktop app's backend or main process.

- **Status:** `verified` · Tier 1 · <https://github.com/anthropics/anthropic-sdk-typescript>
- **Detail:** npm @anthropic-ai/sdk 0.133.0, MIT; 2.1k stars. dangerouslyAllowBrowser must be set explicitly to run in a browser. Helpers cover streaming, structured outputs and the tool runner. Requires Node 20+.

### OSS-36 ★: Piper's original MIT repo is archived, and active development continues in OHF-Voice/piper1-gpl under GPL-3.0. Bundling it now carries copyleft obligations.

- **Status:** `verified` · Tier 1 · <https://github.com/OHF-Voice/piper1-gpl>
- **Detail:** rhasspy/piper: MIT, archived, last push 2025-08-26. OHF-Voice/piper1-gpl: GPL-3.0, pushed 2026-10-10, 5.8k stars. It embeds espeak-ng for phonemization (likely why it is GPL; inferred). APIs: Python (pip install piper-tts), C/C++ (libpiper), HTTP server.

### OSS-37 ★: Kokoro-82M is an Apache-2.0 open-weight TTS model, and kokoro-js (Apache-2.0) runs it in the browser through Transformers.js. That makes it a permissive local voice for a Koji-style tutor.

- **Status:** `verified` · Tier 1 · <https://huggingface.co/hexgrad/Kokoro-82M>
- **Detail:** Hugging Face card: 82M parameters, Apache-licensed weights, v1.0 has 8 languages and 54 voices. npm kokoro-js 1.2.1 ('High-quality text-to-speech for the web') depends on @huggingface/transformers and phonemizer. The hexgrad/kokoro repo was last pushed 2025-08-06, which may indicate a slowdown.

### OSS-38: whisper.cpp (MIT) provides local speech-to-text with WASM browser examples, real-time microphone streaming, Silero VAD and Windows builds.

- **Status:** `verified` · Tier 1 · <https://github.com/ggml-org/whisper.cpp>
- **Detail:** Latest v1.9.5 on 2026-10-06; 54.3k stars. Examples include whisper.wasm, stream.wasm and command.wasm. VAD is enabled with --vad and a Silero model. Builds use MSVC or MinGW, with Vulkan, CUDA and other GPU backends.

### OSS-39: Matter.js (MIT) is still maintained and suits simple 2D rigid-body mechanics demos (ramps, collisions, pendulums), but it is pre-1.0 and not physically precise.

- **Status:** `verified` · Tier 1 · <https://registry.npmjs.org/matter-js/latest>
- **Detail:** npm matter-js 0.20.0, MIT; repo pushed 2026-09-30; 18.4k stars. For graded physics puzzles, answers should come from analytic formulas, with Matter.js used for visual playback (inferred).

### OSS-40: Planck.js (MIT), a JavaScript port of Box2D, is actively maintained and has the joint, constraint and stable-stacking model that balance, mobile and gear-style puzzles need.

- **Status:** `verified` · Tier 1 · <https://registry.npmjs.org/planck/latest>
- **Detail:** npm planck 1.5.0, MIT; repo piqnt/planck.js pushed 2026-10-09; 5.3k stars.

### OSS-41: Rapier's JS bindings repo was archived in July 2026 and merged into the main dimforge/rapier repo (typescript/ directory). The npm packages are Apache-2.0 and continue from there.

- **Status:** `verified` · Tier 1 · <https://github.com/dimforge/rapier.js>
- **Detail:** rapier.js archive notice dated 2026-07-12 points to github.com/dimforge/rapier (typescript dir). npm @dimforge/rapier2d 0.21.0, Apache-2.0, repo dimforge/rapier. Rapier offers deterministic WASM physics in 2D and 3D. Watch the main repo for releases.

### OSS-42 ★: Falstad CircuitJS1 is the most complete browser analog-circuit simulator, but it is GPL-2.0-or-later. Its JS control API requires the controlling page and the simulator iframe to share an origin.

- **Status:** `verified` · Tier 2 · <https://falstad.com/circuit/doc/js-interface.html>
- **Detail:** Licensed GPL v2 'or (at your option) any later version'; sharpie7 repo 3.0k stars, pfalstad fork 2.4k stars. Circuits load from URL parameters (cct, ctz). JS API: getNodeVoltage, setExtVoltage, getElements, exportCircuit, importCircuit, plus onupdate, ontimestep and onanalyze callbacks. The README documents an offline Electron packaging path. Using it unmodified as a separate bundled tool limits copyleft exposure, whereas linking it into the app may not (inferred).

### OSS-43 ★: EEcircuit-engine (MIT wrapper) ships ngspice compiled to WebAssembly as an npm package. It enables SPICE-accurate client-side checking of generated circuit puzzles.

- **Status:** `verified` · Tier 1 · <https://registry.npmjs.org/eecircuit-engine/latest>
- **Detail:** npm eecircuit-engine 1.8.0, MIT, repo eelab-dev/EEcircuit-engine. Usage: new Simulation(), start(), setNetList(ngspice netlist), runSim(). Lineage: EEsim by Dr Danial Chitnis, University of Edinburgh. ngspice's own license terms inside the bundle were not verified.

### OSS-44: CircuitVerse (MIT) is an active educational digital-logic simulator whose simulator code and interactive book offer reusable logic-gate mechanics. It is a Rails app, not a library.

- **Status:** `verified` · Tier 1 · <https://github.com/CircuitVerse/CircuitVerse>
- **Detail:** MIT; pushed 2026-10-05; 1.3k stars and 2.1k forks. The backend is Ruby/Rails; the Vue frontend (cv-frontend-vue) is a submodule; it includes a yosys2digitaljs gem. It is a source of logic-gate semantics and UI patterns for a Digital Circuits course, not something to drop in.

### OSS-45: Quirk (Apache-2.0) is a drag-and-drop browser quantum circuit simulator (up to 16 qubits) suited to a Quantum Computing course, but it has been dormant since July 2024.

- **Status:** `verified` · Tier 1 · <https://api.github.com/repos/Strilanc/Quirk>
- **Detail:** GitHub API: Apache-2.0, pushed 2024-07-16, 1.1k stars. Circuits are bookmarkable and linkable; embedding is not documented. Fork it or reuse its ideas; do not expect upstream fixes.

### OSS-46: 3Dmol.js (BSD-3-Clause) is a WebGL molecular viewer for small molecules and proteins that reads PDB, SDF, MOL2, XYZ and CIF.

- **Status:** `verified` · Tier 1 · <https://registry.npmjs.org/3dmol/latest>
- **Detail:** npm 3dmol 2.5.5, BSD-3-Clause; ~1.0k stars; 3,254 commits. Renders sphere, stick, cartoon and surface styles, with labels and click interactivity. Suitable for chemistry bonding and geometry lessons and biology protein views.

### OSS-47: Mol* (MIT) is the heavyweight macromolecular viewer used by PDBe and AlphaFold DB. It is appropriate for biology content such as protein structure, and overkill for small molecules.

- **Status:** `verified` · Tier 1 · <https://github.com/molstar/molstar>
- **Detail:** npm molstar 5.13.1, MIT; ~1.0k stars; 9,488 commits; built on WebGL2.

### OSS-48 ★: RDKit.js (BSD-3-Clause) is the official RDKit MinimalLib compiled to WASM. It provides SMILES parsing, descriptors and SVG depiction for validating and rendering chemistry answers offline.

- **Status:** `verified` · Tier 1 · <https://github.com/rdkit/rdkit-js>
- **Detail:** npm @rdkit/rdkit 2026.9.1, BSD-3-Clause. Usage: await initRDKitModule(); get_mol('CCO'); get_descriptors(). From 2026 on, versions follow RDKit's own numbering. The README warns about making .wasm fetchable after bundling.

### OSS-49: Ketcher (Apache-2.0, EPAM) is a full chemical-structure editor whose standalone package runs serverless using Indigo WASM. It is the strongest OSS option when learners draw molecules.

- **Status:** `verified` · Tier 1 · <https://github.com/epam/ketcher>
- **Detail:** npm ketcher-standalone 3.18.0, Apache-2.0. Repo: 907 stars, 7,545 commits, 772 open issues. Reads and writes MOL, SMILES and InChI; has a macromolecules mode since v3.0, which can be disabled.

### OSS-50: Kekule.js (MIT) is a lighter JS cheminformatics toolkit with a Composer editor and viewer widgets. It is maintained but small.

- **Status:** `verified` · Tier 1 · <https://github.com/partridgejiang/Kekule.js>
- **Detail:** npm kekule 1.0.4, MIT; repo pushed 2026-09-21; 280 stars. Reads CML, MOL and JCAMP-DX, writes SMILES, and does substructure search and ring detection. It is a lighter alternative to Ketcher for simple 2D drawing tasks.

### OSS-51 ★: PhET relicensed its simulation library from CC BY to CC BY-NC on 2026-03-30. Only 'historical' HTML sims dated before 2026-03-29 stay CC BY 4.0, and public sim source repos are flagged out of date.

- **Status:** `verified` · Tier 2 · <https://phetsims.substack.com/p/a-small-change-to-support-a-big-mission>
- **Detail:** PhET Substack (2026-03-30): commercial use 'requires a commercial license and partnership agreement'; classroom use is unchanged. The historical-collection agreement allows commercial or non-commercial use with exact attribution text, and 'The PhET logo must remain visible, unobstructed, and unaltered'. The phetsims/circuit-construction-kit-dc README says the repo is 'out of date and no longer actively maintained' and the monorepo is 'not publicly available'. phetsims/scenery (MIT scene-graph library) remains available.

### OSS-52: D3 (ISC) and Three.js (MIT) are stable, very active general-purpose foundations for data-analysis visualizations and 3D science scenes.

- **Status:** `verified` · Tier 1 · <https://registry.npmjs.org/three/latest>
- **Detail:** npm d3 7.9.0, ISC, 113.7k stars. npm three 0.186.1, MIT, 116.2k stars, 48k commits. Three.js is still on 0.x versioning with frequent releases, so pin the version.

### OSS-53 ★: Oppia (Apache-2.0) is an active, mature interactive-lesson platform built around 'explorations' (card, interaction, per-answer feedback, misconception branches). Its Python/Angular/Google App Engine stack makes it a poor fork base for a single-user local app.

- **Status:** `verified` · Tier 1 · <https://github.com/oppia/oppia>
- **Detail:** Release v3.5.3 on 2026-09-23; pushed 2026-10-10; 6.8k stars. The README says it is built on 'Python, Angular, and Google App Engine'. The creator docs describe branching from a card on a telling wrong answer, then routing back to the main path. That pattern, wrong-answer-triggered remediation branches, is worth adopting.

### OSS-54 ★: Mathigon Studio's code is MIT, but graphics, media and docs are CC BY-SA 4.0 and the 'Mathigon' marks are reserved by Amplify, which acquired Mathigon in 2021. The repo has had no pushes since February 2025.

- **Status:** `verified` · Tier 1 · <https://raw.githubusercontent.com/mathigon/studio/main/LICENSE.md>
- **Detail:** LICENSE.md: '© 2018–2022 Amplify Education, Inc.'; fonts are under SIL OFL; other source code is MIT. GitHub: 45 stars, pushed 2025-02-27, 21 open PRs. It is a NodeJS/Express server consumed as the @mathigon/studio npm package. Markdown course syntax includes inline variable sliders like ${a}{a|5|0,10,1} and action links, and steps are revealed progressively with progress tracked by step ID. The interactives doc's 'Goals and progress' section is a TODO. The companion lib @mathigon/euclid 1.2.4 (MIT) does geometry. Mine it for its authoring format; do not fork it.

### OSS-55 ★: Khan Academy's Perseus (MIT) is a production exercise renderer and grader with a rich widget set. It does not accept external contributions and is coupled to Khan's Wonder Blocks design system through 31 peer dependencies.

- **Status:** `verified` · Tier 1 · <https://github.com/Khan/perseus/tree/main/packages/perseus/src/widgets>
- **Detail:** npm @khanacademy/perseus 91.0.0, MIT; pushed 2026-10-09; 1.6k stars. The widgets directory includes interactive-graphs, number-line, expression, numeric-input, radio, matcher, sorter, orderer, categorizer, plotter, grapher, label-image, matrix, table, measurer, cs-program, python-program, phet-simulation, free-response, graded-group and dropdown. The README says 'not accepting external contributions'. Use it as a schema and taxonomy reference rather than a dependency.

### OSS-56: Kolibri (MIT) is an active offline-first learning platform. Its exercise mastery models (default m-of-n) and offline content 'channels', which can carry Perseus questions, are directly reusable design patterns.

- **Status:** `verified` · Tier 2 · <https://ricecooker.readthedocs.io/en/latest/exercises.html>
- **Detail:** Release v0.19.5 on 2026-07-13; pushed 2026-10-10; MIT. Ricecooker docs: mastery models come from le_utils, with m_of_n as the default (m = n = number of questions, capped at 5, when unset) and do_all for QTI quizzes. Question types: input, single and multiple selection, and Perseus. It is a Django/Python plus Vue app aimed at classrooms with coaches. It is not a Brilliant-style interactive player.

### OSS-57: Idyll (MIT), a markup language for explorable explanations, has been effectively dormant since February 2023.

- **Status:** `verified` · Tier 1 · <https://api.github.com/repos/idyll-lang/idyll>
- **Detail:** GitHub API: pushed 2023-02-04; 2.0k stars. Open issues include dependency rot such as an ESM error on fresh Windows installs (opened Oct 2023) and an outdated KaTeX version. Its idea of reactive variables bound to inline text is worth borrowing; the codebase is not.

### OSS-58 ★: No credible open-source Brilliant clone exists. GitHub 'brilliant clone' repos are unlicensed toys or specs, and the closest active adjacent project, Zoonk (MIT), is an AI goal-to-daily-plan learning web app, not an interactive problem engine.

- **Status:** `verified` · Tier 1 · <https://github.com/zoonk/zoonk>
- **Detail:** somuOO7/Brilliant-Clone: no license, last push 2021-07, 0 stars, only the first puzzle done. tlyoon/brilliant.org-style-learning-apps: no license, created 2026-08, 0 stars, specs plus a physics pilot. Zoonk: MIT, 157 stars, pushed 2026-10-10, Next.js + Postgres/Prisma + Vercel AI SDK; it plans 'every day until your date' with lessons, practice and reviews. Zoonk is a reference for user-requested custom learning paths, but it is server-centric.

## Implications for the rebuild

- Build custom, don't fork: none of Oppia, Perseus, Mathigon Studio, Kolibri, Idyll or the GitHub clones fits a local-first, single-user, interactive-generator lesson player. Oppia is tied to Google App Engine, Perseus does not accept contributions and needs Wonder Blocks, Mathigon has been stale since Feb 2025 under an Amplify copyright, and Idyll has been dormant since 2023. Borrow patterns instead: Oppia's misconception branches, Perseus's widget taxonomy, Kolibri's m-of-n mastery and offline channels, and Mathigon's markdown with inline variables and progressive steps.
- Make Zod the single source of truth for every puzzle and lesson config. Export it with z.toJSONSchema() to constrain LLM generation (Ollama format, llama.cpp json_schema, Claude structured outputs), then run deterministic validators (CAS, circuit solver, RDKit) before anything reaches the learner. This reproduces Brilliant's rule that every configuration must be a correct, solvable puzzle with local tools.
- Math stack: KaTeX with mhchem for rendering math and chemistry, MathJax only if speech accessibility becomes a requirement. MathLive for input. Cortex Compute Engine for fast in-UI equivalence checks. SymPy in Pyodide (Web Worker, lazy-loaded) as the authoritative CAS and grader of last resort. math.js for unit-aware physics and chemistry numerics. Prefer JSXGraph (active, MIT-option) over Mafs (no release since Oct 2024) for draggable geometry and graphs. Never use GeoGebra (non-commercial).
- Code lessons: CodeMirror 6, not Monaco, because Monaco has no mobile support. Pyodide to run learner Python offline, which requires shipping or self-hosting the needed wheels; the full distro is 200+ MB, so ship a curated subset. Blockly (Apache-2.0, now Raspberry Pi Foundation) for block-based intro and logic puzzles.
- Science breadth needs our own parameterized generators plus validators. Electronics: write a small MNA DC/transient solver for puzzle-grade circuits and cross-check it with ngspice-WASM (eecircuit-engine, MIT). Use CircuitJS (GPL-2.0+) only as a separately bundled free-play sandbox through its same-origin iframe API, if at all. Digital logic: our own simulator informed by CircuitVerse (MIT). Mechanics: Planck.js for constraint and balance puzzles, Matter.js for visual demos, and analytic formulas for grading. Chemistry: RDKit.js to validate and depict, Ketcher-standalone for drawing, 3Dmol.js for 3D. Biology: Mol* for proteins and D3 for networks and population models. Quantum: fork Quirk's ideas (Apache-2.0, dormant).
- Do not plan the science catalog around embedding PhET. New sims are CC BY-NC as of 2026-03-30 and source repos are stale. If any are used, use only pre-2026-03-29 historical HTML builds under CC BY 4.0, with exact attribution and the PhET logo left unaltered. Prefer native generators.
- Learner model: per-skill BKT in TypeScript (four parameters, straightforward to implement) with parameters fit offline by pyBKT (Python, pure-Python on Windows). FSRS-6 via ts-fsrs schedules review and retrieval items. Use a Kolibri-style m-of-n rule (for example 3 of 5) as a transparent fallback gate for level checks. This makes paths knowledge-aware, so lessons can be skipped or repeated based on mastery estimates.
- Lesson player as an XState v5 statechart (prompt, attempt, feedback, hint ladder, explanation, advance; level-check gating). This makes the AI tutor's view of 'what changed and prior attempts' an explicit event log the tutor can read.
- Desktop shell decision (flag before committing). Electron gives one Chromium engine for the heavy WASM pieces (Pyodide, RDKit, ngspice, Mol*) and native better-sqlite3. Tauri v2 gives a much smaller app and mobile targets, but WebView2 and WebKit differ in WASM, OPFS and WebGPU support. Persistence is SQLite in either case: better-sqlite3 in Electron, or the official SQLite WASM or wa-sqlite with OPFS in a pure web build, with Drizzle pinned. Avoid libSQL (new features moving to Turso) and PGlite unless pgvector is needed.
- AI tutor (Koji-like): call Claude through the Anthropic SDK from the main or backend process only, because browser use is disabled by default to protect keys. Optionally abstract providers with the Vercel AI SDK configured for direct providers, not the default AI Gateway. Run local models through Ollama or llama.cpp with schema-constrained output. Voice: whisper.cpp for STT, Kokoro (Apache-2.0, kokoro-js in-browser) for TTS. Avoid bundling Piper, which is now GPL-3.0 in its active repo.
- Animation and characters: Motion (MIT core) for UI and feedback micro-interactions, dotlottie-web for authored vector animations. Use the Rive runtime only with .riv files we can legally export; the Rive editor is a proprietary SaaS or desktop tool with paid-only exports since Oct 2025 (pricing page now ambiguous). Do not make the tutor character depend on Rive authoring.
- Scratchpad and annotation layer for the tutor: perfect-freehand (MIT) for ink and Excalidraw (MIT) for an optional whiteboard. Do not use tldraw: production needs a license key and a watermark is enforced, so a Hobby license only fits a strictly non-commercial personal build.

## Open questions

- Rive free-plan export status conflicts: the Oct 2025 blog and the export docs say exports are paid-only, while the Oct 2026 pricing page says Free can 'ship with a Rive splash screen'. Confirm before relying on Rive authoring.
- What exact license version (CC BY-NC 4.0?) do post-2026-03-29 PhET sims carry, and do the remaining public phetsims source repos keep GPL-3.0/MIT terms for code we might study or reuse?
- Tauri v2 vs Electron: is a consistent Chromium engine for Pyodide, RDKit and ngspice WASM worth the size cost? This needs a quick spike measuring Pyodide+SymPy cold-start time and memory in WebView2 vs Electron. Not measured here.
- How fast is SymPy in Pyodide for real-time answer checking (cold load of the sympy and mpmath wheels, per-check latency)? This decides whether Cortex Compute Engine must handle most checks.
- Does Cortex Compute Engine reliably decide algebraic equivalence (for example via its isEqual/isSame APIs)? Its README did not document an equivalence API, so this needs a test against a corpus of student-style answers.
- Is Mafs maintained elsewhere (an active fork), or should the plotting layer standardize fully on JSXGraph or a thin custom SVG layer?
- Under what terms is ngspice bundled inside eecircuit-engine (ngspice's own license was not verified), and is it small and fast enough to validate generated circuits at authoring time versus runtime?
- Does Kokoro via kokoro-js run acceptably on CPU-only hardware in Tauri or Electron, or is WebGPU needed? The upstream repo has had no push since Aug 2025.
- Do the tldraw Hobby license terms (eligibility, watermark, duration) permit a personal local-first learning app? This only matters if Excalidraw proves insufficient.
- Mathigon Studio's repo and docs were partly unavailable (503/404 on content docs). Its full markdown course syntax and goal/scoring model were not verified.

## Verifier summary

I re-fetched every source on 2026-10-10 (GitHub repo and release APIs, npm registry, PyPI JSON, the project docs and READMEs, Rive's blog, docs and pricing pages, and tldraw's LICENSE, pricing and license pages). None of the 12 findings was refuted. All factual details held up: stars, dates, versions and verbatim quotes either matched or showed only trivial drift. The one drift is OSS-07's open-issue count, 5 vs 4, because GitHub's count includes PRs.

All 12 are marked "corrected", but for most that is only a label fix. They used "verified", which is reserved for official Brilliant sources; a third-party project's own repo or docs counts as "observed". Value judgments inside the claims should be tagged "inferred": "best available" (OSS-06), "better fit than Mafs" (OSS-02), "poor fit" (OSS-12), "stalled" (OSS-01) and the "gap" framing (OSS-08).

Substantive, load-bearing corrections:
- **OSS-07 (Compute Engine):** it already has built-in equivalence checks — isSame, isEqual and isIdenticallyEqual. isIdenticallyEqual uses symbolic transformation plus sampling at pseudo-random points, is "not a formal proof", and can return undefined. The answer checker should use it and fall back to SymPy when the result is undefined, instead of building its own comparison.
- **OSS-10 (Pyodide):** the docs say only that the full distribution is 200+ MB. They do not say offline use requires all of it. Self-hosting just the core, the needed packages and the lockfile looks feasible but is unconfirmed, so test it before sizing the offline bundle.
- **OSS-15 (Rive):** the current pricing page says free exports work but play a Rive splash screen, while the docs still say export needs a paid plan. Removing the splash screen needs at least Cadet. Desktop builds are macOS/Windows only; the browser editor is the Linux route.
- **OSS-20 (tldraw):** the watermark applies to hobby keys; commercial keys remove it. The hobby license also permits production use, but tldraw grants it at its discretion. License keys are checked client-side and work offline.
- **OSS-09 (SymPy):** BSD-3-Clause is now confirmed from the LICENSE file. Commits are active, but there has been no release for about 17.5 months, and there is no 1.15 release or release candidate on PyPI.

On source tiers: the findings labelled each project's own repo or API as tier 1. That tier is defined as Brilliant's official site, so tier 2 (official docs) is the closer equivalent for third-party projects. This does not change any verdict.
