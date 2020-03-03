// @ts-check
import { hyphenated } from './syntax/hyphenated.js';
import { objectEntries } from './polyfills/Object.entries.js';

/**
 * @param {import('./types.js').BEMObject} bemObject
 */
export const bem = ({
	block,
	element,
	modifiers = {},
	prefix = '',
	syntax,
	verbose = false,
}) => {
	if (!block && !element) {
		throw new Error(
			'You must specify a block or an element when using BEM syntax'
		);
	}

	/** @type {string[]} */
	const classes = [];
	/** @type {import('./types.js').BEMSyntax} */
	const separators = {
		...hyphenated,
		...syntax,
	};
	const {
		block: blockSeparator,
		space: spaceSeparator,
		modifier: modifierSeparator,
		value: valueSeparator,
	} = separators;

	/*
	 *  There are instances where class prefix is imported from a SASS file.
	 *  In these cases, upon import, the single (or double) quotes remain.
	 *  We must remove them before use.
	 */
	const classPrefix = prefix
		? prefix.replace(/^['"]/, '').replace(/['"]$/, '')
		: '';

	if (block) {
		classes.push(
			!element
				? `${classPrefix}${block}`
				: `${classPrefix}${block}${blockSeparator}${element}`
		);

		const blockModifiers = modifiers.block
			? objectEntries(modifiers.block)
			: [];

		blockModifiers.forEach(([key, val]) => {
			const value = val && val !== '' ? val : false;
			const isBoolean = value === 'true' || value === !!value;
			if (isBoolean) {
				if (value) {
					const className = `${classPrefix}${block}${modifierSeparator}${key}`;
					classes.push(className);
					verbose &&
						element &&
						classes.push(`${className}${blockSeparator}${element}`);
				}
			} else {
				const className = `${classPrefix}${block}${modifierSeparator}${key}${valueSeparator}${value}`;
				classes.push(className);
				verbose &&
					element &&
					classes.push(`${className}${blockSeparator}${element}`);
			}
		});
	}
	if (element) {
		classes.push(`${classPrefix}${element}`);

		const elementModifiers = modifiers.element
			? objectEntries(modifiers.element)
			: [];

		elementModifiers.forEach(([key, val]) => {
			const value = val && val !== '' ? val : false;
			const isBoolean = value === 'true' || value === !!value;
			if (isBoolean) {
				if (value) {
					classes.push(`${classPrefix}${element}${modifierSeparator}${key}`);
					verbose &&
						block &&
						classes.push(
							`${classPrefix}${block}${blockSeparator}${element}${modifierSeparator}${key}`
						);
				}
			} else {
				classes.push(
					`${classPrefix}${element}${modifierSeparator}${key}${valueSeparator}${value}`
				);
				verbose &&
					block &&
					classes.push(
						`${classPrefix}${block}${blockSeparator}${element}${modifierSeparator}${key}${valueSeparator}${value}`
					);
			}
		});
	}

	return classes.map((className) =>
		className
			.toString()
			.replace(/\s\s+/g, ' ')
			.replace(/[\s!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, spaceSeparator)
	);
};
