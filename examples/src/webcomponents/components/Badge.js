import '../../shared/badge.css';

import { bem } from '@bem-broom/webcomponents';

// A block on its own (the toggle) or an element when nested in a card. `tone`
// and `clickable` are observed attributes promoted to modifiers.
@bem({ element: 'badge', modifiers: ['tone', 'clickable'] })
class Badge extends HTMLElement {}
customElements.define('bb-badge', Badge);
