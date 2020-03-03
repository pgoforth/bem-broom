import '../../shared/title.css';

import { bem } from '@bem-broom/webcomponents';

// `@bem` turns the `variant` attribute into a modifier (h1–h6), and the heading
// styling comes from the shared title.css. We also reflect an accessible
// heading role/level, mirroring the react Title.
@bem({ element: 'title', modifiers: ['variant'] })
class Title extends HTMLElement {
	connectedCallback() {
		this.reflectHeading();
	}
	attributeChangedCallback() {
		this.reflectHeading();
	}
	reflectHeading() {
		const variant = this.getAttribute('variant');
		if (variant && /^h[1-6]$/.test(variant)) {
			this.setAttribute('role', 'heading');
			this.setAttribute('aria-level', variant.replace(/[^0-9]/g, ''));
		} else {
			this.removeAttribute('role');
			this.removeAttribute('aria-level');
		}
	}
}
customElements.define('bb-title', Title);
