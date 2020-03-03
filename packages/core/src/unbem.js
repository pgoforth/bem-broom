// @ts-check
import { hyphenated } from './syntax/hyphenated.js';

/**
 * Cache of compiled matchers, keyed by prefix + resolved separators. The regex
 * depends only on those, so repeated calls with the same options reuse it
 * instead of recompiling on every call.
 * @type {Map<string, { regexp: RegExp, block: string }>}
 */
const matcherCache = new Map();

/**
 * Escape a separator/prefix for literal use inside a RegExp.
 * @param {string} value
 * @returns {string}
 */
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Build (memoized) a single RegExp that captures block, element, modifier and
 * value in one pass — no splitting. Names use a BEM word pattern (alphanumerics
 * joined by the syntax `space` separator), the same approach as
 * `@bem/sdk.naming`: because names can't contain the separators, every boundary
 * is unambiguous and one regex suffices. Built dynamically from the resolved
 * separators — nothing is hardcoded.
 * @param {string} prefix
 * @param {import('./types.js').BEMSyntax} [syntax]
 * @returns {{ regexp: RegExp, block: string }}
 */
const getMatcher = (prefix, syntax) => {
	const { block, modifier, value, space } = { ...hyphenated, ...syntax };
	const key = `${prefix} ${block} ${modifier} ${value} ${space}`;
	let entry = matcherCache.get(key);
	if (!entry) {
		const word = `([a-zA-Z0-9]+(?:${escapeRegExp(space)}[a-zA-Z0-9]+)*)`;
		const p = escapeRegExp(prefix);
		const blk = escapeRegExp(block);
		const mod = `(?:${escapeRegExp(modifier)}${word})?`;
		const val = `(?:${escapeRegExp(value)}${word})?`;
		entry = {
			block,
			// Element form first (groups 1–6), then block-only (groups 7–9).
			// eslint-disable-next-line security/detect-non-literal-regexp -- pattern built from the caller's own separators/prefix
			regexp: new RegExp(
				`^${p}${word}${mod}${val}${blk}${word}${mod}${val}$|^${p}${word}${mod}${val}$`
			),
		};
		matcherCache.set(key, entry);
	}
	return entry;
};

/**
 * Set a modifier on a result object, creating the nested maps as needed.
 * @param {import('./types.js').BEMObject} obj
 * @param {'block' | 'element'} scope
 * @param {string} name
 * @param {string | boolean} val
 */
const addModifier = (obj, scope, name, val) => {
	obj.modifiers = obj.modifiers || {};
	// eslint-disable-next-line security/detect-object-injection -- `scope` is the literal 'block' | 'element'
	const scoped = (obj.modifiers[scope] = obj.modifiers[scope] || {});
	// eslint-disable-next-line security/detect-object-injection -- `name` is a parsed BEM word, keying a plain data object
	scoped[name] = val;
};

/**
 * Parse a list of BEM class names into deduplicated BEM objects.
 *
 * Classes are sorted **links-first** (`block__element` forms before bare
 * `block`/`block--modifier` forms) and then merged in a single pass. Sorting
 * makes the result independent of the input order — every element→block link is
 * established before any standalone modifier class is folded in — so the same
 * set of classes always yields the same objects.
 *
 * @param {string|string[]} passedClasses
 * @param {{ prefix?: string, syntax?: import('./types.js').BEMSyntax }} [options]
 * @return {import('./types.js').BEMObject[]}
 */
export const unbem = (passedClasses, { prefix = '', syntax } = {}) => {
	let classes = passedClasses;

	if (typeof passedClasses === 'string') {
		classes = passedClasses.split(' ');
	}

	if (!classes || !Array.isArray(classes)) {
		throw new Error(
			'You must specify a single class string, or an array of class names'
		);
	}

	const { regexp, block: blockSeparator } = getMatcher(prefix, syntax);

	// Links-first, then lexicographic — a total order, so the merge below is a
	// pure function of the class set, not its order.
	const sorted = [...classes].sort((a, b) => {
		const elementFormA = a.includes(blockSeparator) ? 0 : 1;
		const elementFormB = b.includes(blockSeparator) ? 0 : 1;
		return elementFormA - elementFormB || (a < b ? -1 : a > b ? 1 : 0);
	});

	/** @type {import('./types.js').BEMObject[]} */
	const results = [];
	/** @type {Map<string, import('./types.js').BEMObject>} */
	const byBlock = new Map();
	/** @type {Map<string, import('./types.js').BEMObject[]>} */
	const elementOwners = new Map();

	/** @param {string} name */
	const resultFor = (name) => {
		let result = byBlock.get(name);
		if (!result) {
			result = { block: name };
			results.push(result);
			byBlock.set(name, result);
		}
		return result;
	};

	for (const className of sorted) {
		const parsed = regexp.exec(className);
		if (!parsed) {
			continue;
		}

		const element = parsed[4];
		if (element !== undefined) {
			// Element form (groups 1–6): establish block__element, fold in mods.
			// The word pattern guarantees the block group is present when the
			// element branch matches.
			const block = /** @type {string} */ (parsed[1]);
			const result = resultFor(block);
			result.element = element;

			let owners = elementOwners.get(element);
			if (!owners) {
				owners = [];
				elementOwners.set(element, owners);
			}
			if (!owners.includes(result)) {
				owners.push(result);
			}

			if (parsed[2]) {
				addModifier(result, 'block', parsed[2], parsed[3] || true);
			}
			if (parsed[5]) {
				addModifier(result, 'element', parsed[5], parsed[6] || true);
			}
		} else {
			// Block-only form (groups 7–9). If this name is a known element, its
			// modifier belongs to every block that owns that element; otherwise
			// it's a standalone block. The word pattern guarantees the block group
			// is present when this branch matches.
			const block = /** @type {string} */ (parsed[7]);
			const owners = elementOwners.get(block);
			if (owners) {
				if (parsed[8]) {
					for (const owner of owners) {
						addModifier(owner, 'element', parsed[8], parsed[9] || true);
					}
				}
			} else {
				const result = resultFor(block);
				if (parsed[8]) {
					addModifier(result, 'block', parsed[8], parsed[9] || true);
				}
			}
		}
	}

	return results;
};
