/**
 * Wraps a fetch-like async call with a couple of retries and backoff. Public,
 * unauthenticated endpoints (Wikidata's SPARQL service in particular) occasionally
 * return transient 5xx/HTML error pages under load — this keeps a CI build from
 * failing outright on a single blip.
 */
export async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
	let lastError: unknown;
	for (let attempt = 1; attempt <= attempts; attempt++) {
		try {
			return await fn();
		} catch (err) {
			lastError = err;
			if (attempt < attempts) {
				const delayMs = 1000 * attempt;
				console.warn(`  retry ${attempt}/${attempts - 1} after error: ${(err as Error).message}`);
				await new Promise((resolve) => setTimeout(resolve, delayMs));
			}
		}
	}
	throw lastError;
}
