import { classic } from '../syntax/classic';
import { unbem } from '../unbem';

describe('unbem', () => {
	describe('block', () => {
		it('should return correct bem objects for block', () => {
			expect(unbem('fake-block')).toEqual([
				{
					block: 'fake-block',
				},
			]);
		});

		it('should output correct bem objects for prefixed block', () => {
			expect(
				unbem('fake-prefix-fake-block', {
					prefix: 'fake-prefix-',
				})
			).toEqual([
				{
					block: 'fake-block',
				},
			]);
		});

		it('should output correct bem objects for when no block provided', () => {
			expect(unbem('__fake-element')).toEqual([]);
		});

		it('should output correct bem objects for when no block provided with prefix', () => {
			expect(
				unbem('fake-prefix-__fake-element', {
					prefix: 'fake-prefix-',
				})
			).toEqual([]);
		});

		it('should output correct bem objects for boolean block modifiers', () => {
			expect(unbem('fake-block--boolean-modifier')).toEqual([
				{
					block: 'fake-block',
					modifiers: {
						block: {
							'boolean-modifier': true,
						},
					},
				},
			]);
		});

		it('should output correct bem objects for value block modifiers', () => {
			expect(unbem('fake-block--value-modifier_fake-value')).toEqual([
				{
					block: 'fake-block',
					modifiers: {
						block: {
							'value-modifier': 'fake-value',
						},
					},
				},
			]);
		});
	});

	describe('element', () => {
		it('should output correct bem objects for element', () => {
			expect(unbem('fake-block__fake-element')).toEqual([
				{
					block: 'fake-block',
					element: 'fake-element',
				},
			]);
		});

		it('should output correct bem objects for prefixed element', () => {
			expect(
				unbem('fake-prefix-fake-block__fake-element', {
					prefix: 'fake-prefix-',
				})
			).toEqual([
				{
					block: 'fake-block',
					element: 'fake-element',
				},
			]);
		});

		it('should output correct bem objects for boolean element modifiers', () => {
			expect(unbem('fake-block__fake-element--boolean-modifier')).toEqual([
				{
					block: 'fake-block',
					element: 'fake-element',
					modifiers: {
						element: {
							'boolean-modifier': true,
						},
					},
				},
			]);
		});

		it('should output correct bem objects for value element modifiers', () => {
			expect(
				unbem('fake-block__fake-element--value-modifier_fake-value')
			).toEqual([
				{
					block: 'fake-block',
					element: 'fake-element',
					modifiers: {
						element: {
							'value-modifier': 'fake-value',
						},
					},
				},
			]);
		});
	});

	describe('block + element', () => {
		it('should output correct bem objects for block + element', () => {
			expect(unbem('fake-block__fake-element')).toEqual([
				{
					block: 'fake-block',
					element: 'fake-element',
				},
			]);
		});

		it('should output correct bem objects for prefixed block + element', () => {
			expect(
				unbem('fake-prefix-fake-block__fake-element', {
					prefix: 'fake-prefix-',
				})
			).toEqual([
				{
					block: 'fake-block',
					element: 'fake-element',
				},
			]);
		});

		it('should output correct bem objects for boolean block + element modifiers', () => {
			expect(
				unbem([
					'fake-block--boolean-block-modifier',
					'fake-block__fake-element--boolean-element-modifier',
				])
			).toEqual([
				{
					block: 'fake-block',
					element: 'fake-element',
					modifiers: {
						block: {
							'boolean-block-modifier': true,
						},
						element: {
							'boolean-element-modifier': true,
						},
					},
				},
			]);
		});

		it('should output correct bem objects for value block + element modifiers', () => {
			expect(
				unbem([
					'fake-block--value-block-modifier_fake-block-value',
					'fake-block__fake-element--value-element-modifier_fake-element-value',
				])
			).toEqual([
				{
					block: 'fake-block',
					element: 'fake-element',
					modifiers: {
						block: {
							'value-block-modifier': 'fake-block-value',
						},
						element: {
							'value-element-modifier': 'fake-element-value',
						},
					},
				},
			]);
		});

		it('should output correct bem objects for value and bool block + element modifiers', () => {
			expect(
				unbem([
					'fake-block__fake-element',
					'fake-block--bool-block-modifier',
					'fake-block--bool-block-modifier-2',
					'fake-block--value-block-modifier_fake-block-value',
					'fake-block--value-block-modifier-2_fake-block-value-2',
					'fake-block--bool-block-modifier__fake-element',
					'fake-block--bool-block-modifier-2__fake-element',
					'fake-block--value-block-modifier_fake-block-value__fake-element',
					'fake-block--value-block-modifier-2_fake-block-value-2__fake-element',
					'fake-element',
					'fake-element--bool-element-modifier',
					'fake-element--bool-element-modifier-2',
					'fake-element--value-element-modifier_fake-element-value',
					'fake-element--value-element-modifier-2_fake-element-value-2',
					'fake-block__fake-element--bool-element-modifier',
					'fake-block__fake-element--bool-element-modifier-2',
					'fake-block__fake-element--value-element-modifier_fake-element-value',
					'fake-block__fake-element--value-element-modifier-2_fake-element-value-2',
				])
			).toEqual([
				{
					block: 'fake-block',
					element: 'fake-element',
					modifiers: {
						block: {
							'bool-block-modifier': true,
							'bool-block-modifier-2': true,
							'value-block-modifier': 'fake-block-value',
							'value-block-modifier-2': 'fake-block-value-2',
						},
						element: {
							'bool-element-modifier': true,
							'bool-element-modifier-2': true,
							'value-element-modifier': 'fake-element-value',
							'value-element-modifier-2': 'fake-element-value-2',
						},
					},
				},
			]);
		});

		it('should output correct bem objects for value and bool block + element modifiers with minimal classnames', () => {
			expect(
				unbem([
					'fake-block--bool-block-modifier',
					'fake-block--bool-block-modifier-2',
					'fake-block--value-block-modifier_fake-block-value',
					'fake-block--value-block-modifier-2_fake-block-value-2__fake-element',
					'fake-element--bool-element-modifier',
					'fake-element--bool-element-modifier-2',
					'fake-element--value-element-modifier_fake-element-value',
					'fake-element--value-element-modifier-2_fake-element-value-2',
				])
			).toEqual([
				{
					block: 'fake-block',
					element: 'fake-element',
					modifiers: {
						block: {
							'bool-block-modifier': true,
							'bool-block-modifier-2': true,
							'value-block-modifier': 'fake-block-value',
							'value-block-modifier-2': 'fake-block-value-2',
						},
						element: {
							'bool-element-modifier': true,
							'bool-element-modifier-2': true,
							'value-element-modifier': 'fake-element-value',
							'value-element-modifier-2': 'fake-element-value-2',
						},
					},
				},
			]);
		});

		it('should output correct bem objects for block + element without modifiers', () => {
			expect(
				unbem([
					'fake-block',
					'fake-block2',
					'fake-block__fake-element',
					'fake-element',
					'fake-element2',
				])
			).toEqual([
				{
					block: 'fake-block',
					element: 'fake-element',
				},
				{
					block: 'fake-block2',
				},
				{
					block: 'fake-element2',
				},
			]);
		});
	});

	it('should throw an error if no string or array classnames are passed', () => {
		expect(() => unbem({})).toThrow();
	});

	it('should output correct bem objects for when no block or element provided', () => {
		expect(unbem('__')).toEqual([]);
	});

	describe('syntax', () => {
		it('should output correct bem objects for classic bem syntax', () => {
			expect(
				unbem('fakeBlock__fakeElement_valueElementModifier_fakeElementValue', {
					syntax: classic,
				})
			).toEqual([
				{
					block: 'fakeBlock',
					element: 'fakeElement',
					modifiers: {
						element: {
							valueElementModifier: 'fakeElementValue',
						},
					},
				},
			]);
		});
	});

	// The merge is order-independent: classes are sorted links-first, so the same
	// set of classes always yields the same objects regardless of input order.
	describe('merge', () => {
		it('merges bem() round-trip standalone forms back into one object', () => {
			expect(
				unbem(['card__title', 'title', 'card__title--active', 'title--active'])
			).toEqual([
				{
					block: 'card',
					element: 'title',
					modifiers: { element: { active: true } },
				},
			]);
		});

		it('is independent of class order', () => {
			const classes = [
				'card__title',
				'card--dark',
				'title--active',
				'card__title--big',
			];
			const forward = unbem(classes);
			const reversed = unbem([...classes].reverse());
			expect(reversed).toEqual(forward);
			expect(forward).toEqual([
				{
					block: 'card',
					element: 'title',
					modifiers: {
						block: { dark: true },
						element: { active: true, big: true },
					},
				},
			]);
		});

		it('resolves each block__element link independently', () => {
			expect(unbem(['a__b', 'b', 'b__c', 'c'])).toEqual([
				{ block: 'a', element: 'b' },
				{ block: 'b', element: 'c' },
			]);
		});

		it('collapses a block with multiple elements into one object', () => {
			// The data model holds a single element per block, so multiple
			// elements of the same block merge into one object (last link wins).
			expect(
				unbem(['card__title', 'card__body', 'card--dark', 'title', 'body'])
			).toEqual([
				{
					block: 'card',
					element: 'title',
					modifiers: { block: { dark: true } },
				},
			]);
		});
	});

	// Names are a BEM word pattern (alphanumerics joined by the `space`
	// separator), so class names that can't be unambiguously parsed are rejected
	// (skipped) rather than partially guessed — matching @bem/sdk.naming.
	describe('rejects malformed class names', () => {
		it.each([
			['double element separator', 'a__b__c'],
			['trailing separator', 'a__'],
			['leading separator', '__a'],
			['non-word character', 'card__title.foo'],
		])('skips a class with a %s', (_label, className) => {
			expect(unbem(className)).toEqual([]);
		});
	});
});
