import { error } from '@sveltejs/kit';
import { POC_DATES } from '$lib/data/poc-dates';
import type { Chart, OnThisDayData } from '$lib/data/types';
import { monthDayKey } from '$lib/dates';
import type { EntryGenerator, PageLoad } from './$types';

// import.meta.glob is Vite's way of turning a set of matching files into a
// lookup map at build time. `eager: true` inlines them directly (rather than
// each becoming its own lazy-loaded chunk) and `import: 'default'` unwraps the
// JSON module down to the parsed object instead of `{ default: {...} }`.
const onThisDayModules = import.meta.glob<OnThisDayData>('/src/lib/data/onthisday/*.json', {
	eager: true,
	import: 'default'
});
const chartModules = import.meta.glob<Chart>('/src/lib/data/charts/*.json', {
	eager: true,
	import: 'default'
});

// Tells SvelteKit's static adapter which values of the [date] param actually
// have data to prerender. Only the POC set for now, not a full backfill.
export const entries: EntryGenerator = () => POC_DATES.map((date) => ({ date }));

export const load: PageLoad = ({ params }) => {
	const onThisDay = onThisDayModules[`/src/lib/data/onthisday/${monthDayKey(params.date)}.json`];
	const chart = chartModules[`/src/lib/data/charts/${params.date}.json`];

	if (!onThisDay || !chart) {
		error(404, `No data fetched yet for ${params.date}`);
	}

	return { date: params.date, onThisDay, chart };
};
