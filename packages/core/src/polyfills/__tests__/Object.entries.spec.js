import { objectEntries } from '../Object.entries';

describe('objectEntries (Object.entries polyfill)', () => {
	it('returns [key, value] pairs in insertion order', () => {
		expect(objectEntries({ a: 1, b: 2, c: 3 })).toEqual([
			['a', 1],
			['b', 2],
			['c', 3],
		]);
	});

	it('returns an empty array for an empty object', () => {
		expect(objectEntries({})).toEqual([]);
	});

	it('handles a single entry', () => {
		expect(objectEntries({ only: 'value' })).toEqual([['only', 'value']]);
	});

	it('preserves mixed value types (generic over the value type)', () => {
		const obj = {
			str: 'text',
			num: 42,
			bool: true,
			nil: null,
			undef: undefined,
			arr: [1, 2],
			nested: { deep: true },
		};

		expect(objectEntries(obj)).toEqual([
			['str', 'text'],
			['num', 42],
			['bool', true],
			['nil', null],
			['undef', undefined],
			['arr', [1, 2]],
			['nested', { deep: true }],
		]);
	});

	it('produces the same output as the native Object.entries', () => {
		const fixtures = [
			{},
			{ a: 1 },
			{ x: 'one', y: 'two', z: 'three' },
			{ block: 'nav', element: 'link', active: true, size: 'lg' },
		];

		fixtures.forEach((fixture) => {
			expect(objectEntries(fixture)).toEqual(Object.entries(fixture));
		});
	});

	it('includes only own enumerable keys (ignores inherited props)', () => {
		const parent = { inherited: 'nope' };
		const child = Object.create(parent);
		child.own = 'yes';

		expect(objectEntries(child)).toEqual([['own', 'yes']]);
	});

	it('ignores non-enumerable own properties', () => {
		const obj = { visible: 1 };
		Object.defineProperty(obj, 'hidden', {
			value: 2,
			enumerable: false,
		});

		expect(objectEntries(obj)).toEqual([['visible', 1]]);
	});

	it('orders integer-like keys ascending, matching Object.entries', () => {
		const obj = { 2: 'two', 1: 'one', b: 'bee', a: 'aye' };

		expect(objectEntries(obj)).toEqual(Object.entries(obj));
		expect(objectEntries(obj)).toEqual([
			['1', 'one'],
			['2', 'two'],
			['b', 'bee'],
			['a', 'aye'],
		]);
	});
});
