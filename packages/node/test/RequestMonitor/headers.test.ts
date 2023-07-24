import { expect, test } from 'vitest';
import { normalizeOutgoingHeaders } from '../../src/utils/headers';

test('normalizeOutgoingHeaders transforms empty Headers instance', () => {
  const headers = new Headers();
  const expected = {};

  const result = normalizeOutgoingHeaders(headers);
  expect(result).toEqual(expected);
});

test('normalizeOutgoingHeaders transforms single-entry Headers instance', () => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const expected = {
    'content-type': 'application/json',
  };

  const result = normalizeOutgoingHeaders(headers);
  expect(result).toEqual(expected);
});

test('normalizeOutgoingHeaders transforms multi-entry Headers instance', () => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Bearer token');

  const expected = {
    'content-type': 'application/json',
    authorization: 'Bearer token',
  };

  const result = normalizeOutgoingHeaders(headers);
  expect(result).toEqual(expected);
});
