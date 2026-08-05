<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Born on {data.month}/{data.day} — reecords</title>
</svelte:head>

<main>
	<a class="back" href={resolve('/')}>&larr; Try another date</a>

	<h1>{data.month}/{data.day}</h1>
	<p class="tagline">Every year, not just yours — musicians who share your birth day.</p>

	{#if data.onThisDay.musicians.length > 0}
		<section>
			<h2>Musicians born on {data.onThisDay.month}/{data.onThisDay.day}</h2>
			<ul>
				{#each data.onThisDay.musicians as musician (musician.wikidataId)}
					<li>{musician.name} <span class="year">({musician.birthYear})</span></li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if data.onThisDay.events.length > 0}
		<section>
			<h2>On this day in music history</h2>
			<ul>
				{#each data.onThisDay.events as event (event.year + event.text)}
					<li><span class="year">{event.year}:</span> {event.text}</li>
				{/each}
			</ul>
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

	ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.year {
		color: var(--color-text-muted);
	}
</style>
