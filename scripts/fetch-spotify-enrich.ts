import path from 'node:path';
import type { Chart } from '../src/lib/data/types.ts';
import { POC_DATES } from '../src/lib/data/poc-dates.ts';
import { readJsonIfExists, writeJson } from './lib/io.ts';
import { withRetry } from './lib/retry.ts';
import { getSpotifyToken } from './lib/spotify-auth.ts';
import { searchTrack } from './lib/spotify.ts';

const CHARTS_DIR = path.join(process.cwd(), 'src/lib/data/charts');

async function main() {
	// Authenticate once up front: a missing/invalid credential is a config
	// problem, not a transient failure, so it should fail immediately rather
	// than burn through withRetry's backoff on every date in the loop.
	await getSpotifyToken();

	for (const isoDate of POC_DATES) {
		const filePath = path.join(CHARTS_DIR, `${isoDate}.json`);
		const chart = await readJsonIfExists<Chart>(filePath);

		if (!chart) {
			console.warn(`No chart data for ${isoDate} yet — run \`pnpm fetch:billboard\` first.`);
			continue;
		}

		// Only the #1 song, not all 100 entries — keeps this to one Spotify call
		// per date rather than a hundred, and it's the only track actually shown
		// on the results page today.
		const topSong = chart.entries.find((e) => e.this_week === 1);
		if (!topSong) continue;

		console.log(`Enriching "${topSong.song}" by ${topSong.artist}...`);
		const spotify = await withRetry(() => searchTrack(topSong.song, topSong.artist));

		if (!spotify) {
			console.warn('  no Spotify match found');
			continue;
		}

		topSong.spotify = spotify;
		await writeJson(filePath, chart);
		console.log(`  -> ${spotify.spotifyUrl}`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
