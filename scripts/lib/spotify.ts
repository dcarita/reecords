import type { SpotifyTrackInfo } from '../../src/lib/data/types.ts';
import { getSpotifyToken } from './spotify-auth.ts';

interface SpotifySearchResponse {
	tracks: {
		items: {
			external_urls: { spotify: string };
			album: { images: { url: string }[] };
		}[];
	};
}

// Billboard credits often include collaborators or medley titles that don't
// appear in Spotify's own artist/track metadata verbatim — e.g. "Santana
// Featuring Rob Thomas" is stored on Spotify as just "Santana", and a double
// A-side like "You're Makin' Me High/Let It Flow" is two separate tracks.
// Stripping these before searching turned 2/5 misses into 2/5 hits in testing.
function primaryArtist(artist: string): string {
	return artist.split(/\s+(?:featuring|feat\.?|with)\s+/i)[0];
}

function primaryTitle(song: string): string {
	return song.split('/')[0].trim();
}

async function search(
	q: string,
	token: string
): Promise<SpotifySearchResponse['tracks']['items'][0] | undefined> {
	const url = `https://api.spotify.com/v1/search?${new URLSearchParams({ q, type: 'track', limit: '1' })}`;
	const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) throw new Error(`Spotify search failed for query "${q}": ${res.status}`);
	const body = (await res.json()) as SpotifySearchResponse;
	return body.tracks.items[0];
}

/**
 * Looks up a track by title + artist. Spotify has no historical-chart or
 * artist-birthdate data — this is enrichment only, layered on top of facts
 * already sourced from Wikidata/Billboard. Note: Spotify's `preview_url` field
 * has returned null for all apps created since Nov 2024 with no replacement, so
 * this deliberately doesn't attempt to surface 30-second previews.
 */
export async function searchTrack(song: string, artist: string): Promise<SpotifyTrackInfo | null> {
	const token = await getSpotifyToken();
	const title = primaryTitle(song);
	const credit = primaryArtist(artist);

	// Field-filtered search first (precise when it matches); fall back to a
	// plain, unstructured query (more forgiving of minor metadata mismatches)
	// only if that comes back empty.
	let track = await search(`track:${title} artist:${credit}`, token);
	if (!track) track = await search(`${title} ${credit}`, token);
	if (!track) return null;

	return {
		albumArtUrl: track.album.images[0]?.url ?? null,
		spotifyUrl: track.external_urls.spotify
	};
}
