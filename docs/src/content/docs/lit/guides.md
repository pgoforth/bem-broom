---
title: "@bem-broom/lit"
description: Standard-decorator Lit helpers for building BEM class names.
---

`@bem-broom/lit` builds BEM class names in Lit. The current **block** flows down
the DOM via the framework-agnostic
[Context Protocol](https://lit.dev/docs/data/context/); a component supplies its
**element**, and — through the `@bem` decorator — that element becomes the block
for its descendants. For **plain custom elements** (no Lit), use
[`@bem-broom/webcomponents`](/bem-broom/webcomponents/guides/) instead.

```sh
npm install @bem-broom/lit @bem-broom/core lit
```

`lit` is a peer dependency (`>=3`). The package uses **standard (TC39)
decorators** — enable them per
[Lit's guide](https://lit.dev/docs/components/decorators/).

:::caution[Requires a Lit host]
`@bem` and `BemController` read reactive properties and use Lit's
reactive-controller lifecycle (`addController`), so they run on `LitElement` (or
any `ReactiveControllerHost`) — not on a bare `HTMLElement`. For plain custom
elements (no Lit, modifiers from attributes), use
[`@bem-broom/webcomponents`](/bem-broom/webcomponents/guides/) — it shares the
same contexts, so the two interoperate in one tree.
:::

## `@bem(config)`

Class decorator, the analog of react's `withBem`. It reads the block from
context, applies the computed BEM class(es) to the **host** element, promotes
the reactive properties listed in `config.modifiers` to modifiers, and provides
`config.element` as the block for descendants. Apply it **below**
`@customElement`.

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

## `BemController`

The analog of react's `useBem`: reads the block from context and computes a
class name for a component's **internal** render nodes (it never re-roots).

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

`bemBlockContext` carries the current block (provided automatically by `@bem`);
`bemConfigContext` carries tree-wide `prefix` / `verbose` / `syntax` — provide it
once near the root (e.g. Lit's `@provide`). Both are re-exported from
[`@bem-broom/webcomponents`](/bem-broom/webcomponents/guides/) and ride the
framework-agnostic Context Protocol, so they interoperate with any library or
element that speaks it — including a `@bem-broom/webcomponents` element in the
same tree.

Full signatures, options, and types are in the
[API reference](/bem-broom/lit/api/).
