<script lang="ts">
	import { resolve } from '$app/paths';
	import { pad2, splitIsoDate } from '$lib/dates';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const topSong = $derived(data.chart.entries.find((e) => e.this_week === 1));
	const dayHref = $derived(
		resolve('/day/[month]/[day]', {
			month: pad2(data.onThisDay.month),
			day: pad2(data.onThisDay.day)
		})
	);
	const birthYear = $derived(splitIsoDate(data.date).year);
	const yearHref = $derived(resolve('/year/[year]', { year: String(birthYear) }));
</script>

<svelte:head>
	<title>Music trivia for {data.date} — reecords</title>
</svelte:head>

<main>
	<a class="back" href={resolve('/')}>&larr; Try another date</a>

	<h1>{data.date}</h1>

	{#if topSong}
		<section>
			<h2>#1 song that week</h2>
			<div class="song-row">
				{#if topSong.spotify?.albumArtUrl}
					<img class="album-art" src={topSong.spotify.albumArtUrl} alt="{topSong.song} album art" />
				{/if}
				<div>
					<p class="song">
						{#if topSong.spotify}
							<a href={topSong.spotify.spotifyUrl} target="_blank" rel="external noreferrer">
								<strong>{topSong.song}</strong>
							</a>
						{:else}
							<strong>{topSong.song}</strong>
						{/if}
						by {topSong.artist}
					</p>
					<p class="note">
						Billboard Hot 100 for the week of {data.chart.chartDate}
						{#if data.chart.chartDate !== data.date}
							(nearest chart to your exact date — Billboard publishes weekly, not daily){/if}
					</p>
				</div>
			</div>
			<a class="see-more" href={yearHref}>See {birthYear} in music &rarr;</a>
		</section>
	{/if}

	{#if data.onThisDay.musicians.length > 0}
		<section>
			<h2>Musicians born on {data.onThisDay.month}/{data.onThisDay.day}</h2>
			<ul>
				{#each data.onThisDay.musicians as musician (musician.wikidataId)}
					<li>{musician.name} <span class="year">({musician.birthYear})</span></li>
				{/each}
			</ul>
			<a class="see-more" href={dayHref}
				>See everyone born on {data.onThisDay.month}/{data.onThisDay.day} &rarr;</a
			>
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
		margin-bottom: var(--space-8);
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

	.song-row {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.album-art {
		width: 72px;
		height: 72px;
		border-radius: var(--radius-sm);
		flex-shrink: 0;
	}

	.song {
		font-size: 1.25rem;

		a {
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.note {
		margin-top: var(--space-2);
		color: var(--color-text-muted);
		font-size: 0.8125rem;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.year {
		color: var(--color-text-muted);
	}

	.see-more {
		display: inline-block;
		margin-top: var(--space-4);
		font-size: 0.875rem;
		text-decoration: none;

		&:hover {
			color: var(--color-accent-hover);
		}
	}
</style>
