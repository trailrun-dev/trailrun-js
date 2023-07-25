import { SpyInstance, beforeEach, describe, expect, test, vi } from 'vitest';
import { BatchManager } from '../../src/agent/BatchManager';
import { Debugger } from '../../src/agent/Debugger';
import { Logger } from '../../src/agent/Logger';
import { LogPayload } from '../../src/types';

describe('BatchManager', () => {
	let logger: Logger;
	let debug: Debugger;
	let batchManager: BatchManager;
	let emitSpy: SpyInstance;

	// Mock logger and debug before each test
	beforeEach(() => {
		logger = new Logger({
			projectKey: 'tr_1234',
			trailrunApiBaseUrl: 'localhost:2000',
		});

		debug = new Debugger(true);

		// Setup the batchManager for testing
		batchManager = new BatchManager(logger, debug, {
			ignoredHostnames: [],
			maxSize: 50,
			interval: 100,
		});

		// spy on emit batch
		emitSpy = vi.spyOn(logger, 'emitBatch');
	});

	test('should flush every 5 seconds', async () => {
		const logPayload: LogPayload = {
			hostname: 'stripe.com',
		} as any; /* create a valid log payload */

		const spy = vi.spyOn(BatchManager.prototype, 'shouldAddToBatch');
		spy.mockReturnValue(true);

		batchManager.addToBatch(logPayload);
		await new Promise((resolve) => setTimeout(resolve, 150));

		expect(emitSpy).toBeCalledTimes(1);
		expect(emitSpy).toBeCalledWith([logPayload]);

		batchManager.addToBatch(logPayload);
		await new Promise((resolve) => setTimeout(resolve, 150));

		expect(emitSpy).toBeCalledTimes(2);
		expect(emitSpy).toBeCalledWith([logPayload]);
	});

	test('should batch together quick additions', async () => {
		const logPayload1: LogPayload = { hostname: 'github.com' } as any;
		const logPayload2: LogPayload = { hostname: 'google.com' } as any;

		const spy = vi.spyOn(BatchManager.prototype, 'shouldAddToBatch');
		spy.mockReturnValue(true);

		batchManager.addToBatch(logPayload1);
		batchManager.addToBatch(logPayload2);
		await new Promise((resolve) => setTimeout(resolve, 150));

		expect(emitSpy).toBeCalledTimes(1);
		expect(emitSpy).toBeCalledWith([logPayload1, logPayload2]);
	});
});
