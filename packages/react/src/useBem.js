// @ts-check
import { BemBlockContext } from './context.js';
import { BemConfigContext } from './config.js';
import { bem } from '@bem-broom/core';
import { useContext } from 'react';

/**
 * Coerce a modifier value to a string, silently returning `undefined` when the
 * value cannot be stringified (a throwing `toString` adds no class).
 * @param {unknown} value
 * @returns {string | undefined}
 */
const toModifierString = (value) => {
	try {
		return String(value);
	} catch {
		return undefined;
	}
};

/**
 * Build a BEM class name for a component.
 *
 * The block comes from `options.block` when given (a string, or `false` to make
 * `element` a root), otherwise from context, and falls back to `element` itself
 * at the root. The hook only *reads* the current block; it never re-roots the
 * context for descendants — use `withBem` for that — so it's safe to call
 * anywhere, e.g. recomputing class names from async state without prop drilling.
 *
 * Every entry in `modifiers` is applied: `true` → `--name`, an array → one
 * `--name_item` per item, `false`/`null`/`undefined` → skipped, anything else →
 * `--name_String(value)` (a throwing `toString` is silently skipped).
 *
 * @param {string} element
 * @param {Record<string, unknown>} [modifiers] Modifier name → value; every
 *   entry is applied (the caller controls exactly which modifiers are set).
 * @param {import('./types.js').UseBemOptions} [options]
 * @returns {string}
 */
export function useBem(element, modifiers = {}, options = {}) {
	const { block } = options;

	const { prefix, verbose, syntax } = useContext(BemConfigContext);
	const parentBlock = useContext(BemBlockContext);

	// Omitted → inherit context; a string → explicit; `false` → force root.
	const resolvedBlock = block === undefined ? parentBlock : block || undefined;
	const isBlock = resolvedBlock === undefined;

	const bemBlock = isBlock ? element : resolvedBlock;
	const elementName = isBlock ? undefined : element;
	const scope = isBlock ? 'block' : 'element';

	// Scalars share one modifier map; each array item gets its own map so the
	// same modifier name can produce several classes (core keys by name).
	/** @type {Record<string, boolean | string>} */
	const scalar = {};
	/** @type {Record<string, boolean | string>[]} */
	const maps = [scalar];

	for (const [name, value] of Object.entries(modifiers)) {
		if (value === true) {
			// eslint-disable-next-line security/detect-object-injection -- caller-owned modifier name
			scalar[name] = true;
		} else if (value === false || value === null || value === undefined) {
			// falsy/absent values contribute no modifier
			continue;
		} else if (Array.isArray(value)) {
			for (const item of value) {
				const str = toModifierString(item);
				if (str !== undefined) {
					maps.push({ [name]: str });
				}
			}
		} else {
			const str = toModifierString(value);
			if (str !== undefined) {
				// eslint-disable-next-line security/detect-object-injection -- caller-owned modifier name
				scalar[name] = str;
			}
		}
	}

	/** @type {Set<string>} */
	const classSet = new Set();
	for (const map of maps) {
		const classes = bem({
			block: bemBlock,
			element: elementName,
			modifiers: scope === 'block' ? { block: map } : { element: map },
			prefix,
			verbose,
			syntax,
		});
		for (const cls of classes) {
			classSet.add(cls);
		}
	}
	return [...classSet].join(' ');
}
