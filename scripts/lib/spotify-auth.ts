const TOKEN_URL = 'https://accounts.spotify.com/api/token';

interface TokenResponse {
	access_token: string;
	expires_in: number;
}

let cached: { token: string; expiresAt: number } | null = null;

/**
 * Client Credentials flow: app-only auth, no user login, safe to run only from
 * a trusted environment (never the browser) since it needs the client secret.
 * Token is cached in-memory for the life of the script run (typically ~1hr TTL).
 */
export async function getSpotifyToken(): Promise<string> {
	if (cached && Date.now() < cached.expiresAt) return cached.token;

	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		throw new Error(
			'SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set (e.g. in a local .env file) to run Spotify enrichment.'
		);
	}

	const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
	const res = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${basicAuth}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: 'grant_type=client_credentials'
	});

	if (!res.ok) {
		throw new Error(`Spotify token request failed: ${res.status} ${await res.text()}`);
	}

	const body = (await res.json()) as TokenResponse;
	// Refresh a little early rather than risk a request landing right at expiry.
	cached = { token: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 - 5000 };
	return cached.token;
}
