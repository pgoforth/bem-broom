import '../../shared/badge.css';

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bem } from '@bem-broom/lit';

// A block on its own (the toggle) or an element when nested in a card. `tone`
// and `clickable` are reactive properties promoted to modifiers.
@customElement('bb-badge')
@bem({ element: 'badge', modifiers: ['tone', 'clickable'] })
class Badge extends LitElement {
	@property() accessor tone = '';
	@property({ type: Boolean }) accessor clickable = false;
	render() {
		return html`<slot></slot>`;
	}
}
