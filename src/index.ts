import { BatchManager } from './agent/BatchManager';
import { Debugger } from './agent/Debugger';
import { LatencyMap } from './agent/LatencyMap';
import { Logger } from './agent/Logger';
import { RequestMonitor } from './agent/RequestMonitor';
import { TrailrunConfig } from './types';

export default function (args: TrailrunConfig): void {
	const debug = new Debugger(args.debug || false);
	if (!args.projectKey) {
		debug.warn('Trailrun is not initialized because the project key is missing.');
	}

	debug.info('Initializing Trailrun');
	const logger = new Logger({
		projectKey: args.projectKey,
		ignore: args.ignore,
		trailrunApiBaseUrl: args.trailrunApiBaseUrl,
	});
	const latencyMap = new LatencyMap();
	const batchManager = new BatchManager(logger, debug, {
		ignoredHostnames: args.ignore,
	});
	const requestMonitor = new RequestMonitor(latencyMap, batchManager, debug, {
		environment: process.env.NODE_ENV,
	});

	requestMonitor.instrumentHTTPTraffic();
	debug.ready('Trailrun is initialized');
}
