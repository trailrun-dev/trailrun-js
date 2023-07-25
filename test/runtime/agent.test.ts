import fetch from 'cross-fetch';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import trailrun from '../../index';
import { BatchManager } from '../../src/agent/BatchManager';

const delay = (ms: number | undefined) => new Promise((res) => setTimeout(res, ms));

describe('Should intercept requests', () => {
	beforeAll(() => {
		trailrun({
			debug: true,
			projectKey: 'tr_1234',
		});
	});

	it('should call the logger on get', async () => {
		const spy = vi.spyOn(BatchManager.prototype, 'flush');
		spy.mockImplementation(async () => Promise.resolve() as any);
		await fetch('https://api.github.com');
		await delay(500);
		expect(spy).toHaveBeenCalled();
	}, 10000);

	it('should call the logger on post', async () => {
		const spy = vi.spyOn(BatchManager.prototype, 'flush');
		spy.mockImplementation(async () => Promise.resolve() as any);
		await fetch('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			body: JSON.stringify({
				title: 'foo',
				body: 'bar',
				userId: 1,
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		});
		await delay(500);
		expect(spy).toHaveBeenCalled();
	}, 10000);
});
