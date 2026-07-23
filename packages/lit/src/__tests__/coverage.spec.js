import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BemController, bem } from '../index.js';
import * as litApi from '../index.js';

// BemController with an explicit block (string) and as a root (`false`).
@customElement('cov-ovr')
class Ovr extends LitElement {
	#withBlock = new BemController(this, 'title', { block: 'card' });
	#asRoot = new BemController(this, 'title', { block: false });
	render() {
		return html`<i class=${this.#withBlock.className}></i
			><b class=${this.#asRoot.className}></b>`;
	}
}

// @bem with an explicit block (string) and as a root (`false`).
@customElement('cov-t1')
@bem({ element: 'title', block: 'card' })
class CovT1 extends LitElement {
	render() {
		return html`<slot></slot>`;
	}
}

@customElement('cov-t2')
@bem({ element: 'title', block: false })
class CovT2 extends LitElement {
	render() {
		return html`<slot></slot>`;
	}
}

const nodeClasses = (el, sel) =>
	el.renderRoot.querySelector(sel).className.split(' ').filter(Boolean).sort();

describe('lit coverage', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('bem() throws on a non-class target', () => {
		expect(() =>
			bem({ element: 'x' })(() => {}, /** @type {any} */ ({ kind: 'method' }))
		).toThrow(TypeError);
	});

	it('BemController block override: string sets it, false roots it', async () => {
		document.body.innerHTML = '<cov-ovr></cov-ovr>';
		const el = document.querySelector('cov-ovr');
		await el.updateComplete;
		expect(nodeClasses(el, 'i')).toEqual(['card__title', 'title'].sort());
		expect(nodeClasses(el, 'b')).toEqual(['title']);
	});

	it('@bem config.block override: string sets it, false roots it', async () => {
		document.body.innerHTML = '<cov-t1></cov-t1><cov-t2></cov-t2>';
		const t1 = document.querySelector('cov-t1');
		const t2 = document.querySelector('cov-t2');
		await t1.updateComplete;
		await t2.updateComplete;
		expect([...t1.classList].sort()).toEqual(['card__title', 'title'].sort());
		expect([...t2.classList]).toEqual(['title']);
	});

	it('exposes its public API', () => {
		for (const key of [
			'bem',
			'BemController',
			'bemBlockContext',
			'bemConfigContext',
			'modifier',
		]) {
			expect(litApi[key]).toBeDefined();
		}
	});
});
