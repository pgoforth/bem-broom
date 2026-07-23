import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BemController, bem, modifier } from '../index.js';

@customElement('bm-card')
@bem({ element: 'card' })
class BmCard extends LitElement {
	@modifier() accessor active = false;
	@modifier('count', (n) => n > 5 && 'many') accessor items = 0;
	render() {
		return html`<slot></slot>`;
	}
}

// `@modifier` stacked with Lit's `@property` for attribute-driven modifiers.
@customElement('bm-badge')
@bem({ element: 'badge' })
class BmBadge extends LitElement {
	@property() @modifier() accessor tone;
	render() {
		return html`<slot></slot>`;
	}
}

// `@modifier` on a host feeding `BemController` on an internal node.
@customElement('bm-title')
class BmTitle extends LitElement {
	#bem = new BemController(this, 'title');
	@modifier() accessor active = false;
	render() {
		return html`<h2 class=${this.#bem.className}></h2>`;
	}
}

const flush = (el) => el.updateComplete;
const hostClasses = (el) => [...el.classList].sort();
const nodeClasses = (el, sel) =>
	el.renderRoot.querySelector(sel).className.split(' ').filter(Boolean).sort();

describe('@modifier (lit)', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('applies and re-applies host modifiers on change', async () => {
		const el = document.createElement('bm-card');
		document.body.appendChild(el);
		await flush(el);
		expect(hostClasses(el)).toEqual(['card']);

		el.active = true;
		el.items = 8;
		await flush(el);
		expect(hostClasses(el)).toEqual(
			['card', 'card--active', 'card--count_many'].sort()
		);
	});

	it('works stacked with @property (attribute-driven)', async () => {
		document.body.innerHTML = '<bm-badge tone="info"></bm-badge>';
		const el = document.querySelector('bm-badge');
		await flush(el);
		expect(hostClasses(el)).toEqual(['badge', 'badge--tone_info'].sort());
	});

	it('feeds BemController on an internal render node', async () => {
		document.body.innerHTML = '<bm-title></bm-title>';
		const el = document.querySelector('bm-title');
		await flush(el);
		expect(nodeClasses(el, 'h2')).toEqual(['title']);

		el.active = true;
		await flush(el);
		expect(nodeClasses(el, 'h2')).toEqual(['title', 'title--active'].sort());
	});
});
