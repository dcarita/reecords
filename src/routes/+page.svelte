<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { POC_DATES } from '$lib/data/poc-dates';

	let dob = $state('');
	let unsupported = $state(false);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!POC_DATES.includes(dob)) {
			// Milestone 1 only has real data fetched for a small proof-of-concept
			// set of dates (see src/lib/data/poc-dates.ts) — a full 366-day/77-year
			// backfill is later work. Rather than navigate to a 404, say so here.
			unsupported = true;
			return;
		}

		unsupported = false;
		goto(resolve('/date/[date]', { date: dob }));
	}
</script>

<svelte:head>
	<title>reecords</title>
</svelte:head>

<main>
	<h1>reecords</h1>
	<p>Enter your date of birth to see music trends and trivia tied to that day.</p>

	<form onsubmit={handleSubmit}>
		<label for="dob">Date of birth</label>
		<input id="dob" type="date" bind:value={dob} required />
		<button type="submit">Show me</button>
	</form>

	{#if unsupported}
		<p class="unsupported">
			No data fetched for that date yet — this is an early proof of concept. Try
			<button type="button" onclick={() => (dob = POC_DATES[0])}>{POC_DATES[0]}</button> instead.
		</p>
	{/if}
</main>
