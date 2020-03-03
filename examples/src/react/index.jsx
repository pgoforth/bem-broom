import { BbApp } from './App.jsx';
import { BemConfigProvider } from "@bem-broom/react";
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('app')).render(
	<BemConfigProvider>
		<BbApp />
	</BemConfigProvider>
);
