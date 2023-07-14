import fetch from 'cross-fetch';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { trailrun } from '../../src';
import { Logger } from '../../src/logger';

const delay = (ms: number | undefined) => new Promise((res) => setTimeout(res, ms));

describe('Should intercept requests', () => {
	beforeAll(() => {
		trailrun({
			projectKey: process.env.TRAILRUN_PROJECT_KEY as string,
			trailrunApiBaseUrl: 'http://localhost:8080',
		});
	});

	it('should call the logger', async () => {
		const spy = vi.spyOn(Logger.prototype, 'emit');
		spy.mockImplementation(async () => Promise.resolve() as any);
		await fetch('https://api.github.com');
		expect(spy).toHaveBeenCalled();
		expect(spy).toHaveBeenCalled();
		await delay(3000);
	});
});
