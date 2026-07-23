import { bem, modifier } from '../index.js';

// Auto-accessors, one per argument form of `@modifier`.
@bem({ element: 'card' })
class Card extends HTMLElement {
	@modifier accessor active = false; // bare; name = "active"
	@modifier('loading') accessor isLoading = false; // explicit name
	@modifier((n) => n > 5 && 'many') accessor count = 0; // processor
	@modifier('bp', (list) => list) accessor breakpoints = []; // name + processor
}
customElements.define('bb-card', Card);

// A setter as a modifier (value captured on set).
@bem({ element: 'toggle' })
class Toggle extends HTMLElement {
	#on = false;
	@modifier() set on(value) {
		this.#on = value;
	}
	get on() {
		return this.#on;
	}
}
customElements.define('bb-toggle', Toggle);

// A field as a (static) modifier, plus a subclass that fixes its value —
// the motivating `SubmitButton extends Button` case.
@bem({ element: 'button' })
class Button extends HTMLElement {
	@modifier() type = 'button';
}
customElements.define('bb-button', Button);

class SubmitButton extends Button {
	type = 'submit';
}
customElements.define('bb-submit', SubmitButton);

// `@modifier` coexists with the attribute-driven config array.
@bem({ element: 'box', modifiers: ['size'] })
class Box extends HTMLElement {
	@modifier() accessor active = false;
}
customElements.define('bb-box', Box);

const classes = (el) => [...el.classList].sort();

describe('@modifier (web components)', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('applies each argument form and coerces values', () => {
		const el = document.createElement('bb-card');
		el.active = true;
		el.isLoading = true;
		el.count = 8;
		el.breakpoints = ['sm', 'md'];
		document.body.appendChild(el);
		expect(classes(el)).toEqual(
			[
				'card',
				'card--active',
				'card--loading',
				'card--count_many',
				'card--bp_sm',
				'card--bp_md',
			].sort()
		);
	});

	it('re-applies when an auto-accessor changes after connect', () => {
		const el = document.createElement('bb-card');
		document.body.appendChild(el);
		expect(classes(el)).toEqual(['card']);
		el.active = true;
		expect(classes(el)).toEqual(['card', 'card--active'].sort());
		el.active = false;
		expect(classes(el)).toEqual(['card']);
	});

	it('processor that returns false skips the modifier', () => {
		const el = document.createElement('bb-card');
		el.count = 2; // 2 > 5 → false → skipped
		document.body.appendChild(el);
		expect(classes(el)).toEqual(['card']);
	});

	it('supports a setter (value captured on set)', () => {
		const el = document.createElement('bb-toggle');
		document.body.appendChild(el);
		expect(classes(el)).toEqual(['toggle']);
		el.on = true;
		expect(classes(el)).toEqual(['toggle', 'toggle--on'].sort());
	});

	it('reads a field at apply time, including a subclass override', () => {
		const button = document.createElement('bb-button');
		document.body.appendChild(button);
		expect(classes(button)).toEqual(['button', 'button--type_button'].sort());

		const submit = document.createElement('bb-submit');
		document.body.appendChild(submit);
		expect(classes(submit)).toEqual(['button', 'button--type_submit'].sort());
	});

	it('coexists with the attribute-driven modifiers config', () => {
		const el = document.createElement('bb-box');
		el.setAttribute('size', 'lg');
		el.active = true;
		document.body.appendChild(el);
		expect(classes(el)).toEqual(['box', 'box--size_lg', 'box--active'].sort());
	});

	it('rejects non-member usage', () => {
		expect(() =>
			modifier()(function () {}, /** @type {any} */ ({ kind: 'class' }))
		).toThrow(TypeError);
	});
});
