// @ts-check
import { bem } from '@bem-broom/core';

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
 * Build a BEM class string from a block/element plus a map of modifier values,
 * mirroring `@bem-broom/react`'s `useBem` coercion: `true` → `--name`, an array
 * → one `--name_item` per item, `false`/`null`/`undefined` → skipped, anything
 * else → `--name_String(value)` (a throwing `toString` is silently skipped).
 *
 * @param {object} args
 * @param {string} args.element
 * @param {string | undefined} args.resolvedBlock  Block from context, or `undefined` for a root.
 * @param {Record<string, unknown>} args.modifierValues
 * @param {import('./types.js').BemConfig} [args.config]
 * @returns {string}
 */
export function buildClassName({
	element,
	resolvedBlock,
	modifierValues,
	config = {},
}) {
	const isBlock = resolvedBlock === undefined;
	const block = isBlock ? element : resolvedBlock;
	const elementName = isBlock ? undefined : element;
	const scope = isBlock ? 'block' : 'element';

	// Scalars share one modifier map; each array item gets its own map so the
	// same modifier name can produce several classes (core keys by name).
	/** @type {Record<string, boolean | string>} */
	const scalar = {};
	/** @type {Record<string, boolean | string>[]} */
	const maps = [scalar];

	for (const [name, value] of Object.entries(modifierValues)) {
		if (value === true) {
			// eslint-disable-next-line security/detect-object-injection -- caller-owned modifier name
			scalar[name] = true;
		} else if (value === false || value === null || value === undefined) {
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
			block,
			element: elementName,
			modifiers: scope === 'block' ? { block: map } : { element: map },
			prefix: config.prefix,
			verbose: config.verbose,
			syntax: config.syntax,
		});
		for (const cls of classes) {
			classSet.add(cls);
		}
	}
	return [...classSet].join(' ');
}
