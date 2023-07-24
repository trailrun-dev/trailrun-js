import { inflate } from 'pako';
import { MAX_BODY_SIZE } from '../constants';

export async function readStream(
	reader: ReadableStreamDefaultReader<Uint8Array>,
	contentEncoding: string | null,
	sizeLimit = MAX_BODY_SIZE,
): Promise<string> {
	let result = '';
	let counter = 0;
	let dataChunks: Uint8Array[] = [];

	while (true) {
		const { value, done } = await reader.read();

		if (done || counter >= sizeLimit) {
			break;
		}

		if (value) {
			dataChunks.push(value);
		}
	}

	const combined = new Uint8Array(dataChunks.reduce((a, b) => a + b.length, 0)); // create a new array with the combined length of all chunks
	let pos = 0;
	for (let chunk of dataChunks) {
		// fill the new array with all chunks
		combined.set(chunk, pos);
		pos += chunk.length;
	}

	let decoded;
	if (contentEncoding === 'gzip') {
		const decompressed = inflate(combined);
		decoded = new TextDecoder('utf-8').decode(decompressed);
	} else {
		decoded = new TextDecoder('utf-8').decode(combined);
	}

	for (let char of decoded) {
		if (counter >= sizeLimit) {
			break;
		}
		result += char;
		counter++;
	}

	return result;
}
