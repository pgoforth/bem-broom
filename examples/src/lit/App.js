import '../shared/tokens.css';
import '../shared/app.css';
import './components/Badge.js';
import './components/Card.js';
import './components/Title.js';

import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BemController } from '@bem-broom/lit';

// The root wrapper is an `app` block whose `mode` modifier themes the whole
// subtree via the shared CSS. `BemController` (the useBem analog) computes the
// class without re-rooting, so card/badge stay their own blocks; we apply it to
// the host, which — in light DOM — the shared global CSS can style.
@customElement('bb-app')
export class BbApp extends LitElement {
	@state() accessor mode = 'light';
	#bem = new BemController(this, 'app', { modifiers: ['mode'] });

	createRenderRoot() {
		return this;
	}

	updated() {
		this.className = this.#bem.className;
	}

	#toggle() {
		this.mode = this.mode === 'light' ? 'dark' : 'light';
	}

	render() {
		const label = `Switch to ${this.mode === 'light' ? 'Dark' : 'Light'} Mode`;
		return html`
			<bb-badge tone="info" clickable @click=${this.#toggle}>${label}</bb-badge>
			<hr />
			<bb-card active>
				<bb-title variant="h2">Hello from Lit</bb-title>
				<bb-badge tone="success">New</bb-badge>
			</bb-card>
		`;
	}
}
