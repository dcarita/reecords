import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function readJsonIfExists<T>(filePath: string): Promise<T | null> {
	if (!existsSync(filePath)) return null;
	return JSON.parse(await readFile(filePath, 'utf-8')) as T;
}

/** Pretty-printed with a trailing newline so it diffs cleanly in PRs. */
export async function writeJson(filePath: string, data: unknown): Promise<void> {
	await mkdir(path.dirname(filePath), { recursive: true });
	await writeFile(filePath, JSON.stringify(data, null, '\t') + '\n', 'utf-8');
}
