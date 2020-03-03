// @ts-check
import { ContextEvent } from '@lit/context';

/**
 * @template T
 * @typedef {object} ContextConsumption
 * @property {T | undefined} value The most recently provided value (`undefined` until a provider answers).
 * @property {() => void} request Dispatch a `context-request` to (re)subscribe to a provider.
 * @property {() => void} dispose Unsubscribe from the current provider.
 */

/**
 * Subscribe to a context value on a host element using the framework-agnostic
 * [Context Protocol](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md).
 *
 * Unlike `@lit/context`'s `ContextConsumer`, this needs no
 * `ReactiveControllerHost` — it works on a bare `HTMLElement`, so a plain custom
 * element can consume a block/config provided by any protocol-speaking ancestor
 * (Lit or otherwise). The `onChange` callback fires synchronously on `request()`
 * if a provider answers, and again whenever a subscribed provider's value
 * changes.
 *
 * @template T
 * @param {HTMLElement} host The element that dispatches the request.
 * @param {import('@lit/context').Context<unknown, T>} context The context key to request.
 * @param {(value: T | undefined) => void} [onChange] Called with each new value.
 * @returns {ContextConsumption<T>}
 */
export function consumeContext(host, context, onChange) {
	/** @type {T | undefined} */
	let value;
	/** @type {(() => void) | undefined} */
	let unsubscribe;

	// Stable identity so the provider dedupes this consumer across re-requests.
	/** @param {T} next @param {() => void} [dispose] */
	const callback = (next, dispose) => {
		// A changed disposer means a new (more specific) provider took over —
		// release the previous subscription before adopting the new one.
		if (unsubscribe && unsubscribe !== dispose) {
			unsubscribe();
		}
		value = next;
		unsubscribe = dispose;
		if (onChange) {
			onChange(next);
		}
	};

	return {
		get value() {
			return value;
		},
		request() {
			// Clear first so that if no provider answers (e.g. the element was
			// moved out of its block's subtree), the value falls back to
			// `undefined` instead of retaining a stale one. A provider that does
			// answer calls back synchronously during dispatch and resets it.
			value = undefined;
			host.dispatchEvent(new ContextEvent(context, host, callback, true));
		},
		dispose() {
			if (unsubscribe) {
				unsubscribe();
				unsubscribe = undefined;
			}
		},
	};
}
