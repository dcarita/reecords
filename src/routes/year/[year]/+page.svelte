<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const topSong = $derived(data.yearEnd.songs.find((s) => s.rank === 1));
	const topTen = $derived(data.yearEnd.songs.filter((s) => s.rank > 1 && s.rank <= 10));
</script>

<svelte:head>
	<title>{data.yearEnd.year} in music — reecords</title>
</svelte:head>

<main>
	<a class="back" href={resolve('/')}>&larr; Try another date</a>

	<h1>{data.yearEnd.year}</h1>
	<p class="tagline">Billboard's Year-End Hot 100 — the songs that defined the year.</p>

	{#if topSong}
		<section>
			<h2>#1 song of {data.yearEnd.year}</h2>
			<p class="song"><strong>{topSong.title}</strong> by {topSong.artist}</p>
		</section>
	{/if}

	{#if topTen.length > 0}
		<section>
			<h2>Rest of the top 10</h2>
			<ol>
				{#each topTen as song (song.rank)}
					<li><span class="rank">{song.rank}.</span> {song.title} — {song.artist}</li>
				{/each}
			</ol>
			<p class="note">{data.yearEnd.songs.length} songs total on the full Year-End chart.</p>
		</section>
	{/if}
</main>

<style lang="scss">
	main {
		max-width: var(--content-width);
		margin-inline: auto;
		padding: var(--space-12) var(--space-4);
	}

	.back {
		display: inline-block;
		margin-bottom: var(--space-6);
		color: var(--color-text-muted);
		font-size: 0.875rem;
		text-decoration: none;

		&:hover {
			color: var(--color-accent);
		}
	}

	h1 {
		font-size: 2rem;
	}

	.tagline {
		color: var(--color-text-muted);
		margin: var(--space-2) 0 var(--space-8);
	}

	section {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		margin-bottom: var(--space-4);
	}

	h2 {
		font-size: 1.125rem;
		color: var(--color-accent);
		margin-bottom: var(--space-4);
	}

	.song {
		font-size: 1.25rem;
	}

	ol {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		list-style: none;
	}

	.rank {
		color: var(--color-text-muted);
		display: inline-block;
		width: 1.5rem;
	}

	.note {
		margin-top: var(--space-4);
		color: var(--color-text-muted);
		font-size: 0.8125rem;
	}
</style>
