// @ts-check
import { createContext, createElement, useContext, useMemo } from 'react';

// Not part of the public API — read internally by useBem, provided by <BemConfigProvider>.
/** @type {import('react').Context<import('./types.js').BemConfig>} */
export const BemConfigContext = createContext(
	/** @type {import('./types.js').BemConfig} */ ({})
);

/**
 * Provide tree-wide BEM config (`prefix` / `verbose` / `syntax`) via context.
 * Values merge with any inherited config — set it once near the root, and nest
 * another `<BemConfigProvider>` to override a subtree.
 *
 * @param {import('./types.js').BemConfig & { children?: import('react').ReactNode }} props
 */
export function BemConfigProvider({ children, prefix, verbose, syntax }) {
	const inherited = useContext(BemConfigContext);
	const value = useMemo(
		() => ({
			prefix: prefix ?? inherited.prefix,
			verbose: verbose ?? inherited.verbose,
			syntax: syntax ?? inherited.syntax,
		}),
		[inherited, prefix, verbose, syntax]
	);
	return createElement(BemConfigContext.Provider, { value }, children);
}
