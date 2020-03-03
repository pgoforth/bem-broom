import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bem, BemController } from '../index.js';

@customElement('bb-card')
@bem({ element: 'card', modifiers: ['active', 'size'] })
class BbCard extends LitElement {
	@property({ type: Boolean }) accessor active = false;
	@property() accessor size = '';
	render() {
		return html`<slot></slot>`;
	}
}

@customElement('bb-title')
@bem({ element: 'title' })
class BbTitle extends LitElement {
	render() {
		return html`<slot></slot>`;
	}
}

// Low-level controller (useBem analog) applied to an internal render node.
@customElement('bb-status')
class BbStatus extends LitElement {
	#bem = new BemController(this, 'status', { modifiers: ['loading'] });
	@property({ type: Boolean }) accessor loading = false;
	render() {
		return html`<span class=${this.#bem.className}></span>`;
	}
}

const flush = async (el) => {
	await el.updateComplete;
};

describe('@bem decorator', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('applies the block class to the host at the root', async () => {
		const el = document.createElement('bb-card');
		document.body.appendChild(el);
		await flush(el);
		expect([...el.classList]).toEqual(['card']);
	});

	it('applies modifier classes from properties', async () => {
		const el = document.createElement('bb-card');
		el.active = true;
		el.size = 'lg';
		document.body.appendChild(el);
		await flush(el);
		expect([...el.classList].sort()).toEqual(
			['card', 'card--active', 'card--size_lg'].sort()
		);
	});

	it('re-roots the block for descendants', async () => {
		document.body.innerHTML = '<bb-card><bb-title></bb-title></bb-card>';
		const card = document.querySelector('bb-card');
		const title = document.querySelector('bb-title');
		await flush(card);
		await flush(title);
		expect([...title.classList].sort()).toEqual(
			['card__title', 'title'].sort()
		);
	});
});

describe('BemController', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('builds a class name on an internal node from the block context', async () => {
		document.body.innerHTML =
			'<bb-card><bb-status loading></bb-status></bb-card>';
		const card = document.querySelector('bb-card');
		const status = document.querySelector('bb-status');
		await flush(card);
		await flush(status);
		const span = status.renderRoot.querySelector('span');
		expect(span.className.split(' ').sort()).toEqual(
			['card__status', 'status', 'status--loading'].sort()
		);
	});
});
