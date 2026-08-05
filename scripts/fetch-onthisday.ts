import path from 'node:path';
import { POC_DATES } from '../src/lib/data/poc-dates.ts';
import { monthDayKey, splitIsoDate } from '../src/lib/dates.ts';
import { writeJson } from './lib/io.ts';
import { withRetry } from './lib/retry.ts';
import { fetchMusiciansBornOn } from './lib/wikidata.ts';
import { fetchMusicEventsOn } from './lib/wikipedia.ts';

const OUT_DIR = path.join(process.cwd(), 'src/lib/data/onthisday');

async function main() {
	// Only the (month, day) pairs implied by POC_DATES — not a full 366-day backfill.
	const keys = new Map(POC_DATES.map((iso) => [monthDayKey(iso), splitIsoDate(iso)]));

	for (const [key, { month, day }] of keys) {
		console.log(`Fetching on-this-day data for ${key}...`);

		const [musicians, events] = await Promise.all([
			withRetry(() => fetchMusiciansBornOn(month, day)),
			withRetry(() => fetchMusicEventsOn(month, day))
		]);

		await writeJson(path.join(OUT_DIR, `${key}.json`), { month, day, musicians, events });
		console.log(`  -> ${musicians.length} musicians, ${events.length} events`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
