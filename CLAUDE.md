# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

reecords is a web app that gives users info about music trends and other trivia tied to their date of birth.

## Stack

- SvelteKit (Svelte 5, runes), TypeScript, pnpm, SCSS
- `@sveltejs/adapter-static` — the whole site is prerendered to static HTML/JS and deployed to GitHub Pages (project page at `/reecords`) via GitHub Actions. There is no runtime server.
- Note: this project's SvelteKit version consolidates config into `vite.config.ts` (inside the `sveltekit({...})` plugin options) rather than a separate `svelte.config.js` — `paths`, `adapter`, etc. all live there.

## Commands

- `pnpm dev` — dev server
- `pnpm build` — production build to `build/` (must succeed with every route prerenderable — `adapter-static` is configured with `strict: true`)
- `pnpm preview` — serve the production build locally
- `pnpm check` — svelte-check (types)
- `pnpm lint` / `pnpm format` — prettier + eslint

## Architecture

DOB input → per-date trivia, sourced from free APIs and fetched **at build time only** (never in the browser, since GitHub Pages has no server to hide secrets): Wikidata (musicians born on a given day) and a Billboard historical chart mirror (#1 song), optionally enriched with Spotify metadata (album art/link) via the Client Credentials flow. Fetched data is cached as committed JSON under `src/lib/data/`, and routes are prerendered per-date using SvelteKit's `entries()` API. See `scripts/` for the fetch pipeline.
