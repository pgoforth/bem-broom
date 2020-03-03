import '../../shared/badge.css';

import { bem } from '@bem-broom/core';

// When `block` is given the badge is an element of that block (`card__badge`);
// otherwise it's its own block — the standalone toggle.
export function Badge({ block, tone, clickable, children }) {
	const el = document.createElement('div');
	const classes = block
		? bem({ block, element: 'badge', modifiers: { element: { tone } } })
		: bem({ block: 'badge', modifiers: { block: { tone, clickable } } });
	el.className = classes.join(' ');
	el.append(...children);
	return el;
}
