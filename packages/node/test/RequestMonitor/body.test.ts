import { expect, test } from 'vitest';
import { streamToString } from '../../src/utils/stream';

test('streamToString transforms an empty stream', async () => {
  const stream = {
    read: async () => ({ value: undefined, done: true }),
  };

  const result = await streamToString(stream as any);
  expect(result).toBe('');
});

test('streamToString transforms a non-empty stream', async () => {
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

  const result = await streamToString(stream as any);
  expect(result).toBe(string);
});
