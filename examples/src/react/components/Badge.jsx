import '../../shared/badge.css';

import { withBem } from '@bem-broom/react';

export const Badge = withBem(
    ({ className, children, onClick }) => <div className={className} onClick={onClick}>{children}</div>,
    { element: 'badge', modifiers: ['tone', 'clickable'] }
);
