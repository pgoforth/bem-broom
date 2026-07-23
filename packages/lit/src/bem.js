// @ts-check
import { ContextConsumer, ContextProvider } from '@lit/context';
import {
	bemBlockContext,
	bemConfigContext,
	buildClassName,
	collectDecoratedModifiers,
	registerBemApply,
} from '@bem-broom/webcomponents';

/**
 * Wire BEM behavior onto a host instance: provide `element` as the block for
 * descendants, consume the parent block + config, and keep the host's BEM
 * classes in sync on connect and after each render.
 * @param {import('lit').ReactiveControllerHost & HTMLElement} host
 * @param {import('./types.js').BemDecoratorConfig} config
 */
function setupBem(host, config) {
	// Re-root: descendants resolve their block to this element.
	new ContextProvider(host, {
		context: bemBlockContext,
		initialValue: config.element,
	});
	const blockConsumer = new ContextConsumer(host, {
		context: bemBlockContext,
		subscribe: true,
	});
	const configConsumer = new ContextConsumer(host, {
		context: bemConfigContext,
		subscribe: true,
	});

	/** @type {string[]} */
	let applied = [];
	const apply = () => {
		const resolvedBlock =
			config.block === undefined
				? blockConsumer.value
				: config.block || undefined;
		/** @type {Record<string, unknown>} */
		const modifierValues = {};
		for (const name of config.modifiers ?? []) {
			// eslint-disable-next-line security/detect-object-injection -- allowlisted modifier prop name
			modifierValues[name] = /** @type {Record<string, unknown>} */ (
				/** @type {unknown} */ (host)
			)[name];
		}
		Object.assign(modifierValues, collectDecoratedModifiers(host));
		const className = buildClassName({
			element: config.element,
			resolvedBlock,
			modifierValues,
			config: configConsumer.value,
		});
		// A valid element always yields ≥1 class; the `[]` arm is defensive only.
		/* istanbul ignore next -- className is never empty for a valid element */
		const next = className ? className.split(' ') : [];
		// `remove(...[])` on the first apply is a harmless no-op.
		host.classList.remove(...applied);
		host.classList.add(...next);
		applied = next;
	};

	host.addController({ hostConnected: apply, hostUpdated: apply });
	// A `@modifier` set on the host re-applies the host's BEM classes.
	registerBemApply(host, apply);
}

/**
 * Standard (TC39) class decorator that makes a custom element a BEM component —
 * the Lit / web-components analog of `@bem-broom/react`'s `withBem`. It:
 *   - reads the block from context (an ancestor's element, or none at the root),
 *   - applies the computed BEM class(es) to the host element,
 *   - provides `config.element` as the block for descendants (re-rooting),
 *   - recomputes on modifier-property or context change (on Lit hosts).
 *
 * Apply it *below* `@customElement` so the element is defined with the wrapped
 * class:
 * ```js
 * @customElement('bb-card')
 * @bem({ element: 'card', modifiers: ['active'] })
 * class Card extends LitElement { … }
 * ```
 *
 * @template {new (...args: any[]) => HTMLElement} T
 * @param {import('./types.js').BemDecoratorConfig} config
 * @returns {(value: T, context: ClassDecoratorContext) => T}
 */
export function bem(config) {
	return (value, context) => {
		if (context.kind !== 'class') {
			throw new TypeError(
				'The `bem` decorator can only be applied to a class.'
			);
		}
		return /** @type {T} */ (
			class extends value {
				/** @param {...any} args */
				constructor(...args) {
					super(...args);
					setupBem(/** @type {any} */ (this), config);
				}
			}
		);
	};
}
