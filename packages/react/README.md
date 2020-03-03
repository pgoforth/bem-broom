<p align="center">
  <img src="https://raw.githubusercontent.com/pgoforth/bem-broom/main/docs/src/assets/bem-broom.png" alt="bem-broom" />

  <h1 align="center">@bem-broom/react</h1>

  <p align="center">
    React helpers for building BEM class names
  </p>
</p>

<div align="center">

[![CI](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml/badge.svg)](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml) [![coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/pgoforth/7aef5fd167d2b627b7c06604ca82af90/raw/bem-broom-react-coverage.json)](https://github.com/pgoforth/bem-broom/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/%40bem-broom%2Freact.svg)](https://www.npmjs.com/package/@bem-broom/react) [![minzipped size](https://img.shields.io/bundlephobia/minzip/%40bem-broom%2Freact)](https://bundlephobia.com/package/@bem-broom/react) [![license](https://img.shields.io/npm/l/%40bem-broom%2Freact.svg)](./LICENSE)

</div>

---

Built on [`@bem-broom/core`](../core), following the [BEM](http://getbem.com/)
methodology.

## Install

```sh
npm install @bem-broom/react @bem-broom/core react
```

`react` is a peer dependency (`>=18`).

## How it works

A React context holds the current **block**. A component defines its **element**;
the class name is `block__element` (block taken from context). When you wrap a
component with [`withBem`](#withbemcomponent-config), its element becomes the
block for descendants, so nesting re-roots rather than producing invalid nested
elements (`card__title` → children are `title__…`). At the root there's no block,
so the element _is_ the block. The [`useBem`](#usebemelement-modifiers-options)
hook only reads the current block — it never re-roots — so it's the tool for
computing class names in place.

Modifiers come from the `{ name: value }` object you pass to `useBem`, or — with
`withBem` — from the props you allowlist via `config.modifiers` (forwarded to the
component by default; set `stripModifierProps: true` to consume them).

## `useBem(element, modifiers?, options?)`

Returns the `className` **string**. The hook **reads** the current block from
context and builds this element's class name — it does not re-root the context
for descendants. Use [`withBem`](#withbemcomponent-config) when you need to
establish a new block for a subtree.

`modifiers` is a plain `{ name: value }` object — every entry is applied, so you
pass exactly the modifiers you want (no allowlist). Values coerce the same way
everywhere: `true` → `--name`, an array → one `--name_item` per item,
`false`/`null`/`undefined` → skipped, anything else → `--name_String(value)` (a
throwing `toString` is silently skipped).

Because it's a pure consumer, `useBem` is safe to call anywhere and recomputes
its class name whenever its inputs change — handy for driving modifiers from
async state without prop drilling.

```jsx
import { useBem } from '@bem-broom/react';

// Element: block comes from context → "card__title title"
function CardTitle({ children }) {
 const className = useBem('title');
 return <h2 className={className}>{children}</h2>;
}

// Modifiers driven by async state — no prop drilling, no provider needed
function CardStatus({ id }) {
 const { data } = useQuery(id);
 const className = useBem('status', { loading: !data, state: data?.state });
 // → "card__status status status--loading" while loading, then
 //   "card__status status status--state_active" once resolved
 return <span className={className} />;
}
```

### Options

| Option | Description |
| --- | --- |
| `block` | The block for this call. A **string** sets it explicitly (an inline override needing no higher-level provider); `false` makes `element` its own block (a root); **omitting it** inherits the block from context (the default). |

```jsx
// No context block? Set one inline without wrapping a provider:
const className = useBem('title', {}, { block: 'card' }); // → "card__title title"

// Force a root even inside a block context:
const className = useBem('title', {}, { block: false }); // → "title"

// "explicit block if I have one, else a root": block: maybe ?? false
```

To set the block for a subtree instead, wrap it with `withBem` (below).

## `withBem(Component, config)`

Higher-order component. Injects the computed `className` (merged with any
incoming `className`), promotes the props named in `config.modifiers` to
modifiers, and provides `config.element` as the block context automatically.

```jsx
import { withBem } from '@bem-broom/react';

const Card = withBem(
 ({ className, children }) => <div className={className}>{children}</div>,
 { element: 'body', modifiers: ['padded'], stripModifierProps: true }
);

// <Card active>
//   <CardTitle>Hi</CardTitle>
//   <CardBody padded>…</CardBody>
// </Card>
// → <div class="card card--active">
//      <h2 class="card__title title">Hi</h2>
//      <div class="card__body body body--padded">…</div>
//    </div>
```

### Config

| Field | Description |
| --- | --- |
| `element` | **Required.** The element name; also becomes the block for descendants. |
| `modifiers` | Prop names (an allowlist) promoted to modifiers. Values coerce as in `useBem`. |
| `block` | Block for the component's own class — a string, or `false` for a root (default: inherit from context). Descendants always re-root to `element` regardless. |
| `stripModifierProps` | Omit the modifier props from the wrapped component (default `false`). |

`prefix`, `verbose`, and `syntax` are **tree-wide** settings — see `BemConfigProvider`.

## Tree-wide config: `<BemConfigProvider>`

`prefix`, `verbose`, and `syntax` are set for a subtree via `<BemConfigProvider>` rather
than per call. Set it once near the root; nest another `<BemConfigProvider>` to override
part of the tree (unspecified values inherit from the outer one).

```jsx
import { BemConfigProvider } from '@bem-broom/react';

<BemConfigProvider prefix="app-" syntax={mySyntax}>
	<App />
</BemConfigProvider>;

// deeper down, useBem/withBem pick these up automatically:
const className = useBem('title'); // → "app-card__title app-title"
```

## Also exported

- **`bemClassName(bemObject)`** — a context-free helper that returns the joined
  class string from an explicit BEM object.
