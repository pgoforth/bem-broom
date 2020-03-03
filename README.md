<p align="center">
  <img src="docs/src/assets/bem-broom.png" alt="bem-broom" />

  <h1 align="center">bem-broom</h1>

  <p align="center">
    BEM class-name utilities for building component libraries
  </p>
</p>

<div align="center">

[![CI](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml/badge.svg)](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/pgoforth/bem-broom)](LICENSE)
[![docs](https://img.shields.io/badge/docs-online-blue)](https://pgoforth.github.io/bem-broom/)

</div>

---

Monorepo for the `@bem-broom/*` packages — a framework-agnostic BEM core plus
thin adapters for building component libraries.

## Packages

| Package | Description |
| --- | --- |
| [`@bem-broom/core`](packages/core) | Generate and parse BEM class names from JS objects. Zero dependencies, ships modern (ES2021) + legacy (ES2015) builds. |
| [`@bem-broom/react`](packages/react) | React helpers (`useBem`, `withBem`) for BEM class names, powered by `@bem-broom/core`. |
| [`@bem-broom/webcomponents`](packages/webcomponents) | Framework-free custom-element helpers (`@bem` decorator, `BemElement` mixin) — modifiers driven by attributes, block re-rooting via the Context Protocol. |
| [`@bem-broom/lit`](packages/lit) | Lit helpers (`@bem` decorator, `BemController`), built on `@bem-broom/webcomponents`. |

Runnable POCs live in [`examples/`](examples) (see [Examples](#examples) below);
the docs site source is in [`docs/`](docs).

## Development

This is an [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) monorepo.

```sh
npm install            # install all workspaces
npm run build          # build every package (core first — adapters depend on it)
npm run test:ci        # build + lint + coverage across all packages
npm run lint           # lint the whole workspace (shared eslint.config.js)
npm run prettier       # format-check the whole workspace
```

Per-package scripts run with `-w`, e.g. `npm run build -w @bem-broom/core`.

## Examples

[`examples/`](examples) is a small [Vite](https://vite.dev) app with one live
page per package. From the repo root:

```sh
npm run examples:install   # one-time: install the examples app's dependencies
npm run examples:dev       # build the packages, then start the Vite dev server
```

Open the printed local URL — the index links to a demo per package. For a
static build instead:

```sh
npm run examples:build     # build the packages, then `vite build`
```

Both `examples:*` scripts build the workspace packages first, because the demos
import each package's built `dist/` (they're wired as `file:` dependencies). See
[`examples/README.md`](examples/README.md) for details.

## Adding a framework package

Copy [`packages/react`](packages/react) as a template: it depends on
`@bem-broom/core`, extends the shared `tsconfig.base.json`, and reuses the
root's lint/format config. Publish/CI pick it up automatically via the
`packages/*` workspace glob.
