/**
 * @typedef BEMSyntax
 * @property {string} block The block/element separator
 * @property {string} modifier The separator between block/element and modifier
 * @property {string} space The separator used to replace spaces
 * @property {string} value The separator between modifier and its value
 */
/**
 * @typedef {Record<string, boolean | string>} BEMModifiers A map of modifier
 * name to value: `true` for a boolean modifier (rendered as `block--name`) or a
 * string for a value modifier (rendered as `block--name_value`). A `false` value
 * omits the modifier.
 */
/**
 * @typedef BEMObject
 * @property {string} block The block name
 * @property {string} [element] The element name
 * @property {{ block?: BEMModifiers, element?: BEMModifiers }} [modifiers] The modifiers for block and element
 * @property {string} [prefix] The prefix to be added at the beginning of every class name
 * @property {BEMSyntax} [syntax] The syntax to be used for generating class names
 * @property {boolean} [verbose] Whether to generate verbose class names (i.e., including block and element names in modifier classes)
 */
