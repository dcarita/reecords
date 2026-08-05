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
