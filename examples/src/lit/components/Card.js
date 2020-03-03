import '../../shared/card.css';

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bem } from '@bem-broom/lit';

// A block: re-roots to `card` and reflects the reactive `active` property as a
// modifier. `@bem` applies the classes to the host, which the shared global CSS
// styles; the shadow `<slot>` just projects the light-DOM children.
@customElement('bb-card')
@bem({ element: 'card', modifiers: ['active'] })
class Card extends LitElement {
	@property({ type: Boolean }) accessor active = false;
	render() {
		return html`<slot></slot>`;
	}
}
