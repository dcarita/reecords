import type { YearEndSong } from '../../src/lib/data/types.ts';

const USER_AGENT =
	'reecords-app-dev/0.1 (https://github.com/dcarita/reecords; build-time data fetch)';

interface ParseResponse {
	parse?: { wikitext: { '*': string } };
	error?: { info: string };
}

/** Strips MediaWiki markup down to plain display text. */
function cleanWikitext(text: string): string {
	return text
		.replace(/\[\[[^\]|]*\|([^\]]+)\]\]/g, '$1') // [[Target|Display]] -> Display
		.replace(/\[\[([^\]]+)\]\]/g, '$1') // [[Display]] -> Display
		.replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '') // <ref>...</ref>
		.replace(/<ref[^>]*\/>/g, '') // self-closing <ref/>
		.replace(/'{2,}/g, '') // ''italic''/'''bold'''
		.trim();
}

/**
 * Parses the year-end singles wikitable — a plain `{| class="wikitable" ... |}`
 * with rows shaped `|rank || "[[Title]]" || [[Artist]]`. Verified against 1963,
 * 1989, 1996, and 1999 during development; minor formatting varies (spacing,
 * header glyph) but the row shape is consistent enough for this simple parser.
 *
 * One real wrinkle: when the same artist has consecutive-rank entries, the
 * artist cell uses `rowspan="N"|Artist` and is omitted from the following
 * row(s) entirely (2-cell rows) — a plain "always expect 3 cells" parser
 * silently drops those rows. Carry the rowspan artist forward to cover them.
 */
function parseYearEndTable(wikitext: string, year: number): YearEndSong[] {
	const startIdx = wikitext.search(/\{\|\s*class="wikitable/);
	if (startIdx === -1) throw new Error(`No year-end table found in Wikipedia page for ${year}`);
	const endIdx = wikitext.indexOf('\n|}', startIdx);
	const table = wikitext.slice(startIdx, endIdx === -1 ? undefined : endIdx);

	// `[^\n]*` tolerates stray junk on the separator line itself — e.g. the 1989
	// page has a literal `|- | ` (an accidental extra empty cell) on one row
	// separator, which a stricter `\s*` would fail to match and silently merge
	// two rows together.
	const rowSegments = table.split(/\n\|-[^\n]*\n/).slice(2); // drop table-open + header row

	const songs: YearEndSong[] = [];
	let carriedArtist: { text: string; remaining: number } | null = null;

	for (const segment of rowSegments) {
		const line = segment.split('\n').join(' ').trim();
		if (!line.startsWith('|')) continue;

		const cells = line.slice(1).split('||');
		if (cells.length < 2) continue;

		const rankMatch = cells[0].match(/\d+/);
		if (!rankMatch) continue;

		const title = cleanWikitext(cells[1]).replace(/^"|"$/g, '');

		let artist: string;
		if (cells.length >= 3) {
			const rowspanMatch = cells[2].match(/rowspan="(\d+)"\s*\|(.*)/s);
			if (rowspanMatch) {
				artist = cleanWikitext(rowspanMatch[2]);
				carriedArtist = { text: artist, remaining: Number(rowspanMatch[1]) - 1 };
			} else {
				artist = cleanWikitext(cells[2]);
			}
		} else if (carriedArtist && carriedArtist.remaining > 0) {
			artist = carriedArtist.text;
			carriedArtist.remaining -= 1;
		} else {
			continue; // no artist cell and nothing carried forward — malformed row
		}

		songs.push({ rank: Number(rankMatch[0]), title, artist });
	}

	return songs;
}

export async function fetchYearEndSongs(year: number): Promise<YearEndSong[]> {
	const title = `Billboard Year-End Hot 100 singles of ${year}`;
	const url = `https://en.wikipedia.org/w/api.php?${new URLSearchParams({
		action: 'parse',
		page: title,
		format: 'json',
		prop: 'wikitext'
	})}`;

	const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
	if (!res.ok) throw new Error(`Wikipedia request failed for "${title}": ${res.status}`);

	const body = (await res.json()) as ParseResponse;
	if (body.error) throw new Error(`Wikipedia parse error for "${title}": ${body.error.info}`);

	return parseYearEndTable(body.parse!.wikitext['*'], year);
}
