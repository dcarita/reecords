// Shapes of the committed JSON under src/lib/data/{onthisday,charts}/*.json.
// Shared between the build-time fetch scripts (scripts/) that write these files
// and the SvelteKit routes that read them back at prerender time.

export interface Musician {
	name: string;
	birthYear: number;
	wikidataId: string;
}

export interface OnThisDayEvent {
	year: number;
	text: string;
}

export interface OnThisDayData {
	month: number;
	day: number;
	musicians: Musician[];
	events: OnThisDayEvent[];
}

// Added by the separate, optional fetch-spotify-enrich.ts script — not present
// until that's been run, so always optional on ChartEntry.
export interface SpotifyTrackInfo {
	albumArtUrl: string | null;
	spotifyUrl: string;
}

export interface ChartEntry {
	song: string;
	artist: string;
	this_week: number;
	last_week: number | null;
	peak_position: number;
	weeks_on_chart: number;
	spotify?: SpotifyTrackInfo;
}

export interface Chart {
	requestedDate: string;
	chartDate: string;
	entries: ChartEntry[];
}
