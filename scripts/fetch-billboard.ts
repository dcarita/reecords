import path from 'node:path';
import { POC_DATES } from './config.ts';
import { fetchChartNear } from './lib/billboard.ts';
import { writeJson } from './lib/io.ts';
import { withRetry } from './lib/retry.ts';

const OUT_DIR = path.join(process.cwd(), 'src/lib/data/charts');

async function main() {
	for (const isoDate of POC_DATES) {
		console.log(`Fetching Billboard chart near ${isoDate}...`);
		const chart = await withRetry(() => fetchChartNear(isoDate));
		await writeJson(path.join(OUT_DIR, `${isoDate}.json`), chart);
		console.log(
			`  -> chart date ${chart.chartDate}, #1: "${chart.entries[0]?.song}" by ${chart.entries[0]?.artist}`
		);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
