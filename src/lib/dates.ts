// Pure date helpers with no Node/browser-specific dependencies, so they can be
// imported both by the build-time fetch scripts (Node, via tsx) and by SvelteKit
// route code (browser/prerender).

export function pad2(n: number): string {
	return String(n).padStart(2, '0');
}

export interface DateParts {
	year: number;
	month: number;
	day: number;
}

export function splitIsoDate(iso: string): DateParts {
	const [year, month, day] = iso.split('-').map(Number);
	return { year, month, day };
}

/** MM-DD key used for src/lib/data/onthisday/*.json filenames. */
export function monthDayKey(iso: string): string {
	const { month, day } = splitIsoDate(iso);
	return `${pad2(month)}-${pad2(day)}`;
}

/**
 * Billboard charts are published weekly, not daily, so a given DOB rarely has an
 * exact chart. Picks the valid chart date closest to the target.
 */
export function nearestChartDate(target: string, validDates: string[]): string {
	const targetTime = new Date(target).getTime();
	let best = validDates[0];
	let bestDiff = Infinity;
	for (const candidate of validDates) {
		const diff = Math.abs(new Date(candidate).getTime() - targetTime);
		if (diff < bestDiff) {
			bestDiff = diff;
			best = candidate;
		}
	}
	return best;
}
