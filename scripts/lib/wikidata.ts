const ENDPOINT = 'https://query.wikidata.org/sparql';
const USER_AGENT =
	'reecords-app-dev/0.1 (https://github.com/dcarita/reecords; build-time data fetch)';

// Wikidata occupation (P106) items broad enough to cover most recording artists.
const MUSICIAN_OCCUPATIONS = [
	'Q639669', // musician
	'Q177220', // singer
	'Q36834', // composer
	'Q855091', // guitarist
	'Q713200', // rapper
	'Q753110' // songwriter
];

export interface Musician {
	name: string;
	birthYear: number;
	wikidataId: string;
}

// Shape of a single row in Wikidata's SPARQL JSON results format
// (https://www.w3.org/TR/sparql11-results-json/) for this specific query.
interface SparqlBinding {
	person: { value: string };
	personLabel: { value: string };
	dob: { value: string };
	sitelinks: { value: string };
}

interface SparqlResponse {
	results: { bindings: SparqlBinding[] };
}

/**
 * Musicians born on a given month/day (any year), ranked by Wikidata sitelink
 * count (roughly: how many language-edition Wikipedia articles exist about them)
 * so well-known names surface ahead of obscure historical figures.
 */
export async function fetchMusiciansBornOn(month: number, day: number): Promise<Musician[]> {
	// `?person wikibase:sitelinks ?sitelinks` reads a precomputed count Wikidata
	// already indexes, which is much cheaper for the public endpoint than counting
	// `schema:about` joins by hand (that version reliably timed out at 504).
	const query = `SELECT DISTINCT ?person ?personLabel ?dob ?sitelinks WHERE {
		VALUES ?occ { ${MUSICIAN_OCCUPATIONS.map((id) => `wd:${id}`).join(' ')} }
		?person wdt:P106 ?occ .
		?person wdt:P569 ?dob .
		?person wikibase:sitelinks ?sitelinks .
		FILTER(MONTH(?dob) = ${month} && DAY(?dob) = ${day})
		SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
	}
	ORDER BY DESC(?sitelinks)
	LIMIT 20`;

	const url = `${ENDPOINT}?${new URLSearchParams({ query, format: 'json' })}`;
	const res = await fetch(url, {
		headers: {
			Accept: 'application/sparql-results+json',
			'User-Agent': USER_AGENT
		}
	});

	if (!res.ok) {
		throw new Error(`Wikidata query failed: ${res.status} ${res.statusText}`);
	}

	const body = (await res.json()) as SparqlResponse;
	const QID_LABEL_FALLBACK = /^Q\d+$/;

	return body.results.bindings
		.filter((b) => !QID_LABEL_FALLBACK.test(b.personLabel.value))
		.map((b) => ({
			name: b.personLabel.value,
			birthYear: Number(b.dob.value.slice(0, 4)),
			wikidataId: b.person.value.split('/').pop() as string
		}));
}
