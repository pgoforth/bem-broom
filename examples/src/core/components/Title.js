import '../../shared/title.css';

import { bem } from '@bem-broom/core';

// An element of whichever `block` it's rendered inside → e.g. `card__title`.
// `variant` (h1–h6) becomes a modifier that drives the heading styling in the
// shared title.css; we also set an accessible heading role/level. A neutral
// <div> (not an <h2>) keeps it visually identical to the custom-element demos.
export function Title({ block, variant, children }) {
	const el = document.createElement('div');
	el.className = bem({
		block,
		element: 'title',
		modifiers: { element: { variant } },
	}).join(' ');
	if (/^h[1-6]$/.test(variant)) {
		el.setAttribute('role', 'heading');
		el.setAttribute('aria-level', variant.replace(/[^0-9]/g, ''));
	}
	el.append(...children);
	return el;
}
