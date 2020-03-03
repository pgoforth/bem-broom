import { render } from '@testing-library/react';
import { withBem } from '../withBem';

describe('withBem', () => {
	it('injects a BEM className and re-roots the block for children', () => {
		const Title = withBem(
			({ className }) => <span data-testid="title" className={className} />,
			{ element: 'title' }
		);
		const Card = withBem(
			({ className, children }) => (
				<div data-testid="card" className={className}>
					{children}
				</div>
			),
			{ element: 'card', modifiers: ['active'] }
		);

		const { getByTestId } = render(
			<Card active>
				<Title />
			</Card>
		);

		expect(getByTestId('card').className).toBe('card card--active');
		expect(getByTestId('title').className).toBe('card__title title');
	});

	it('forwards modifier props to the wrapped component by default', () => {
		let received;
		const Box = withBem(
			(props) => {
				received = props;
				return <div />;
			},
			{ element: 'box', modifiers: ['active'] }
		);

		render(<Box active id="z" />);

		expect(received.active).toBe(true);
		expect(received.id).toBe('z');
		expect(received.className).toBe('box box--active');
	});

	it('strips modifier props when stripModifierProps is set', () => {
		let received;
		const Box = withBem(
			(props) => {
				received = props;
				return <div />;
			},
			{ element: 'box', modifiers: ['active'], stripModifierProps: true }
		);

		render(<Box active id="z" />);

		expect(received.active).toBeUndefined();
		expect(received.id).toBe('z');
		expect(received.className).toBe('box box--active');
	});

	it('passes array modifiers and block:false through config', () => {
		const Chip = withBem(
			({ className }) => <span data-testid="chip" className={className} />,
			{ element: 'chip', modifiers: ['variant'], block: false }
		);
		const Card = withBem(
			({ className, children }) => <div className={className}>{children}</div>,
			{ element: 'card' }
		);

		const { getByTestId } = render(
			<Card>
				<Chip variant={['primary', 'ghost']} />
			</Card>
		);

		expect(getByTestId('chip').className).toBe(
			'chip chip--variant_primary chip--variant_ghost'
		);
	});
});
