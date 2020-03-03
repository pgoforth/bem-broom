import '../../shared/card.css';

import { bem } from '@bem-broom/core';

// A block. Core doesn't re-root automatically, so the caller builds the
// children with `block: 'card'` and passes them in.
export function Card({ active, children }) {
	const el = document.createElement('div');
	el.className = bem({
		block: 'card',
		modifiers: { block: { active } },
	}).join(' ');
	el.append(...children);
	return el;
}
