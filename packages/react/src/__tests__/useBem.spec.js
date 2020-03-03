import { renderHook } from '@testing-library/react';
import { BemBlockContext } from '../context';
import { useBem } from '../useBem';

const withBlock =
	(block) =>
	({ children }) => (
		<BemBlockContext.Provider value={block}>
			{children}
		</BemBlockContext.Provider>
	);

describe('useBem', () => {
	it('uses the element as the block at the root', () => {
		const { result } = renderHook(() => useBem('card', { active: true }));
		expect(result.current).toBe('card card--active');
	});

	it('composes block__element from the block context', () => {
		const { result } = renderHook(() => useBem('title'), {
			wrapper: withBlock('card'),
		});
		expect(result.current).toBe('card__title title');
	});

	it('applies each modifier entry the caller provides', () => {
		const { result } = renderHook(
			() => useBem('title', { active: true, size: 'lg' }),
			{ wrapper: withBlock('card') }
		);
		expect(result.current).toBe(
			'card__title title title--active title--size_lg'
		);
	});

	it('block: false makes the element its own block, ignoring context', () => {
		const { result } = renderHook(
			() => useBem('title', { active: true }, { block: false }),
			{ wrapper: withBlock('card') }
		);
		expect(result.current).toBe('title title--active');
	});

	it('uses an explicit block string instead of the context block', () => {
		const { result } = renderHook(
			() => useBem('title', {}, { block: 'panel' }),
			{ wrapper: withBlock('card') }
		);
		expect(result.current).toBe('panel__title title');
	});

	it('expands array modifier values into multiple value modifiers', () => {
		const { result } = renderHook(
			() => useBem('title', { variant: ['primary', 'large'] }),
			{ wrapper: withBlock('card') }
		);
		expect(result.current).toBe(
			'card__title title title--variant_primary title--variant_large'
		);
	});

	it('coerces non-string modifier values with toString', () => {
		const { result } = renderHook(() => useBem('title', { count: 3 }), {
			wrapper: withBlock('card'),
		});
		expect(result.current).toBe('card__title title title--count_3');
	});

	it('skips false / null / undefined modifier values', () => {
		const { result } = renderHook(
			() => useBem('title', { a: false, b: null, c: undefined, d: true }),
			{ wrapper: withBlock('card') }
		);
		expect(result.current).toBe('card__title title title--d');
	});

	it('silently drops a modifier whose toString throws', () => {
		const bad = {
			toString() {
				throw new Error('nope');
			},
		};
		const { result } = renderHook(() => useBem('title', { bad }), {
			wrapper: withBlock('card'),
		});
		expect(result.current).toBe('card__title title');
	});
});
