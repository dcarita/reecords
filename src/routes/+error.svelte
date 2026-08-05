<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<div class="error">
	<h1>{page.status}</h1>
	<p>{page.error?.message}</p>
	<a href={resolve('/')}>Go home</a>
</div>

<style lang="scss">
	.error {
		display: grid;
		place-items: center;
		gap: var(--space-3);
		text-align: center;
		min-height: 60vh;
		padding: var(--space-8) var(--space-4);
	}

	h1 {
		font-size: 3rem;
		color: var(--color-accent);
	}

	p {
		color: var(--color-text-muted);
	}
</style>
