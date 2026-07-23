// @ts-check
import {
	bemBlockContext,
	bemConfigContext,
	buildClassName,
	collectDecoratedModifiers,
	registerBemApply,
} from '@bem-broom/webcomponents';
import { ContextConsumer } from '@lit/context';

/**
 * Computes a BEM class name from the current block context and the host's
 * modifier properties — the analog of `@bem-broom/react`'s `useBem`. It only
 * *reads* the block from context (it never re-roots), so use it for class names
 * on a component's internal render nodes. Subscribed context consumers request
 * a host update when the block or config changes.
 */
export class BemController {
	// Private: the context consumers are implementation detail, and keeping them
	// off the public type avoids leaking @bem-broom/webcomponents' config type
	// into this class's emitted declaration.
	#block;
	#config;

	/**
	 * @param {import('lit').ReactiveControllerHost & HTMLElement} host
	 * @param {string} element
	 * @param {import('./types.js').BemControllerOptions} [options]
	 */
	constructor(host, element, options = {}) {
		this.host = host;
		this.element = element;
		this.modifiers = options.modifiers ?? [];
		this.block = options.block;
		this.#block = new ContextConsumer(host, {
			context: bemBlockContext,
			subscribe: true,
		});
		this.#config = new ContextConsumer(host, {
			context: bemConfigContext,
			subscribe: true,
		});
		// A `@modifier` set on the host requests an update so `className` — read
		// in the host's render — recomputes.
		registerBemApply(host, () => host.requestUpdate());
	}

	/** @returns {string} The computed BEM class name. */
	get className() {
		const parentBlock = this.#block.value;
		const resolvedBlock =
			this.block === undefined ? parentBlock : this.block || undefined;
		/** @type {Record<string, unknown>} */
		const modifierValues = {};
		for (const name of this.modifiers) {
			// eslint-disable-next-line security/detect-object-injection -- caller-owned modifier prop name
			modifierValues[name] = /** @type {Record<string, unknown>} */ (
				/** @type {unknown} */ (this.host)
			)[name];
		}
		Object.assign(modifierValues, collectDecoratedModifiers(this.host));
		return buildClassName({
			element: this.element,
			resolvedBlock,
			modifierValues,
			config: this.#config.value,
		});
	}
}
