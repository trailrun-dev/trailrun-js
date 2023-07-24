import fetch from 'cross-fetch';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { BatchManager } from '../../src/agent/BatchManager';
import trailrun from '../../src/index';

const delay = (ms: number | undefined) => new Promise((res) => setTimeout(res, ms));

describe('Should intercept requests', () => {
	beforeAll(() => {
		trailrun({
			debug: false,
			projectKey: 'tr_1234',
		});
	});

	it('should call the logger', async () => {
		const spy = vi.spyOn(BatchManager.prototype, 'flush');
		spy.mockImplementation(async () => Promise.resolve() as any);
		await fetch('https://api.github.com');
		await delay(5000);
		expect(spy).toHaveBeenCalled();
	}, 10000);
});