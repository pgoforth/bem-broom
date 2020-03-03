// @ts-check

/**
 * Tree-wide BEM config carried by `bemConfigContext` and forwarded to
 * `@bem-broom/core`'s `bem()`.
 * @typedef {object} BemConfig
 * @property {string} [prefix] Prefix prepended to every class name.
 * @property {boolean} [verbose] Emit verbose (compound) modifier classes.
 * @property {Parameters<typeof import('@bem-broom/core').bem>[0]['syntax']} [syntax] Custom BEM syntax.
 */

/**
 * Options for {@link BemController}.
 * @typedef {object} BemControllerOptions
 * @property {string[]} [modifiers] Host property names whose values are applied as BEM modifiers.
 * @property {string | false} [block] Override the block for this call: a string
 *   sets it explicitly, `false` makes `element` its own block (a root); omit to
 *   inherit the block from context.
 */

/**
 * Configuration for the `bem` class decorator.
 * @typedef {object} BemDecoratorConfig
 * @property {string} element The element name; also becomes the block for descendants.
 * @property {string[]} [modifiers] Host property names whose values are applied as BEM modifiers.
 * @property {string | false} [block] Override the block for the host's own class
 *   (see {@link BemControllerOptions}). Descendants always re-root to `element`.
 */

export {};
