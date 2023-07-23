import { fetch } from 'cross-fetch';
import { INGESTION_BASE_URL } from '../constants';
import { LogPayload, TrailrunConfig } from '../types';

class Logger {
  public projectKey: string | undefined;
  public environment = process.env.NODE_ENV || 'development';
  public ignoredHostnames: string[] = [];
  public apiBaseUrl: string;

  constructor(config: Pick<TrailrunConfig, 'ignore' | 'projectKey' | 'trailrunApiBaseUrl'>) {
    this.projectKey = config.projectKey;
    this.ignoredHostnames = config.ignore || [];
    this.apiBaseUrl = config.trailrunApiBaseUrl || INGESTION_BASE_URL;
  }

  public async emitBatch(logPayloads: LogPayload[]) {
    const postData = JSON.stringify(logPayloads);

    return fetch(`${this.apiBaseUrl}/ingest`, {
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
