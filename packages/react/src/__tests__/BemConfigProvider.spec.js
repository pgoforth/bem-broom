import { renderHook } from '@testing-library/react';
import { BemConfigProvider } from '../config';
import { BemBlockContext } from '../context';
import { useBem } from '../useBem';

describe('BemConfigProvider', () => {
	it('provides prefix to useBem via context', () => {
		const { result } = renderHook(() => useBem('title'), {
			wrapper: ({ children }) => (
				<BemConfigProvider prefix="app-">
					<BemBlockContext.Provider value="card">
						{children}
					</BemBlockContext.Provider>
				</BemConfigProvider>
			),
		});
		expect(result.current).toBe('app-card__title app-title');
	});

	it('lets a nested BemConfigProvider override inherited values', () => {
		const { result } = renderHook(() => useBem('title'), {
			wrapper: ({ children }) => (
				<BemConfigProvider prefix="app-">
					<BemConfigProvider prefix="x-">
						<BemBlockContext.Provider value="card">
							{children}
						</BemBlockContext.Provider>
					</BemConfigProvider>
				</BemConfigProvider>
			),
		});
		expect(result.current).toBe('x-card__title x-title');
	});

	it('forwards verbose to core', () => {
		const { result } = renderHook(() => useBem('title', { active: true }), {
			wrapper: ({ children }) => (
				<BemConfigProvider verbose>
					<BemBlockContext.Provider value="card">
						{children}
					</BemBlockContext.Provider>
				</BemConfigProvider>
			),
		});
		expect(result.current).toBe(
			'card__title title title--active card__title--active'
		);
	});
});
