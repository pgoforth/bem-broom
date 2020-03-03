import { bem as _bem } from './bem.js';
import { unbem as _unbem } from './unbem.js';

export { classic as SYNTAX_CLASSIC } from './syntax/classic.js';
export { hyphenated as SYNTAX_HYPHENATED } from './syntax/hyphenated.js';

export const bem = _bem;
export const unbem = _unbem;

/**
 * @class BemModel
 */
export class BemModel {
	/**
	 * @param {string} className
	 */
	static parse(className) {
		const bems = _unbem(className);
		return bems.map((bemObject) => new BemModel(bemObject));
	}

	#cssText = '';
	get cssText() {
		return this.#cssText;
	}
	#invalid = true;
	get invalid() {
		return this.#invalid;
	}

	/** @type {import('./types.js').BEMObject['block']} */
	#block;
	get block() {
		return this.#block;
	}
	set block(value) {
		this.#block = `${value}`;
		this.invalidate();
	}

	/** @type {import('./types.js').BEMObject['element']} */
	#element;
	get element() {
		return this.#element;
	}
	set element(value) {
		this.#element = value;
		this.invalidate();
	}

	/** @type {string} */
	#prefix = '';
	get prefix() {
		return this.#prefix;
	}
	set prefix(value) {
		this.#prefix = value || '';
		this.invalidate();
	}

	/** @type {import('./types.js').BEMObject['verbose']} */
	#verbose = false;
	get verbose() {
		return this.#verbose;
	}
	set verbose(value) {
		this.#verbose = !!value;
		this.invalidate();
	}
	/** @type {import('./types.js').BEMModifiers} */
	#blockModifiers = {};
	/** @type {import('./types.js').BEMModifiers} */
	#elementModifiers = {};
	get modifiers() {
		return {
			block: { ...this.#blockModifiers },
			element: { ...this.#elementModifiers },
		};
	}

	/**
	 *  Creates an instance of BemBroom.
	 * @param {import('./types.js').BEMObject} [bemObject={}]
	 */
	constructor(bemObject = { block: '' }) {
		this.#block = bemObject.block || bemObject.element || '';
		this.#element = (bemObject.block && bemObject.element) || undefined;
		this.#verbose = !!bemObject.verbose;
		if (bemObject.modifiers) {
			if (bemObject.modifiers.element) {
				if (this.#element) {
					this.#elementModifiers = { ...bemObject.modifiers.element };
				} else {
					this.#blockModifiers = { ...bemObject.modifiers.element };
				}
			}
			if (bemObject.modifiers.block) {
				this.#blockModifiers = { ...bemObject.modifiers.block };
			}
		}
		this.#prefix = bemObject.prefix || '';
		this.validate();
	}

	get classList() {
		try {
			return _bem(this);
		} catch (e) {
			return [];
		}
	}

	/**
	 * @param {string} name The block modifier name
	 * @param {string|boolean} [value] The modifier value. If omitted, the modifier will be removed.
	 */
	setBlockModifier(name, value) {
		if (value === undefined) {
			// eslint-disable-next-line security/detect-object-injection -- `name` keys a private plain-object modifier map, not a security sink
			delete this.#blockModifiers[name];
		} else {
			// eslint-disable-next-line security/detect-object-injection -- `name` keys a private plain-object modifier map, not a security sink
			this.#blockModifiers[name] = !!value ? value : true;
		}
		this.invalidate();
	}

	/**
	 * @param {string} name The element modifier name
	 * @param {string|boolean} [value] The modifier value. If omitted, the modifier will be removed.
	 */
	setElementModifier(name, value) {
		if (!this.element) {
			throw new Error(
				'Cannot set element modifier when no element is defined.'
			);
		}
		if (value === undefined) {
			// eslint-disable-next-line security/detect-object-injection -- `name` keys a private plain-object modifier map, not a security sink
			delete this.#elementModifiers[name];
		} else {
			// eslint-disable-next-line security/detect-object-injection -- `name` keys a private plain-object modifier map, not a security sink
			this.#elementModifiers[name] = !!value ? value : true;
		}
		this.invalidate();
	}

	invalidate() {
		this.#invalid = true;
	}

	validate() {
		if (this.#invalid) {
			this.#cssText = `.${this.classList.join(' .')}`;
			this.#invalid = false;
		}
	}

	toString() {
		this.validate();
		return this.#cssText;
	}
}
