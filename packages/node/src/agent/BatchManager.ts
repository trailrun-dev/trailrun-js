import { DateTime } from 'luxon';
import { LogPayload, logPayloadSchema } from '../types';
import { Logger } from './Logger';

export class BatchManager {
	private ignoredHostnames: string[] = [];
	private batch: LogPayload[];
	private maxSize: number;
	private interval: number;
	private logger: Logger;
	private timer: NodeJS.Timeout | null;

	constructor(logger: Logger, maxSize = 50, interval = 1000) {
		this.batch = [];
		this.maxSize = maxSize;
		this.interval = interval;
		this.logger = logger;
		this.timer = null;
	}

	startTimer(): void {
		this.timer = setInterval(() => this.flush(), this.interval);
	}

	shouldAddToBatch(logPayload: LogPayload): boolean {
		// Skip logging if the schema validation fails
		const schemaParseResult = logPayloadSchema.safeParse(logPayload);
		if (!schemaParseResult.success && schemaParseResult.error) {
			return false;
		}

		// Skip logging if the hostname is in the ignored list
		if (
			logPayload.request.hostname &&
			this.ignoredHostnames.includes(logPayload.request.hostname)
		) {
			return false;
		}

		return true;
	}

	addToBatch(logPayload: LogPayload): void {
		if (this.batch.length < this.maxSize) {
			this.batch.push(logPayload);
		} else {
			this.flush();
			this.batch.push(logPayload);
		}

		if (!this.timer) {
			this.timer = setInterval(() => this.flush(), this.interval);
		}
	}

	async flush(): Promise<void> {
		if (this.batch.length > 0) {
			try {
				await this.logger.emitBatch(this.batch);
				console.info(
					`- [${DateTime.now()}] - SUCCESSFULLY sent batch of ${
						this.batch.length
					} log payloads`,
				);
			} catch {
				console.info(
					`- [${DateTime.now()}] - FAILED to sent batch of ${
						this.batch.length
					} log payloads`,
				);
			}
		}

		// Clear the batch
		this.batch = [];
	}

	stop(): void {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}
}
