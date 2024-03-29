import { LogPayload, logPayloadSchema } from '../types';
import { shouldIgnoreHostname } from '../utils/hostnames';
import { Debugger } from './Debugger';
import { Logger } from './Logger';

export class BatchManager {
	private ignoredHostnames: string[] = [];
	private batch: LogPayload[];
	private maxSize: number;
	private interval: number;
	private logger: Logger;
	private timer: NodeJS.Timeout | null;
	private debug: Debugger;

	constructor(
		logger: Logger,
		debug: Debugger,
		config: {
			maxSize?: number;
			interval?: number;
			ignoredHostnames: string[] | undefined;
		},
	) {
		this.debug = debug;
		this.batch = [];
		this.maxSize = config.maxSize ?? 50;
		this.interval = config.interval ?? (process.env.NODE_ENV === 'test' ? 100 : 5000);
		this.logger = logger;
		this.timer = null;
		this.ignoredHostnames = config.ignoredHostnames ?? [];
	}

	startTimer(): void {
		this.timer = setInterval(async () => await this.flush(), this.interval);
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
			shouldIgnoreHostname(logPayload.request.hostname, this.ignoredHostnames)
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
			this.debug.info(`Flushing batch of ${this.batch.length} log payloads`);
			try {
				await this.logger.emitBatch(this.batch);
				this.debug.success(
					`Successfully flushed batch of ${this.batch.length} log payloads`,
				);
			} catch {
				this.debug.error(`Failed to flush batch of ${this.batch.length} log payloads`);
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
