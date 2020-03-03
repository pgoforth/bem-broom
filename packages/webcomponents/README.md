<p align="center">
  <img src="https://raw.githubusercontent.com/pgoforth/bem-broom/main/docs/src/assets/bem-broom.png" alt="bem-broom" />

  <h1 align="center">@bem-broom/webcomponents</h1>

  <p align="center">
    Framework-free custom-element helpers for building BEM class names
  </p>
</p>

<div align="center">

[![CI](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml/badge.svg)](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml) [![coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/pgoforth/7aef5fd167d2b627b7c06604ca82af90/raw/bem-broom-webcomponents-coverage.json)](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/%40bem-broom%2Fwebcomponents.svg)](https://www.npmjs.com/package/@bem-broom/webcomponents) [![minzipped size](https://img.shields.io/bundlephobia/minzip/%40bem-broom%2Fwebcomponents)](https://bundlephobia.com/package/@bem-broom/webcomponents) [![license](https://img.shields.io/npm/l/%40bem-broom%2Fwebcomponents.svg)](./LICENSE)

</div>

---

The framework-free analog of [`@bem-broom/react`](../react), powered by
[`@bem-broom/core`](../core): the current **block** flows down the DOM via the
[Context Protocol](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md),
a component supplies its **element**, and that element becomes the block for its
descendants.

Unlike [`@bem-broom/lit`](../lit), this package needs **no Lit host**. `@bem`
and `BemElement` drive the standard custom-element lifecycle
(`connectedCallback`, `observedAttributes`, …) directly, so they run on a bare
`HTMLElement`. Lit's own `ContextProvider` (used under the hood for re-rooting)
works on plain elements too; context *consumption* is done with a small
protocol-only helper so it doesn't require a `ReactiveControllerHost`.

Because plain custom elements expose state through **attributes**, modifiers are
driven by observed attributes rather than JS properties.

## Install

```sh
npm install @bem-broom/webcomponents @bem-broom/core
```

There is no framework peer dependency. `@lit/context` is a regular dependency —
it's a small, framework-agnostic implementation of the Context Protocol and does
**not** pull in Lit itself.

## `@bem(config)` — class decorator

The analog of `withBem`. Reads the block from context, applies the computed BEM
class(es) to the **host** element, and provides `config.element` as the block
for descendants (re-rooting). Attributes listed in `config.modifiers` are
observed and applied as modifiers. Uses **standard (TC39) decorators**, so it
needs a build step (TS ≥5.2, or the `@babel/plugin-proposal-decorators`
`2023-11` transform).

```js
import { bem } from '@bem-broom/webcomponents';

@bem({ element: 'card', modifiers: ['active'] })
class Card extends HTMLElement {}
customElements.define('bb-card', Card);
// <bb-card active> → host class="card card--active"; descendants see block "card"
```

A class decorator returns the wrapped subclass, so register the decorated
binding (`Card` above) — or apply `@bem` *below* a registration decorator if you
use one.

| Field | Description |
| --- | --- |
| `element` | **Required.** Element name; also the block for descendants. |
| `modifiers` | Observed attribute names. A present boolean attribute → `--name`; a valued attribute → `--name_value`; absent → skipped. |
| `block` | Block for the host's own class — a string, or `false` for a root (default: inherit from context). Descendants always re-root to `element`. |

## `BemElement(Base, config)` — base mixin

The decorator-free form, for projects that don't compile decorators (e.g.
no-build ESM). Same behavior as `@bem`.

```js
import { BemElement } from '@bem-broom/webcomponents';

class Card extends BemElement(HTMLElement, {
	element: 'card',
	modifiers: ['active'],
}) {}
customElements.define('bb-card', Card);
```

## Contexts

- **`bemBlockContext`** — carries the current block. `@bem` / `BemElement`
  provide it automatically; consume it directly for advanced cases.
- **`bemConfigContext`** — tree-wide `{ prefix, verbose, syntax }`. Provide it
  once near the root to configure a subtree.

Both ride the framework-agnostic Context Protocol (keys are shared via
`Symbol.for`), so they interoperate with any library or element that speaks it —
including `@bem-broom/lit`. A `@bem-broom/lit` ancestor and a
`@bem-broom/webcomponents` descendant re-root correctly in one tree.

`consumeContext(host, context, onChange)` is exported for consuming a context on
a bare element without a `ReactiveControllerHost`.
