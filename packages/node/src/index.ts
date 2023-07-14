import { BatchManager } from './agent/BatchManager';
import { LatencyMap } from './agent/LatencyMap';
import { Logger } from './agent/Logger';
import { RequestMonitor } from './agent/RequestMonitor';

const trailrun = (args: {
	projectKey: string;
	ignore?: string[];
	debug?: boolean;
	trailrunApiBaseUrl?: string;
}): void => {
	console.log('- Attempting to initialize Trailrun Agent');
	const logger = new Logger({ ...args });
	const latencyMap = new LatencyMap();
	const batchManager = new BatchManager(logger);
	const requestMonitor = new RequestMonitor(latencyMap, batchManager, {
		environment: process.env.NODE_ENV,
	});

	requestMonitor.instrumentHTTPTraffic();
	console.log('- Successfully initialized Trailrun Agent');
};

export { trailrun };
