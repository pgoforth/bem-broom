---
title: "@bem-broom/react"
description: A useBem hook and withBem HOC for building BEM class names in React.
---

`@bem-broom/react` builds BEM class names in React. A context holds the current
**block**; a component supplies its **element**, and — through the `withBem`
HOC — that element becomes the block for its descendants (nesting re-roots
rather than producing invalid nested elements).

```sh
npm install @bem-broom/react @bem-broom/core react
```

`react` is a peer dependency (`>=18`).

## `useBem(element, modifiers?, options?)`

Returns the `className` **string**. It reads the current block from context and
builds this element's class name — it never re-roots, so it's safe to call
anywhere (e.g. driving modifiers from async state without prop drilling).

```jsx
import { useBem } from '@bem-broom/react';

function CardTitle({ children }) {
	const className = useBem('title'); // "card__title title" under a card block
	return <h2 className={className}>{children}</h2>;
}
```

`modifiers` is a `{ name: value }` object — every entry is applied (`true` →
`--name`, an array → one class per item, else → `--name_String(value)`).
`options.block` overrides the block inline (a string, or `false` to force a
root).

## `withBem(Component, config)`

Higher-order component. It injects the computed `className`, promotes the props
listed in `config.modifiers`, and provides `config.element` as the block context
for descendants.

```jsx
import { withBem } from '@bem-broom/react';

const Card = withBem(
	({ className, children }) => <div className={className}>{children}</div>,
	{ element: 'card', modifiers: ['active'] }
);
```

## Tree-wide config: `<BemConfigProvider>`

`prefix`, `verbose`, and `syntax` are set for a subtree via
`<BemConfigProvider>` rather than per call, and nested providers override only
what they specify.

Full signatures, options, and types are in the
[API reference](/bem-broom/react/api/).
