import { bemClassName } from '../index';

describe('bemClassName', () => {
	it('joins @bem-broom/core output into a className string', () => {
		expect(
			bemClassName({
				block: 'card',
				element: 'title',
				modifiers: { block: { active: true } },
			})
		).toBe('card__title card--active title');
	});

	it('handles a bare block', () => {
		expect(bemClassName({ block: 'button' })).toBe('button');
	});
});
