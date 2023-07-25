import pako from 'pako';
import { MAX_BODY_SIZE } from '../constants';

export async function readStream(
	reader: ReadableStreamDefaultReader<Uint8Array>,
	contentEncoding: string | null,
	sizeLimit = MAX_BODY_SIZE,
): Promise<string> {
	let counter = 0;
	let dataChunks: Uint8Array[] = [];
	let currentChunkSize = 0;

	while (true) {
		const { value, done } = await reader.read();

		if (done || counter + currentChunkSize > sizeLimit) {
			break;
		}

		if (value) {
			counter += value.length;
			dataChunks.push(value);
		}
	}

	const combined = new Uint8Array(counter); // create a new array with the combined length of all chunks
	let pos = 0;
	for (let chunk of dataChunks) {
		// fill the new array with all chunks
		combined.set(chunk, pos);
		pos += chunk.length;
	}

	let decoded;
	switch (contentEncoding) {
		case 'gzip':
		case 'deflate':
			const decompressed = pako.inflate(combined);
			decoded = new TextDecoder('utf-8').decode(decompressed);
			break;
		default: // assuming default case is 'identity' or no encoding
			decoded = new TextDecoder('utf-8').decode(combined);
	}

	if (decoded.length > sizeLimit) {
		decoded = decoded.substring(0, sizeLimit);
	}

	return decoded;
}

export function shouldStreamBody(contentType: string | null): boolean {
	if (!contentType) {
		return false;
	}

	const textBasedTypes: Set<string> = new Set([
		'text/plain',
		'text/html',
		'text/css',
		'text/csv',
		'application/json',
		'application/x-ndjson',
		'application/javascript',
		'application/xml',
		'application/sql',
		'application/ld+json',
		'application/vnd.api+json',
		'application/vnd.google-earth.kml+xml',
		'application/rss+xml',
		'application/atom+xml',
	]);

	// Normalize to lowercase and remove optional charset
	const normalized = contentType.toLowerCase().split(';')[0].trim();

	return textBasedTypes.has(normalized);
}
