import { describe, expect, it, test } from 'vitest';
import { readStream, shouldStreamBody } from '../../src/utils/stream';

test('readStream transforms an empty stream', async () => {
	const stream = {
		read: async () => ({ value: undefined, done: true }),
	};

	const result = await readStream(stream as any, null);
	expect(result).toBe('');
});

test('readStream transforms a non-empty stream', async () => {
	const string = 'Hello, world!';
	const encoder = new TextEncoder();
	const data = encoder.encode(string);

	const stream = {
		index: 0,
		read: async function () {
			if (this.index < data.length) {
				const value = data.slice(this.index, this.index + 1);
				this.index++;
				return { value, done: false };
			} else {
				return { value: undefined, done: true };
			}
		},
	};

	const result = await readStream(stream as any, null);
	expect(result).toBe(string);
});

describe('Content Type Check', () => {
	it('should return true for text-based types', () => {
		expect(shouldStreamBody('text/plain')).to.be.true;
		expect(shouldStreamBody('application/json')).to.be.true;
		expect(shouldStreamBody('application/javascript')).to.be.true;
		expect(shouldStreamBody('application/xml')).to.be.true;
		expect(shouldStreamBody('text/html; charset=utf-8')).to.be.true;
	});

	it('should return false for non-text-based types', () => {
		expect(shouldStreamBody('image/jpeg')).to.be.false;
		expect(shouldStreamBody('application/octet-stream')).to.be.false;
		expect(shouldStreamBody('multipart/form-data')).to.be.false;
	});

	it('should be case insensitive', () => {
		expect(shouldStreamBody('TEXT/PLAIN')).to.be.true;
		expect(shouldStreamBody('Application/Json')).to.be.true;
	});

	it('should ignore any parameters like charset', () => {
		expect(shouldStreamBody('text/html; charset=utf-8')).to.be.true;
		expect(shouldStreamBody('text/html; charset=UTF-8')).to.be.true;
		expect(shouldStreamBody('application/json; charset=iso-8859-1')).to.be.true;
	});
});
