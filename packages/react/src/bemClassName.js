// @ts-check
import { bem } from '@bem-broom/core';

/**
 * Build a `className` string from a BEM object, powered by `@bem-broom/core`.
 * A context-free helper — for context-aware class names use {@link useBem} or
 * {@link withBem}.
 *
 * @param {Parameters<typeof bem>[0]} bemObject
 * @returns {string}
 */
export const bemClassName = (bemObject) => bem(bemObject).join(' ');
