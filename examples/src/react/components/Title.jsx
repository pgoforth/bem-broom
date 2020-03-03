import '../../shared/title.css';

import { useBem } from '@bem-broom/react';

export function Title({ children, variant }) {
	const className = useBem('title', { variant });
	const role = /^h[1-6]$/.test(variant) ? 'heading' : undefined;
	return <div
		role={role}
		aria-level={role === 'heading' ? parseInt(variant.replace(/[^0-9]/g, '')) : undefined}
		className={className}
	>
		{children}
	</div>;
}