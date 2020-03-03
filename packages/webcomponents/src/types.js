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
 * Configuration for the `bem` decorator and the `BemElement` mixin.
 *
 * Because plain custom elements expose state through **attributes**, `modifiers`
 * lists *attribute names* to observe (not JS properties, as in the React/Lit
 * packages): a present boolean attribute → `--name`, an attribute with a value →
 * `--name_value`, an absent attribute → skipped.
 * @typedef {object} BemElementConfig
 * @property {string} element The element name; also becomes the block for descendants.
 * @property {string[]} [modifiers] Attribute names observed and applied as BEM modifiers.
 * @property {string | false} [block] Override the block for the host's own class:
 *   a string sets it explicitly, `false` makes `element` its own block (a root);
 *   omit to inherit the block from context. Descendants always re-root to `element`.
 */

export {};
