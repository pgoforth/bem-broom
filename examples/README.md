# Examples

Runnable POCs for the `@bem-broom/*` packages — a small
[Vite](https://vite.dev) app with one live page per package:

- [`core.html`](core.html) — `bem()` wiring a UI by hand (no framework)
- [`react.html`](react.html) — the `useBem` hook and `withBem` HOC
- [`webcomponents.html`](webcomponents.html) — the `@bem` decorator & `BemElement`
  mixin on plain custom elements
- [`lit.html`](lit.html) — the `@bem` decorator and `BemController` on Lit

Every page renders the **same** little app — a theme-toggle badge, an active card
with a title, and a status badge — implemented once per library, and all four
share a single stylesheet (see below).

## Shared CSS

All four demos import the exact same stylesheets from [`src/shared/`](src/shared)
([`tokens.css`](src/shared/tokens.css), [`card.css`](src/shared/card.css),
[`title.css`](src/shared/title.css), [`badge.css`](src/shared/badge.css)) — no
per-framework copies. That's the headline: bem-broom emits identical BEM class
names (`light-card`, `card__title`, `badge--tone_info`, …) whether you use core,
react, webcomponents or lit, so one framework-agnostic stylesheet styles them
all. A production build bundles these into a single CSS asset linked from every
page.

## Running

From the **repo root**:

```sh
npm run examples:install   # one-time: install this app's dependencies
npm run examples:dev       # build the packages, then start the dev server
```

Open the printed URL; the index page links to each demo. For a static build:

```sh
npm run examples:build              # build the packages, then `vite build`
npm --prefix examples run preview   # serve the static build locally
```

## How it works

Each `@bem-broom/*` package is a `file:` dependency pointing at `../packages/*`,
so the demos import the packages' **built** output. The root `examples:*`
scripts run `npm run build` first for that reason. If you invoke this app's own
scripts directly (`npm run dev` / `npm run build` from inside `examples/`),
build the packages first with `npm run build` at the repo root.

After adding or renaming a package, re-run `npm run examples:install` so the new
`file:` dependency is linked.

The Lit and web-components demos use standard (TC39) decorators, which Vite's
default esbuild transform doesn't handle; [`vite.config.js`](vite.config.js)
transforms the files in those two demo directories (`src/lit/`,
`src/webcomponents/`) with Babel.
