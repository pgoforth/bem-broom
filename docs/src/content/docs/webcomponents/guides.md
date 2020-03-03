---
title: "@bem-broom/webcomponents"
description: Framework-free custom-element helpers for building BEM class names.
---

`@bem-broom/webcomponents` builds BEM class names for **plain custom elements** —
no framework required. The current **block** flows down the DOM via the
framework-agnostic [Context Protocol](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md);
a component supplies its **element**, and — through the `@bem` decorator or the
`BemElement` mixin — that element becomes the block for its descendants.

```sh
npm install @bem-broom/webcomponents @bem-broom/core
```

There is no framework peer dependency. Unlike [`@bem-broom/lit`](/bem-broom/lit/guides/),
these helpers drive the standard custom-element lifecycle directly, so they run
on a bare `HTMLElement`.

:::note[Modifiers are attributes]
Plain custom elements expose state through **attributes**, so `modifiers` lists
*attribute names* to observe (not JS properties as in React/Lit): a present
boolean attribute → `--name`, an attribute with a value → `--name_value`, an
absent attribute → skipped.
:::

## `@bem(config)`

Class decorator, the analog of react's `withBem`. It reads the block from
context, applies the computed BEM class(es) to the **host** element, observes the
attributes listed in `config.modifiers` as modifiers, and provides
`config.element` as the block for descendants. It uses **standard (TC39)
decorators**, so it needs a build step (TS ≥5.2, or the
`@babel/plugin-proposal-decorators` `2023-11` transform).

```js
import { bem } from '@bem-broom/webcomponents';

@bem({ element: 'card', modifiers: ['active'] })
class Card extends HTMLElement {}
customElements.define('bb-card', Card);
// <bb-card active> → host class="card card--active"; descendants see block "card"
```

A class decorator returns the wrapped subclass, so register the decorated
binding (`Card`) — or apply `@bem` *below* a registration decorator if you use
one.

## `BemElement(Base, config)`

The decorator-free form, for projects with no build step (e.g. ESM straight to
the browser). Same behavior as `@bem`.

```js
import { BemElement } from '@bem-broom/webcomponents';

class Card extends BemElement(HTMLElement, {
	element: 'card',
	modifiers: ['active'],
}) {}
customElements.define('bb-card', Card);
```

## Contexts

`bemBlockContext` carries the current block (provided automatically by `@bem` /
`BemElement`); `bemConfigContext` carries tree-wide `prefix` / `verbose` /
`syntax`. Both ride the framework-agnostic Context Protocol, and their keys are
shared via `Symbol.for`, so they interoperate with any protocol-speaking library
or element — including [`@bem-broom/lit`](/bem-broom/lit/guides/). A Lit `@bem`
ancestor and a plain-element `@bem` descendant re-root correctly in one tree.

`consumeContext(host, context, onChange)` is exported for consuming a context on
a bare element without a Lit `ReactiveControllerHost`.

Full signatures, options, and types are in the
[API reference](/bem-broom/webcomponents/api/).
