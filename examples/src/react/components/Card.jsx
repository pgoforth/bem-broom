import '../../shared/card.css';

import { withBem } from '@bem-broom/react';

export const Card = withBem(
	({ className, children }) => <div className={className}>{children}</div>,
	{ element: 'card', modifiers: ['active'] }
);
