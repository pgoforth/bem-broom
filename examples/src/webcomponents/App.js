import '../shared/tokens.css';
import '../shared/app.css';
import './components/Badge.js';
import './components/Card.js';
import './components/Title.js';

import { bem } from '@bem-broom/core';

// The root wrapper is an `app` block whose `mode` modifier themes the whole
// subtree via the shared CSS (`.app--mode_dark .card`, …). It must NOT re-root
// (card/badge stay their own blocks), so instead of the re-rooting `@bem` we
// compute its class directly with core's `bem()` and toggle it in place — the
// only thing that changes on toggle.
export class BbApp extends HTMLElement {
	#mode = 'light';

	connectedCallback() {
		this.#render();
	}

	#label() {
		return `Switch to ${this.#mode === 'light' ? 'Dark' : 'Light'} Mode`;
	}

	#applyMode() {
		this.className = bem({
			block: 'app',
			modifiers: { block: { mode: this.#mode } },
		}).join(' ');
	}

	#render() {
		this.#applyMode();
		this.innerHTML = `
			<bb-badge tone="info" clickable data-toggle>${this.#label()}</bb-badge>
			<hr />
			<bb-card active>
				<bb-title variant="h2">Hello from Web Components</bb-title>
				<bb-badge tone="success">New</bb-badge>
			</bb-card>
		`;
		this.querySelector('[data-toggle]').addEventListener('click', () =>
			this.#toggle()
		);
	}

	#toggle() {
		this.#mode = this.#mode === 'light' ? 'dark' : 'light';
		this.#applyMode();
		this.querySelector('[data-toggle]').textContent = this.#label();
	}
}
customElements.define('bb-app', BbApp);
