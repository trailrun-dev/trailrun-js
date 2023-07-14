import { fetch } from 'cross-fetch';
import { API_BASE_URL } from '../constants';
import { LogPayload } from '../types';

class Logger {
	public projectKey: string | undefined;
	public environment = process.env.NODE_ENV || 'development';
	public ignoredHostnames: string[] = [];
	public debug = false;
	public trailrunApiBaseUrl = API_BASE_URL;

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
	}

	public async emitBatch(logPayloads: LogPayload[]) {
		const postData = JSON.stringify(logPayloads);

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
