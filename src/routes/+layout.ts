// Applies to every route in the app unless a route overrides it. Since the whole
// site is meant to be fully static (no runtime server on GitHub Pages), every page
// must be prerenderable at build time.
export const prerender = true;

// Makes the static adapter write `/foo/index.html` instead of `/foo.html`, which
// GitHub Pages resolves reliably without needing server-side redirects.
export const trailingSlash = 'always';
