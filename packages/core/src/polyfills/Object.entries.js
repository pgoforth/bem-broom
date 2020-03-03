/**
 * ES2015-safe stand-in for `Object.entries` (which requires ES2017), so the
 * distribution needs no runtime polyfills.
 * @template T
 * @param {Record<string, T>} obj
 * @returns {Array<[string, T]>}
 */
export function objectEntries(obj) {
	return Object.keys(obj).map((key) => [
		key,
		// eslint-disable-next-line security/detect-object-injection -- `key` comes from Object.keys(obj)
		obj[key],
	]);
}
