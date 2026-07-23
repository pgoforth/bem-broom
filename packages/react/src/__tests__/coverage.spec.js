import { render, renderHook } from '@testing-library/react';
import { useBem } from '../useBem';
import { withBem } from '../withBem';
import * as reactApi from '../index';

describe('react coverage', () => {
	it('skips array modifier items whose toString throws', () => {
		const boom = {
			toString() {
				throw new Error('nope');
			},
		};
		const { result } = renderHook(() => useBem('chip', { tags: [boom, 'ok'] }));
		expect(result.current.split(' ').sort()).toEqual(
			['chip', 'chip--tags_ok'].sort()
		);
	});

	it('withBem merges an incoming className and tolerates absent modifier props', () => {
		const Widget = withBem(
			({ className }) => <span data-testid="w" className={className} />,
			{ element: 'widget', modifiers: ['active'] }
		);
		// `active` is not passed (name-in-props false) and a className is supplied.
		const { getByTestId } = render(<Widget className="extra" />);
		expect(getByTestId('w').className).toBe('widget extra');
	});

	it('exposes its public API', () => {
		for (const key of [
			'BemConfigProvider',
			'bemClassName',
			'useBem',
			'withBem',
		]) {
			expect(reactApi[key]).toBeDefined();
		}
	});
});
