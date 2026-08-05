import { error } from '@sveltejs/kit';
import { POC_MONTH_DAYS } from '$lib/data/poc-dates';
import type { OnThisDayData } from '$lib/data/types';
import type { EntryGenerator, PageLoad } from './$types';

const onThisDayModules = import.meta.glob<OnThisDayData>('/src/lib/data/onthisday/*.json', {
	eager: true,
	import: 'default'
});

export const entries: EntryGenerator = () => POC_MONTH_DAYS;

export const load: PageLoad = ({ params }) => {
	const onThisDay = onThisDayModules[`/src/lib/data/onthisday/${params.month}-${params.day}.json`];

	if (!onThisDay) {
		error(404, `No data fetched yet for ${params.month}/${params.day}`);
	}

	return { month: params.month, day: params.day, onThisDay };
};
