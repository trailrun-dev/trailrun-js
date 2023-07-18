import { fetch } from 'cross-fetch';
import { INGESTION_BASE_URL } from '../constants';
import { LogPayload } from '../types';
import { Debugger } from './Debugger';

class Logger {
	public projectKey: string | undefined;
	public environment = process.env.NODE_ENV || 'development';
	public ignoredHostnames: string[] = [];

	constructor(debug: Debugger, config: { projectKey?: string; ignoredHostnames?: string[] }) {
		this.projectKey = config.projectKey;
		this.ignoredHostnames = config.ignoredHostnames || [];
	}

	public async emitBatch(logPayloads: LogPayload[]) {
		const postData = JSON.stringify(logPayloads);

		return fetch(`${INGESTION_BASE_URL}/ingest`, {
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
