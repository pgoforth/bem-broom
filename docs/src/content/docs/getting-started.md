---
title: Getting started
description: Install bem-broom and build your first BEM class names.
---

bem-broom builds and parses [BEM](https://getbem.com/) class names from plain
JavaScript objects. It's a small monorepo:

- **[@bem-broom/core](/bem-broom/core/guides/)** — the framework-agnostic
  builder/parser. Zero runtime dependencies.
- **[@bem-broom/react](/bem-broom/react/guides/)** — React helpers (`useBem`,
  `withBem`) built on top of core.
- **[@bem-broom/webcomponents](/bem-broom/webcomponents/guides/)** —
  framework-free custom-element helpers (`@bem` decorator, `BemElement` mixin).
- **[@bem-broom/lit](/bem-broom/lit/guides/)** — Lit helpers (`@bem` decorator,
  `BemController`).

## Install

```sh
# Core only
npm install @bem-broom/core

# React helpers (core is a dependency; react is a peer)
npm install @bem-broom/react @bem-broom/core react

# Custom-element helpers (no framework)
npm install @bem-broom/webcomponents @bem-broom/core

# Lit helpers (lit is a peer)
npm install @bem-broom/lit @bem-broom/core lit
```

## Quick example

```js
import { bem } from '@bem-broom/core';

bem({ block: 'card', modifiers: { block: { active: true } } });
// → ['card', 'card--active']
```

From here:

- Building and parsing class names → the
  [core guide](/bem-broom/core/guides/) and its
  [API reference](/bem-broom/core/api/).
- Using it in React components → the
  [react guide](/bem-broom/react/guides/) and its
  [API reference](/bem-broom/react/api/).
- Using it in plain custom elements → the
  [webcomponents guide](/bem-broom/webcomponents/guides/) and its
  [API reference](/bem-broom/webcomponents/api/).
- Using it in Lit → the
  [lit guide](/bem-broom/lit/guides/) and its
  [API reference](/bem-broom/lit/api/).
