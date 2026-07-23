<p align="center">
  <img src="https://raw.githubusercontent.com/pgoforth/bem-broom/main/docs/src/assets/bem-broom.png" alt="bem-broom" />

  <h1 align="center">@bem-broom/lit</h1>

  <p align="center">
    Lit helpers for building BEM class names
  </p>
</p>

<div align="center">

[![CI](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml/badge.svg)](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml) [![coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/pgoforth/7aef5fd167d2b627b7c06604ca82af90/raw/bem-broom-lit-coverage.json)](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/%40bem-broom%2Flit.svg)](https://www.npmjs.com/package/@bem-broom/lit) [![minzipped size](https://img.shields.io/bundlephobia/minzip/%40bem-broom%2Flit)](https://bundlephobia.com/package/@bem-broom/lit) [![license](https://img.shields.io/npm/l/%40bem-broom%2Flit.svg)](./LICENSE)

</div>

---

Powered by [`@bem-broom/webcomponents`](../webcomponents) and
[`@bem-broom/core`](../core), the Lit analog of [`@bem-broom/react`](../react):
the current **block** flows
down the DOM via the [Context Protocol](https://lit.dev/docs/data/context/), a
component supplies its **element**, and that element becomes the block for its
descendants.

> **Requires a Lit host.** `@bem` and `BemController` read reactive properties
> and use Lit's reactive-controller lifecycle (`addController`), so they run on
> `LitElement` (or any `ReactiveControllerHost`). For **bare custom elements**
> (no Lit, modifiers driven by attributes), use
> [`@bem-broom/webcomponents`](../webcomponents) instead — it shares the same
> contexts, so the two interoperate in one tree.

## Install

```sh
npm install @bem-broom/lit @bem-broom/core lit
```

`lit` is a peer dependency (`>=3`). Uses **standard (TC39) decorators** — enable
them per [Lit's guide](https://lit.dev/docs/components/decorators/) (TS ≥5.2,
`accessor` on reactive properties; or the `@babel/plugin-proposal-decorators`
`2023-11` transform).

## `@bem(config)` — class decorator

The analog of `withBem`. Reads the block from context, applies the computed BEM
class(es) to the **host** element, and provides `config.element` as the block
for descendants (re-rooting). Reactive properties listed in `config.modifiers`
become modifiers. Apply it **below** `@customElement`.

```js
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bem } from '@bem-broom/lit';

@customElement('bb-card')
@bem({ element: 'card', modifiers: ['active'] })
class Card extends LitElement {
	@property({ type: Boolean }) accessor active = false;
	render() {
		return html`<slot></slot>`;
	}
}
// <bb-card active> → host class="card card--active"; descendants see block "card"
```

| Field | Description |
| --- | --- |
| `element` | **Required.** Element name; also the block for descendants. |
| `modifiers` | Reactive-property names promoted to modifiers (`true` → `--name`, array → one class per item, else → `--name_String(value)`). |
| `block` | Block for the host's own class — a string, or `false` for a root (default: inherit from context). Descendants always re-root to `element`. |

## `@modifier(...)` — declare a member as a modifier

Instead of (or alongside) the `modifiers: [...]` config, mark an
**auto-accessor**, **setter**, or **field** as a BEM modifier by decorating it.
Its value flows into the component's class(es) with the usual coercion (`true` →
`--name`, an array → one class per item, `false`/`null`/`undefined` → skipped,
otherwise → `--name_value`).

```js
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bem, modifier } from '@bem-broom/lit';

@customElement('bb-card')
@bem({ element: 'card' })
class Card extends LitElement {
	@modifier accessor active = false; // name = "active"
	@modifier((n) => n > 5 && 'many') accessor count = 0; // processor
	render() {
		return html`<slot></slot>`;
	}
}
// el.active = true; el.count = 8  →  class="card card--active card--count_many"
```

Both arguments are optional:

| Form | Modifier name | Value |
| --- | --- | --- |
| `@modifier` / `@modifier()` | member name | the member's value |
| `@modifier(processor)` | member name | `processor(value)` |
| `@modifier(name)` | `name` | the member's value |
| `@modifier(name, processor)` | `name` | `processor(value)` |

The **processor** maps the member's value to a BEM value (string, boolean, or
string array).

- **Auto-accessors** and **setters** re-apply when they change; a plain
  **field** is read once at apply time (**static**) — a default or a value fixed
  in a subclass (e.g. `SubmitButton extends Button` with `type = 'submit'`).
- `@modifier` re-renders on set by itself, so it does **not** imply
  `@property` — it triggers on JS assignment (`el.active = true`). For an
  **attribute-driven** modifier, stack `@property` (which owns the attribute and
  its type): `@property({ type: Boolean }) @modifier() accessor active`.
- Works with `@bem` and with `BemController`; coexists with the
  `modifiers: [...]` config. Public members only.

## `BemController` — the low-level builder

The analog of `useBem`: reads the block from context and computes a class name
for a component's **internal** render nodes (it never re-roots).

```js
import { BemController } from '@bem-broom/lit';

class Title extends LitElement {
	#bem = new BemController(this, 'title', { modifiers: ['active'] });
	@property({ type: Boolean }) accessor active = false;
	render() {
		return html`<h2 class=${this.#bem.className}><slot></slot></h2>`;
	}
}
```

## Contexts

- **`bemBlockContext`** — carries the current block. `@bem` provides it
  automatically; consume it directly for advanced cases.
- **`bemConfigContext`** — tree-wide `{ prefix, verbose, syntax }`. Provide it
  once near the root (e.g. Lit's `@provide`) to configure a subtree.

Both are re-exported from [`@bem-broom/webcomponents`](../webcomponents) and ride
the framework-agnostic Context Protocol, so they interoperate with any library or
element that speaks it — including a `@bem-broom/webcomponents` element in the
same tree.
