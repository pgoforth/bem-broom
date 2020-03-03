import '../../shared/title.css';

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BemController } from '@bem-broom/lit';

// `BemController` (the useBem analog) turns the reactive `variant` property into
// a modifier (h1–h6); heading styling comes from the shared title.css. We apply
// the computed class to the host and reflect an accessible heading role/level,
// mirroring the react Title.
@customElement('bb-title')
class Title extends LitElement {
	@property() accessor variant = undefined;
	#bem = new BemController(this, 'title', { modifiers: ['variant'] });

	updated() {
		this.className = this.#bem.className;
		if (/^h[1-6]$/.test(this.variant)) {
			this.setAttribute('role', 'heading');
			this.setAttribute('aria-level', this.variant.replace(/[^0-9]/g, ''));
		} else {
			this.removeAttribute('role');
			this.removeAttribute('aria-level');
		}
	}

	render() {
		return html`<slot></slot>`;
	}
}
