import { nearestChartDate } from '../../src/lib/dates.ts';
import type { Chart, ChartEntry } from '../../src/lib/data/types.ts';

const REPO_RAW = 'https://raw.githubusercontent.com/mhollingshead/billboard-hot-100/main';

let validDatesCache: string[] | null = null;

async function getValidDates(): Promise<string[]> {
	if (validDatesCache) return validDatesCache;
	const res = await fetch(`${REPO_RAW}/valid_dates.json`);
	if (!res.ok) throw new Error(`Failed to fetch valid_dates.json: ${res.status}`);
	validDatesCache = (await res.json()) as string[];
	return validDatesCache;
}

/**
 * Billboard charts only exist for specific weekly dates (back to 1958-08-04), so
 * this finds the chart nearest the requested date and fetches it.
 */
export async function fetchChartNear(isoDate: string): Promise<Chart> {
	const validDates = await getValidDates();
	const chartDate = nearestChartDate(isoDate, validDates);

	const res = await fetch(`${REPO_RAW}/date/${chartDate}.json`);
	if (!res.ok) throw new Error(`Failed to fetch chart for ${chartDate}: ${res.status}`);
	const body = await res.json();

	return { requestedDate: isoDate, chartDate, entries: body.data as ChartEntry[] };
}
