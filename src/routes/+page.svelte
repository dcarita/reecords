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
	<div class="vinyl" aria-hidden="true"></div>

	<h1>reecords</h1>
	<p class="tagline">Enter your date of birth to see music trends and trivia tied to that day.</p>

	<form onsubmit={handleSubmit}>
		<label for="dob">Date of birth</label>
		<div class="row">
			<input id="dob" type="date" bind:value={dob} required />
			<button type="submit">Show me</button>
		</div>
	</form>

	{#if unsupported}
		<p class="unsupported">
			No data fetched for that date yet — this is an early proof of concept. Try
			<button type="button" onclick={() => (dob = POC_DATES[0])}>{POC_DATES[0]}</button> instead.
		</p>
	{/if}
</main>

<style lang="scss">
	main {
		max-width: var(--content-width);
		margin-inline: auto;
		padding: var(--space-12) var(--space-4);
		text-align: center;
	}

	.vinyl {
		width: 96px;
		height: 96px;
		margin: 0 auto var(--space-6);
		border-radius: 50%;
		background:
			radial-gradient(circle at center, var(--color-bg) 0 6px, transparent 7px),
			repeating-radial-gradient(circle at center, var(--color-surface-raised) 0 3px, #000 3px 6px);
		box-shadow: 0 0 0 2px var(--color-border);
	}

	h1 {
		font-size: 2.5rem;
		letter-spacing: 0.02em;
	}

	.tagline {
		color: var(--color-text-muted);
		margin-top: var(--space-3);
	}

	form {
		margin-top: var(--space-8);
	}

	label {
		display: block;
		margin-bottom: var(--space-2);
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	.row {
		display: flex;
		gap: var(--space-2);
		justify-content: center;
		flex-wrap: wrap;
	}

	input[type='date'] {
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-pill);
		font-size: 1rem;
	}

	button[type='submit'] {
		padding: var(--space-3) var(--space-6);
		border-radius: var(--radius-pill);
	}

	.unsupported {
		margin-top: var(--space-6);
		color: var(--color-text-muted);
		font-size: 0.875rem;

		button {
			display: inline;
			padding: 0 var(--space-1);
			border: none;
			background: none;
			text-decoration: underline;
			font-weight: inherit;

			&:hover {
				background: none;
				color: var(--color-accent-hover);
			}
		}
	}
</style>
