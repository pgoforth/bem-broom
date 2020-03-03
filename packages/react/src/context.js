// @ts-check
import { createContext } from 'react';

/**
 * Holds the current BEM block for a subtree. `undefined` at the root, where a
 * component's element becomes the block. Advanced consumers can provide it
 * directly to set an explicit root block.
 * @type {import('react').Context<string | undefined>}
 */
export const BemBlockContext = createContext(
	/** @type {string | undefined} */ (undefined)
);
