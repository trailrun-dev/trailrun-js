import { expect, test } from 'vitest';
import { normalizeHeaders } from '../../src/utils/headers';

test('normalizeHeaders transforms empty Headers instance', () => {
	const headers = new Headers();
	const expected = {};

	const result = normalizeHeaders(headers);
	expect(result).toEqual(expected);
});

test('normalizeHeaders transforms single-entry Headers instance', () => {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');

	const expected = {
		'content-type': 'application/json',
	};

	const result = normalizeHeaders(headers);
	expect(result).toEqual(expected);
});

test('normalizeHeaders transforms multi-entry Headers instance', () => {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Authorization', 'Bearer token');

	const expected = {
		'content-type': 'application/json',
		authorization: 'Bearer token',
	};

	const result = normalizeHeaders(headers);
	expect(result).toEqual(expected);
});
