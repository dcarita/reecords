import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// GitHub Pages serves this repo at /reecords/ (a project page, not a <user>.github.io
// user page), so every build must prefix asset/route URLs with that base path. Locally,
// `vite dev` and `vite preview` should keep the base empty so links still work at
// http://localhost:5173/ without the prefix.
const dev = process.argv.includes('dev');

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({ fallback: undefined, strict: true }),
			paths: {
				base: dev ? '' : '/reecords'
			}
		})
	]
});
