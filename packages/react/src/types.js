// @ts-check

/**
 * Tree-wide BEM settings forwarded to `@bem-broom/core`'s `bem()`. Provided via
 * `<BemConfigProvider>` and read by `useBem` / `withBem`.
 * @typedef {object} BemConfig
 * @property {string} [prefix] Prefix prepended to every class name.
 * @property {boolean} [verbose] Emit verbose (compound) modifier classes.
 * @property {Parameters<typeof import('@bem-broom/core').bem>[0]['syntax']} [syntax] Custom BEM syntax.
 */

/**
 * Options for the `useBem` hook.
 * @typedef {object} UseBemOptions
 * @property {string | false} [block] The block for this call: a string sets it
 *   explicitly (an inline override needing no higher-level provider), `false`
 *   makes `element` its own block (a root), and omitting it inherits the block
 *   from context.
 */

/**
 * Configuration for the `withBem` HOC.
 * @typedef {object} WithBemConfig
 * @property {string} element The element name; also becomes the block for descendants.
 * @property {string[]} [modifiers] Prop names whose values are promoted to BEM modifiers.
 * @property {string | false} [block] Block for the component's own class: a string
 *   sets it explicitly, `false` makes `element` a root, omitting it inherits from
 *   context. Descendants always re-root to `element` regardless.
 * @property {boolean} [stripModifierProps] Omit modifier props from the wrapped component.
 */
