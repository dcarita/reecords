import type { OnThisDayEvent } from '../../src/lib/data/types.ts';

const USER_AGENT =
	'reecords-app-dev/0.1 (https://github.com/dcarita/reecords; build-time data fetch)';

// Wikipedia's "on this day" feed returns every kind of historical event, not just
// music ones — this is a best-effort keyword filter, not a precise classifier.
const MUSIC_KEYWORDS =
	/\balbum\b|\bsingle\b|\bband\b|\bgrammy\b|\bbillboard\b|\bno\.?\s?1\b|\bchart(ed|s)?\b|\brecord label\b|\bmusician\b|\bsong\b|\btour\b|\bconcert\b/i;

interface OnThisDayResponse {
	events: { year: number; text: string }[];
}

export async function fetchMusicEventsOn(month: number, day: number): Promise<OnThisDayEvent[]> {
	const pad2 = (n: number) => String(n).padStart(2, '0');
	const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${pad2(month)}/${pad2(day)}`;

	const res = await fetch(url, {
		headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' }
	});

	if (!res.ok) {
		throw new Error(`Wikipedia onthisday feed failed: ${res.status} ${res.statusText}`);
	}

	const body = (await res.json()) as OnThisDayResponse;

	return body.events
		.filter((e) => MUSIC_KEYWORDS.test(e.text))
		.map((e) => ({ year: e.year, text: e.text }));
}
