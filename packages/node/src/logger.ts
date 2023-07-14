import { fetch } from 'cross-fetch';
import { DateTime } from 'luxon';
import { API_BASE_URL } from './constants';
import { LogPayload, logSchema } from './types';

class Logger {
	public projectKey: string | undefined;
	public environment = process.env.NODE_ENV || 'development';
	public ignoredHostnames: string[] = [];
	public debug = false;
	public trailrunApiBaseUrl = API_BASE_URL;
	lastLogTime: DateTime;

	constructor(args: {
		projectKey?: string;
		ignoredHostnames?: string[];
		debug?: boolean;
		trailrunApiBaseUrl?: string;
	}) {
		this.projectKey = args.projectKey;
		this.ignoredHostnames = args.ignoredHostnames || [];
		this.debug = args.debug || false;
		this.trailrunApiBaseUrl = args.trailrunApiBaseUrl || API_BASE_URL;
		this.lastLogTime = DateTime.local().minus({ seconds: 5 });
	}

	public shouldSkipLog(logPayload: LogPayload) {
		// Skip logging if the schema validation fails
		const schemaParseResult = logSchema.safeParse(logPayload);
		if (!schemaParseResult.success && schemaParseResult.error) {
			return true;
		}

		// Skip logging if the hostname is in the ignored list
		if (
			logPayload.request.hostname &&
			this.ignoredHostnames.includes(logPayload.request.hostname)
		) {
			return true;
		}

		return false;
	}

	async sendLogPayload(logPayload: LogPayload) {
		const currentTime = DateTime.local();
		if (currentTime.diff(this.lastLogTime, 'seconds').seconds < 5) {
			return;
		}

		const shouldSkipLog = this.shouldSkipLog(logPayload);
		if (shouldSkipLog) {
			if (this.debug) {
				console.info('- Skipping log');
			}
		} else {
			try {
				this.lastLogTime = currentTime;
				await this.emit(logPayload);
				console.info(
					`- [${logPayload.callAt}] - SUCCESSFULLY sent log payload for req to hostname ${logPayload.request.hostname}`,
				);
			} catch {
				console.info(
					`- [${logPayload.callAt}] - FAILED to send log payload for req to hostname ${logPayload.request.hostname}`,
				);
			}
		}
	}

	public async emit(logPayload: LogPayload) {
		const postData = JSON.stringify(logPayload);

		return fetch(`${this.trailrunApiBaseUrl}/v1/ingest`, {
			method: 'POST',
			headers: {
				'X-Trailrun-Client': 'trailrun-node',
				'Content-Type': 'application/json',
				'Content-Length': postData.length.toString(),
				Authorization: `Bearer ${this.projectKey}`,
			},
			body: postData,
		});
	}
}

export { Logger };
