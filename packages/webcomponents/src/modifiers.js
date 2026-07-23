// @ts-check

// Per-instance registries for `@modifier`-declared members. Keyed by symbols
// from the global registry (like the contexts) so a `@modifier` and a bem
// controller from different copies of these packages still interoperate.
const MODIFIERS = Symbol.for('bem-broom.modifiers');
const APPLY = Symbol.for('bem-broom.apply');
const SETTER_VALUES = Symbol.for('bem-broom.setterValues');

/**
 * A `@modifier`-declared member, captured at class-definition time.
 * @typedef {object} ModifierDescriptor
 * @property {string} modifierName The BEM modifier name.
 * @property {((value: any) => any) | undefined} processor Optional value mapper.
 * @property {(host: any) => any} read Reads the member's current value off an instance.
 */

/**
 * True when `x` is a decorator context — used to detect bare `@modifier` usage
 * (`@modifier accessor x`) versus the factory form (`@modifier('name')`).
 * @param {any} x
 * @returns {boolean}
 */
function isContext(x) {
	return (
		x != null &&
		typeof x === 'object' &&
		typeof x.kind === 'string' &&
		typeof x.addInitializer === 'function'
	);
}

/**
 * @param {any} host
 * @param {ModifierDescriptor} descriptor
 */
function register(host, descriptor) {
	// eslint-disable-next-line security/detect-object-injection -- symbol key
	(host[MODIFIERS] ??= []).push(descriptor);
}

/**
 * Invoke every re-apply callback a bem controller registered on the host.
 * @param {any} host
 */
function triggerBemApply(host) {
	// eslint-disable-next-line security/detect-object-injection -- symbol key
	const callbacks = host[APPLY];
	if (callbacks) {
		for (const callback of callbacks) {
			callback();
		}
	}
}

/**
 * @param {any} host
 * @param {string | symbol} key
 * @returns {any}
 */
function getSetterValue(host, key) {
	// eslint-disable-next-line security/detect-object-injection -- symbol key
	const store = host[SETTER_VALUES];
	return store ? store.get(key) : undefined;
}

/**
 * @param {any} host
 * @param {string | symbol} key
 * @param {any} value
 */
function setSetterValue(host, key, value) {
	// eslint-disable-next-line security/detect-object-injection -- symbol key
	(host[SETTER_VALUES] ??= new Map()).set(key, value);
}

/**
 * Register a callback that `@modifier` setters call to re-apply BEM classes;
 * the bem controller supplies it (web components re-diff `classList`, Lit
 * requests an update). Low-level glue used by `@bem-broom/webcomponents` and
 * `@bem-broom/lit`; not needed in application code.
 * @param {any} host
 * @param {() => void} callback
 */
export function registerBemApply(host, callback) {
	// eslint-disable-next-line security/detect-object-injection -- symbol key
	(host[APPLY] ??= []).push(callback);
}

/**
 * Collect `{ modifierName: value }` for every `@modifier` member on the host,
 * applying each processor. A bem controller merges this into the modifier
 * values it feeds to `@bem-broom/core`'s `bem()`. Low-level glue.
 * @param {any} host
 * @returns {Record<string, unknown>}
 */
export function collectDecoratedModifiers(host) {
	// eslint-disable-next-line security/detect-object-injection -- symbol key
	const registered = host[MODIFIERS];
	/** @type {Record<string, unknown>} */
	const values = {};
	if (registered) {
		for (const descriptor of registered) {
			const raw = descriptor.read(host);
			values[descriptor.modifierName] = descriptor.processor
				? descriptor.processor(raw)
				: raw;
		}
	}
	return values;
}

/**
 * @param {any} value
 * @param {any} context
 * @param {{ name?: string, processor?: (value: any) => any }} opts
 * @returns {any}
 */
function decorate(value, context, opts) {
	const { kind } = context;
	if (kind !== 'accessor' && kind !== 'field' && kind !== 'setter') {
		throw new TypeError(
			'`modifier` can only decorate an auto-accessor, a setter, or a class field.'
		);
	}
	if (context.static || context.private) {
		throw new TypeError(
			'`modifier` can only decorate public instance members.'
		);
	}
	const modifierName = opts.name ?? String(context.name);
	const { processor } = opts;

	if (kind === 'accessor') {
		/** @param {any} instance */
		const read = (instance) => value.get.call(instance);
		context.addInitializer(
			/** @this {any} */ function () {
				register(this, { modifierName, processor, read });
			}
		);
		return {
			/**
			 * @this {any}
			 * @param {any} next
			 */
			set(next) {
				value.set.call(this, next);
				triggerBemApply(this);
			},
		};
	}

	if (kind === 'setter') {
		const key = context.name;
		/** @param {any} instance */
		const read = (instance) => getSetterValue(instance, key);
		context.addInitializer(
			/** @this {any} */ function () {
				register(this, { modifierName, processor, read });
			}
		);
		/**
		 * @this {any}
		 * @param {any} next
		 */
		const wrappedSetter = function (next) {
			value.call(this, next);
			setSetterValue(this, key, next);
			triggerBemApply(this);
		};
		return wrappedSetter;
	}

	// Field: a plain data property can't intercept assignment, so its value is
	// read at apply time and changes after render don't re-apply on their own.
	/** @param {any} instance */
	const read = (instance) => context.access.get(instance);
	context.addInitializer(
		/** @this {any} */ function () {
			register(this, { modifierName, processor, read });
		}
	);
	return undefined;
}

/**
 * Declare an auto-accessor, setter, or class field as a BEM **modifier**, so
 * its value is applied to the component's BEM class(es) by `@bem` /
 * `BemController`. Its value goes through the same coercion as everywhere else
 * (`true` → `--name`, an array → one class per item, `false`/`null`/`undefined`
 * → skipped, otherwise → `--name_value`).
 *
 * Forms (all arguments optional):
 * - `@modifier` / `@modifier()` — modifier name = the member name.
 * - `@modifier(processor)` — name = member name; the modifier value is
 *   `processor(currentValue)`.
 * - `@modifier(name)` — an explicit modifier name.
 * - `@modifier(name, processor)` — explicit name plus a processor.
 *
 * The `processor` maps the member's value to the BEM value
 * (`string | boolean | string[]`), e.g. `@modifier((n) => n > 5 && 'many')`.
 *
 * Auto-accessors and setters re-apply on change; a plain **field** is read once
 * at apply time (static) — use it for values fixed per (sub)class. Does **not**
 * imply Lit's `@property`; add it explicitly for attribute-driven modifiers.
 *
 * @param {any} [arg1] A processor, an explicit modifier name, or (bare use) the decorated value.
 * @param {any} [arg2] A processor when `arg1` is a name, or (bare use) the decorator context.
 * @returns {any}
 */
export function modifier(arg1, arg2) {
	if (isContext(arg2)) {
		return decorate(arg1, arg2, {});
	}
	/** @type {{ name?: string, processor?: (value: any) => any }} */
	const opts = {};
	if (typeof arg1 === 'function') {
		opts.processor = arg1;
	} else if (typeof arg1 === 'string') {
		opts.name = arg1;
		if (typeof arg2 === 'function') {
			opts.processor = arg2;
		}
	}
	return /** @param {any} value @param {any} context */ (value, context) =>
		decorate(value, context, opts);
}
