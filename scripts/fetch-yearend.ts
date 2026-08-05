import path from 'node:path';
import { POC_YEARS } from '../src/lib/data/poc-dates.ts';
import { writeJson } from './lib/io.ts';
import { withRetry } from './lib/retry.ts';
import { fetchYearEndSongs } from './lib/wikipedia-yearend.ts';

const OUT_DIR = path.join(process.cwd(), 'src/lib/data/yearend');

async function main() {
	for (const year of POC_YEARS) {
		console.log(`Fetching Year-End Hot 100 for ${year}...`);
		const songs = await withRetry(() => fetchYearEndSongs(year));
		await writeJson(path.join(OUT_DIR, `${year}.json`), { year, songs });
		console.log(`  -> #1: "${songs[0]?.title}" by ${songs[0]?.artist} (${songs.length} songs)`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
