import { monthDayKey, splitIsoDate } from '../dates';

// The small set of real dates fetched for the Milestone-1 proof of concept.
// Full backfill (all 366 day/month combos and every birth year) is a later
// milestone — see CLAUDE.md's Architecture section. Read by both the build-time
// fetch scripts (what to fetch) and the date/[date] route (entries() to prerender).
export const POC_DATES: string[] = [
	'1999-11-27',
	'1999-07-13',
	'1996-07-29',
	'1989-05-18',
	'1963-10-24'
];

// Derived, not maintained separately, so /day and /year always stay in sync
// with whatever POC_DATES actually has data for.
export const POC_MONTH_DAYS: { month: string; day: string }[] = [
	...new Set(POC_DATES.map(monthDayKey))
].map((key) => {
	const [month, day] = key.split('-');
	return { month, day };
});

export const POC_YEARS: number[] = [...new Set(POC_DATES.map((d) => splitIsoDate(d).year))];
