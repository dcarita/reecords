<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<div class="error">
	<h1>{page.status}</h1>
	<p>{page.error?.message}</p>
	<a href={resolve('/')}>Go home</a>
</div>

<style>
	.error {
		display: grid;
		place-items: center;
		text-align: center;
		padding: 4rem 1rem;
	}
</style>
