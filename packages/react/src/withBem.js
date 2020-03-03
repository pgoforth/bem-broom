// @ts-check
import { BemBlockContext } from './context.js';
import { createElement } from 'react';
import { useBem } from './useBem.js';

/**
 * Wrap a component so it receives a computed BEM `className` prop. Reads the
 * block from context, promotes the props named in `config.modifiers` to
 * modifiers, and provides its `element` as the block for descendants.
 *
 * @param {import('react').ComponentType<any>} Component
 * @param {import('./types.js').WithBemConfig} config
 * @returns {import('react').FunctionComponent<Record<string, unknown>>}
 */
export function withBem(Component, config) {
	const { element, modifiers = [], block, stripModifierProps } = config;

	/** @param {Record<string, unknown>} props */
	const Wrapped = (props) => {
		// Pick the allowlisted props into a value map; the hook coerces values.
		/** @type {Record<string, unknown>} */
		const modifierValues = {};
		for (const name of modifiers) {
			if (name in props) {
				// eslint-disable-next-line security/detect-object-injection -- allowlisted modifier name
				modifierValues[name] = props[name];
			}
		}

		const className = useBem(element, modifierValues, { block });
		const incoming = typeof props.className === 'string' ? props.className : '';
		const merged = incoming ? `${className} ${incoming}` : className;

		// Drop the incoming className (we inject the merged one) and, when
		// requested, the modifier props so they don't leak onto the component.
		const { className: _incomingClassName, ...forwarded } = props;
		if (stripModifierProps) {
			for (const name of modifiers) {
				// eslint-disable-next-line security/detect-object-injection -- allowlisted modifier name
				delete forwarded[name];
			}
		}

		// Re-root the block context to this element so descendants compose from it.
		return createElement(
			BemBlockContext.Provider,
			{ value: element },
			createElement(Component, { ...forwarded, className: merged })
		);
	};

	const name = Component.displayName || Component.name || 'Component';
	Wrapped.displayName = `withBem(${name})`;

	return Wrapped;
}
