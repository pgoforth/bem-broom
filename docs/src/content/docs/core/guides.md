---
title: "@bem-broom/core"
description: Build and parse BEM class names from plain JS objects, framework-free.
---

`@bem-broom/core` turns plain objects into BEM class-name strings (and back). It
has **zero runtime dependencies** and ships dual, polyfill-free builds — a modern
ES2021 build (default) and an ES2015 build under the `/legacy` subpath.

```sh
npm install @bem-broom/core
```

## `bem(model)`

`bem()` returns an **array** of class names for a block/element plus its
modifiers.

```js
import { bem } from '@bem-broom/core';

bem({ block: 'card', modifiers: { block: { active: true } } });
// → ['card', 'card--active']

bem({
	block: 'card',
	element: 'title',
	modifiers: { element: { size: 'lg' } },
});
// → ['card__title', 'title', 'title--size_lg']
```

Every element is emitted **both scoped and standalone** — `card__title` (scoped
to the block) plus `title` and `title--size_lg` (the element as its own block).
The standalone form lets the element be styled on its own and act as the block
for its descendants, which is the basis of the re-rooting model the React
helpers use.

Common options:

- **`prefix`** — string prepended to every class (e.g. `'app-'`).
- **`verbose`** — additionally emit the block-scoped modifier form
  (`card__title--size_lg` alongside `title--size_lg`).
- **`syntax`** — choose the separator scheme (see [Syntaxes](#syntaxes)).

## `unbem(classNames)`

`unbem()` parses class names back into a BEM model — the inverse of `bem()`.

## Syntaxes

Class names are assembled from a few separators — between block and element,
before a modifier, and between a modifier name and its value. Two named schemes
ship built-in, chosen via the `syntax` option. The **default is
`SYNTAX_HYPHENATED`** — the "two dashes" style popularized by
[getbem.com](https://getbem.com/naming/) and the most common in web projects.
`SYNTAX_CLASSIC` is the original Yandex scheme; the two differ only in the
modifier separator.

| Export                        | block→element | modifier | value | e.g. `card` / `title` / `size:lg` |
| ----------------------------- | ------------- | -------- | ----- | --------------------------------- |
| `SYNTAX_HYPHENATED` (default) | `__`          | `--`     | `_`   | `card__title`, `title--size_lg`   |
| `SYNTAX_CLASSIC`              | `__`          | `_`      | `_`   | `card__title`, `title_size_lg`    |

```js
import { bem, SYNTAX_CLASSIC } from '@bem-broom/core';

bem({ block: 'card', element: 'title', modifiers: { element: { size: 'lg' } } });
// default → ['card__title', 'title', 'title--size_lg']

bem({
	block: 'card',
	element: 'title',
	modifiers: { element: { size: 'lg' } },
	syntax: SYNTAX_CLASSIC,
});
// → ['card__title', 'title', 'title_size_lg']
```

## Builds

- **Modern** (default import) — ES2021, no polyfills.
- **Legacy** — `import '@bem-broom/core/legacy'` for an ES2015 target, also
  polyfill-free.

The full list of exports, parameters, and types is in the
[API reference](/bem-broom/core/api/).
