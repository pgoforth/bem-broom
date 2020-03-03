import '../shared/tokens.css';
import '../shared/app.css';

import { Badge } from './components/Badge.js';
import { Card } from './components/Card.js';
import { Title } from './components/Title.js';
import { bem } from '@bem-broom/core';

// Core has no context or reactivity, so this demo does by hand what the
// react / lit / webcomponents helpers automate: it re-renders on toggle, threads
// the parent block down to each component, and themes the subtree by toggling
// the `app` block's `mode` modifier on the wrapper.
export function mountApp(root) {
	let mode = 'light';
	const app = document.createElement('div');
	root.replaceChildren(app);

	const render = () => {
		app.className = bem({
			block: 'app',
			modifiers: { block: { mode } },
		}).join(' ');

		const toggle = Badge({
			tone: 'info',
			clickable: true,
			children: [`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`],
		});
		toggle.addEventListener('click', () => {
			mode = mode === 'light' ? 'dark' : 'light';
			render();
		});

		// `card` is the block; its children re-root to it — passed explicitly.
		const card = Card({
			active: true,
			children: [
				Title({ block: 'card', variant: 'h2', children: ['Hello from Core'] }),
				Badge({ block: 'card', tone: 'success', children: ['New'] }),
			],
		});

		app.replaceChildren(toggle, document.createElement('hr'), card);
	};

	render();
}
