import { error } from '@sveltejs/kit';
import { POC_YEARS } from '$lib/data/poc-dates';
import type { YearEndData } from '$lib/data/types';
import type { EntryGenerator, PageLoad } from './$types';

const yearEndModules = import.meta.glob<YearEndData>('/src/lib/data/yearend/*.json', {
	eager: true,
	import: 'default'
});

export const entries: EntryGenerator = () => POC_YEARS.map((year) => ({ year: String(year) }));

export const load: PageLoad = ({ params }) => {
	const yearEnd = yearEndModules[`/src/lib/data/yearend/${params.year}.json`];

	if (!yearEnd) {
		error(404, `No data fetched yet for ${params.year}`);
	}

	return { yearEnd };
};
