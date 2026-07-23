import { bem, bemBlockContext, consumeContext, modifier } from '../index.js';
import * as wcApi from '../index.js';
import { ContextProvider } from '@lit/context';

// config.block override: an explicit string, and `false` (root).
@bem({ element: 'title', block: 'card' })
class CovT1 extends HTMLElement {}
customElements.define('cov-t1', CovT1);

@bem({ element: 'title', block: false })
class CovT2 extends HTMLElement {}
customElements.define('cov-t2', CovT2);

// Processors whose output can't be stringified are skipped — a scalar (skipped
// entirely) and an array (the bad item skipped, the good one kept).
const boom = {
	toString() {
		throw new Error('nope');
	},
};

@bem({ element: 'chip' })
class CovChip extends HTMLElement {
	@modifier('bad', () => boom) accessor x = 1;
	@modifier('list', () => [boom, 'ok']) accessor y = 1;
}
customElements.define('cov-chip', CovChip);

// A `@modifier` on an element with no bem controller: setting it is a no-op.
class CovPlain extends HTMLElement {
	@modifier accessor flag = false;
}
customElements.define('cov-plain', CovPlain);

// Re-parenting: a subscriber bound to an ancestor provider is handed to a
// nearer provider that upgrades later.
@bem({ element: 'card' })
class RpCard extends HTMLElement {}
customElements.define('rp-card', RpCard);

@bem({ element: 'label' })
class RpLabel extends HTMLElement {}
customElements.define('rp-label', RpLabel);

const ctx = (over) => ({
	kind: 'accessor',
	addInitializer() {},
	access: { get() {} },
	...over,
});

describe('webcomponents coverage', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('config.block override: string sets it, false roots it', () => {
		const t1 = document.createElement('cov-t1');
		document.body.appendChild(t1);
		expect([...t1.classList].sort()).toEqual(['card__title', 'title'].sort());

		const t2 = document.createElement('cov-t2');
		document.body.appendChild(t2);
		expect([...t2.classList]).toEqual(['title']);
	});

	it('skips modifier values whose toString throws (scalar and array item)', () => {
		const el = document.createElement('cov-chip');
		document.body.appendChild(el);
		expect([...el.classList].sort()).toEqual(['chip', 'chip--list_ok'].sort());
	});

	it('no-ops a @modifier change on an element without a bem controller', () => {
		const el = document.createElement('cov-plain');
		document.body.appendChild(el);
		el.flag = true;
		expect([...el.classList]).toEqual([]);
	});

	it('re-parents a subscriber when a nearer provider is defined later', () => {
		document.body.innerHTML =
			'<rp-card><rp-title><rp-label></rp-label></rp-title></rp-card>';
		const label = document.querySelector('rp-label');
		// rp-title isn't defined yet → label resolves its block to the card.
		expect([...label.classList].sort()).toEqual(
			['card__label', 'label'].sort()
		);

		@bem({ element: 'title' })
		class RpTitle extends HTMLElement {}
		customElements.define('rp-title', RpTitle);

		// rp-title upgraded, announced itself, and the card re-parented label.
		expect([...label.classList].sort()).toEqual(
			['title__label', 'label'].sort()
		);
	});

	it('consumeContext works without an onChange callback', () => {
		const root = document.createElement('div');
		document.body.appendChild(root);
		const provider = new ContextProvider(root, {
			context: bemBlockContext,
			initialValue: 'x',
		});
		provider.hostConnected();
		const child = document.createElement('span');
		root.appendChild(child);

		const consumer = consumeContext(child, bemBlockContext); // no onChange
		consumer.request();
		expect(consumer.value).toBe('x');
	});

	it('modifier rejects static and private members', () => {
		expect(() =>
			modifier()({ get() {}, set() {} }, ctx({ static: true }))
		).toThrow(TypeError);
		expect(() =>
			modifier()({ get() {}, set() {} }, ctx({ private: true }))
		).toThrow(TypeError);
	});

	it('exposes its public API', () => {
		for (const key of [
			'bem',
			'BemElement',
			'modifier',
			'bemBlockContext',
			'bemConfigContext',
			'buildClassName',
			'consumeContext',
			'collectDecoratedModifiers',
			'registerBemApply',
		]) {
			expect(wcApi[key]).toBeDefined();
		}
	});
});
