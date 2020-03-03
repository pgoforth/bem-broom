// @ts-check
import { BemElement } from './bemElement.js';

/**
 * Standard (TC39) class decorator that makes a custom element a BEM component —
 * the web-components analog of `@bem-broom/react`'s `withBem`, and a thin
 * adapter over the {@link BemElement} mixin. Unlike `@bem-broom/lit`'s decorator
 * it needs no Lit host: it drives the custom-element lifecycle directly, so it
 * runs on a bare `HTMLElement`. It:
 *   - reads the block from context (an ancestor's element, or none at the root),
 *   - applies the computed BEM class(es) to the host element,
 *   - provides `config.element` as the block for descendants (re-rooting),
 *   - observes `config.modifiers` as attributes and recomputes on change.
 *
 * Apply it *below* a registration decorator (or register the wrapped class
 * yourself), since a class decorator returns the wrapped subclass:
 * ```js
 * @bem({ element: 'card', modifiers: ['active'] })
 * class Card extends HTMLElement {}
 * customElements.define('bb-card', Card);
 * ```
 *
 * @template {new (...args: any[]) => HTMLElement} T
 * @param {import('./types.js').BemElementConfig} config
 * @returns {(value: T, context: ClassDecoratorContext) => T}
 */
export function bem(config) {
	return (value, context) => {
		if (context.kind !== 'class') {
			throw new TypeError(
				'The `bem` decorator can only be applied to a class.'
			);
		}
		return /** @type {T} */ (BemElement(value, config));
	};
}
