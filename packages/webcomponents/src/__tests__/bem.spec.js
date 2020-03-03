import { bem, BemElement } from '../index.js';

// A decorated bare custom element — no Lit, no build-time base class.
@bem({ element: 'card', modifiers: ['active', 'size'] })
class BbCard extends HTMLElement {}
customElements.define('bb-card', BbCard);

@bem({ element: 'title' })
class BbTitle extends HTMLElement {}
customElements.define('bb-title', BbTitle);

// The decorator-free mixin form (for no-build ESM projects).
class BbLabel extends BemElement(HTMLElement, {
	element: 'label',
	modifiers: ['active'],
}) {}
customElements.define('bb-label', BbLabel);

describe('@bem decorator (bare HTMLElement)', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('produces a plain custom element with no reactive-controller host', () => {
		const el = document.createElement('bb-card');
		expect(el instanceof HTMLElement).toBe(true);
		// The whole point of this package: it works without Lit's host API.
		expect('addController' in el).toBe(false);
	});

	it('applies the block class to the host at the root', () => {
		const el = document.createElement('bb-card');
		document.body.appendChild(el);
		expect([...el.classList]).toEqual(['card']);
	});

	it('applies modifier classes from attributes', () => {
		const el = document.createElement('bb-card');
		el.setAttribute('active', '');
		el.setAttribute('size', 'lg');
		document.body.appendChild(el);
		expect([...el.classList].sort()).toEqual(
			['card', 'card--active', 'card--size_lg'].sort()
		);
	});

	it('recomputes when an observed attribute changes after connect', () => {
		const el = document.createElement('bb-card');
		document.body.appendChild(el);
		expect([...el.classList]).toEqual(['card']);
		el.setAttribute('active', '');
		expect([...el.classList].sort()).toEqual(['card', 'card--active'].sort());
		el.removeAttribute('active');
		expect([...el.classList]).toEqual(['card']);
	});

	it('re-roots the block for descendants', () => {
		document.body.innerHTML = '<bb-card><bb-title></bb-title></bb-card>';
		const title = document.querySelector('bb-title');
		expect([...title.classList].sort()).toEqual(
			['card__title', 'title'].sort()
		);
	});

	it('re-subscribes after disconnect and reconnect', () => {
		document.body.innerHTML = '<bb-card><bb-title></bb-title></bb-card>';
		const card = document.querySelector('bb-card');
		const title = document.querySelector('bb-title');
		card.removeChild(title);
		document.body.appendChild(title);
		// Detached from the card, it resolves as its own root block.
		expect([...title.classList]).toEqual(['title']);
		card.appendChild(title);
		// Reconnected under the card, it re-roots again.
		expect([...title.classList].sort()).toEqual(
			['card__title', 'title'].sort()
		);
	});
});

describe('BemElement mixin (decorator-free)', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('re-roots and applies attribute modifiers under a decorated ancestor', () => {
		document.body.innerHTML = '<bb-card><bb-label active></bb-label></bb-card>';
		const label = document.querySelector('bb-label');
		expect([...label.classList].sort()).toEqual(
			['card__label', 'label', 'label--active'].sort()
		);
	});
});

describe('bem() guard', () => {
	it('throws when applied to a non-class', () => {
		const decorate = bem({ element: 'x' });
		expect(() =>
			decorate(function () {}, /** @type {any} */ ({ kind: 'method' }))
		).toThrow(TypeError);
	});
});
