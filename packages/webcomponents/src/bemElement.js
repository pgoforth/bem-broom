// @ts-check
import { bemBlockContext, bemConfigContext } from './context.js';
import { ContextProvider } from '@lit/context';
import { buildClassName } from './buildClassName.js';
import { consumeContext } from './consumeContext.js';

/**
 * A custom-element instance shape with the optional lifecycle callbacks the
 * mixin chains to. Plain `HTMLElement` doesn't declare these, so we widen the
 * base to make `super.connectedCallback?.()` (etc.) type-check.
 * @typedef {HTMLElement & {
 *   connectedCallback?(): void;
 *   disconnectedCallback?(): void;
 *   attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
 * }} CustomElementLike
 */

/**
 * Wire BEM behavior onto a bare custom-element instance: provide `element` as
 * the block for descendants, consume the parent block + config from context, and
 * keep the host's own BEM classes in sync across connect and attribute changes.
 * Returns the lifecycle hooks the mixin drives from the element's callbacks.
 * @param {HTMLElement} host
 * @param {import('./types.js').BemElementConfig} config
 */
function setupBem(host, config) {
	// Re-root: descendants resolve their block to this element. `ContextProvider`
	// works on a bare element — it uses `host.addController?.()` (optional) and
	// attaches its `context-request` listener in the constructor — so we only
	// need to drive `hostConnected()` from `connectedCallback` below.
	const provider = new ContextProvider(host, {
		context: bemBlockContext,
		initialValue: config.element,
	});

	let connected = false;
	/** @type {string[]} */
	let applied = [];
	/** @type {import('./consumeContext.js').ContextConsumption<string | undefined>} */
	let blockConsumer;
	/** @type {import('./consumeContext.js').ContextConsumption<import('./types.js').BemConfig>} */
	let configConsumer;

	const apply = () => {
		// Attribute callbacks can fire during upgrade, before connect; ignore
		// them until we're connected (and have requested context).
		if (!connected) {
			return;
		}
		const resolvedBlock =
			config.block === undefined
				? blockConsumer.value
				: config.block || undefined;
		/** @type {Record<string, unknown>} */
		const modifierValues = {};
		for (const name of config.modifiers ?? []) {
			// A present boolean attribute (empty value) → `true`; a valued
			// attribute → its string; an absent attribute → `false` (skipped).
			const raw = host.getAttribute(name);
			// eslint-disable-next-line security/detect-object-injection -- allowlisted attribute name
			modifierValues[name] = raw === null ? false : raw === '' ? true : raw;
		}
		const className = buildClassName({
			element: config.element,
			resolvedBlock,
			modifierValues,
			config: configConsumer.value,
		});
		const next = className ? className.split(' ') : [];
		if (applied.length) {
			host.classList.remove(...applied);
		}
		if (next.length) {
			host.classList.add(...next);
		}
		applied = next;
	};

	blockConsumer = consumeContext(host, bemBlockContext, apply);
	configConsumer = consumeContext(host, bemConfigContext, apply);

	return {
		connected() {
			connected = true;
			// Announce this provider so ancestor providers re-parent their
			// subscriptions to us (nested re-rooting), then request our own
			// parent block + config. `request()` calls `apply` synchronously if a
			// provider answers; the trailing `apply` covers the root case.
			provider.hostConnected();
			blockConsumer.request();
			configConsumer.request();
			apply();
		},
		disconnected() {
			connected = false;
			blockConsumer.dispose();
			configConsumer.dispose();
		},
		attributeChanged() {
			apply();
		},
	};
}

/**
 * Mixin that makes a custom-element class a BEM component — the decorator-free
 * form of {@link bem}, for projects that don't compile TC39 decorators. It:
 *   - reads the block from context (an ancestor's element, or none at the root),
 *   - applies the computed BEM class(es) to the host element,
 *   - provides `config.element` as the block for descendants (re-rooting),
 *   - observes `config.modifiers` as attributes and recomputes on change.
 *
 * ```js
 * class Card extends BemElement(HTMLElement, { element: 'card', modifiers: ['active'] }) {}
 * customElements.define('bb-card', Card);
 * // <bb-card active> → host class="card card--active"; descendants see block "card"
 * ```
 *
 * @template {new (...args: any[]) => CustomElementLike} T
 * @param {T} Base The custom-element base class to extend (e.g. `HTMLElement`).
 * @param {import('./types.js').BemElementConfig} config
 * @returns {T}
 */
export function BemElement(Base, config) {
	return /** @type {T} */ (
		class extends Base {
			static get observedAttributes() {
				const inherited =
					/** @type {{ observedAttributes?: string[] }} */ (Base)
						.observedAttributes ?? [];
				return [...inherited, ...(config.modifiers ?? [])];
			}

			/** @type {ReturnType<typeof setupBem>} */
			#bem;

			/** @param {...any} args */
			constructor(...args) {
				super(...args);
				this.#bem = setupBem(this, config);
			}

			connectedCallback() {
				super.connectedCallback?.();
				this.#bem.connected();
			}

			disconnectedCallback() {
				super.disconnectedCallback?.();
				this.#bem.disconnected();
			}

			/**
			 * @param {string} name
			 * @param {string | null} oldValue
			 * @param {string | null} newValue
			 */
			attributeChangedCallback(name, oldValue, newValue) {
				super.attributeChangedCallback?.(name, oldValue, newValue);
				this.#bem.attributeChanged();
			}
		}
	);
}
