<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const topSong = $derived(data.chart.entries.find((e) => e.this_week === 1));
</script>

<svelte:head>
	<title>Music trivia for {data.date} — reecords</title>
</svelte:head>

<main>
	<h1>{data.date}</h1>

	{#if topSong}
		<section>
			<h2>#1 song that week</h2>
			<p class="song">
				<strong>{topSong.song}</strong> by {topSong.artist}
			</p>
			<p class="note">
				Billboard Hot 100 for the week of {data.chart.chartDate}
				{#if data.chart.chartDate !== data.date}
					(nearest chart to your exact date — Billboard publishes weekly, not daily){/if}
			</p>
		</section>
	{/if}

	{#if data.onThisDay.musicians.length > 0}
		<section>
			<h2>Musicians born on {data.onThisDay.month}/{data.onThisDay.day}</h2>
			<ul>
				{#each data.onThisDay.musicians as musician (musician.wikidataId)}
					<li>{musician.name} ({musician.birthYear})</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if data.onThisDay.events.length > 0}
		<section>
			<h2>On this day in music history</h2>
			<ul>
				{#each data.onThisDay.events as event (event.year + event.text)}
					<li><strong>{event.year}:</strong> {event.text}</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>
