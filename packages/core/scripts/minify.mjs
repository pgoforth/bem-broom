// Post-build step: minify each emitted dist file in place with Terser.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { minify } from 'terser';

const DIST = 'dist';

const targets = readdirSync(DIST, { recursive: true })
	.map((entry) => `${DIST}/${entry}`)
	.filter((file) => file.endsWith('.cjs') || file.endsWith('.mjs'));

let originalBytes = 0;
let minifiedBytes = 0;

for (const file of targets) {
	const code = readFileSync(file, 'utf8');

	const result = await minify(code, {
		// `.mjs` is an ES module; let Terser mangle top-level bindings safely.
		module: file.endsWith('.mjs'),
		compress: true,
		mangle: true,
	});

	originalBytes += Buffer.byteLength(code);
	minifiedBytes += Buffer.byteLength(result.code);

	writeFileSync(file, result.code);
}

const saved = originalBytes
	? Math.round((1 - minifiedBytes / originalBytes) * 100)
	: 0;
process.stdout.write(
	`Minified ${targets.length} files: ${originalBytes} -> ${minifiedBytes} bytes (${saved}% smaller)\n`
);
