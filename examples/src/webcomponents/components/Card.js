import '../../shared/card.css';

import { bem } from '@bem-broom/webcomponents';

// A block: re-roots the block context to `card` and reflects the `active`
// attribute as a modifier. No shadow DOM — the light-DOM children show through
// and the shared global CSS styles the host.
@bem({ element: 'card', modifiers: ['active'] })
class Card extends HTMLElement {}
customElements.define('bb-card', Card);
