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

## `@modifier(...)`

Instead of (or alongside) the `modifiers: [...]` config, mark an
**auto-accessor**, **setter**, or **field** as a modifier by decorating it. The
value flows into the host's class(es) with the usual coercion (`true` → `--name`,
an array → one class per item, `false`/`null`/`undefined` → skipped, otherwise →
`--name_value`).

```js
import { bem, modifier } from '@bem-broom/webcomponents';

@bem({ element: 'card' })
class Card extends HTMLElement {
	@modifier accessor active = false; // name = "active"
	@modifier('loading') accessor isLoading = false; // explicit name
	@modifier((n) => n > 5 && 'many') accessor count = 0; // processor
	@modifier('bp', (list) => list) accessor bps = []; // name + processor
}
customElements.define('bb-card', Card);
// el.active = true; el.count = 8  →  class="card card--active card--count_many"
```

Both arguments are optional — `@modifier(name?, processor?)`. When the first is
a function it's the **processor** (maps the value to a string, boolean, or string
array); when it's a string it's the modifier **name**. Bare `@modifier` uses the
member name.

Auto-accessors and setters re-apply on change. A plain **field** is read once at
apply time (static) — use it for a default or a value fixed in a subclass (e.g.
`SubmitButton extends Button` with `type = 'submit'`); changing a field after
render won't re-apply. It's JS-property-driven, coexists with the
`modifiers: [...]` config, and works on public members only.

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
