// @ts-check
import { createContext } from '@lit/context';

// Keys use `Symbol.for(...)` (the global symbol registry) rather than a unique
// `Symbol(...)` so that separate copies of this module — e.g. `@bem-broom/lit`
// resolving its own install of `@bem-broom/webcomponents` — still share the same
// context key. That lets a Lit `@bem` ancestor and a plain-element `@bem`
// descendant interoperate in one tree even when the packages aren't deduped.

/**
 * Context carrying the current BEM **block** down the DOM tree — `undefined` at
 * the root, where a component's element becomes the block. Built on the
 * framework-agnostic Context Protocol (`context-request` events), so it
 * interoperates with any library or element that speaks the protocol.
 * @type {import('@lit/context').Context<symbol, string | undefined>}
 */
export const bemBlockContext = createContext(Symbol.for('bem-broom.block'));

/**
 * Context carrying tree-wide BEM config (`prefix` / `verbose` / `syntax`).
 * Provide it once near the root.
 * @type {import('@lit/context').Context<symbol, import('./types.js').BemConfig>}
 */
export const bemConfigContext = createContext(Symbol.for('bem-broom.config'));
