import { BatchManager } from './agent/BatchManager';
import { Debugger } from './agent/Debugger';
import { LatencyMap } from './agent/LatencyMap';
import { Logger } from './agent/Logger';
import { RequestMonitor } from './agent/RequestMonitor';

const trailrun = (args: { projectKey: string; ignore?: string[]; debug?: boolean }): void => {
	const debug = new Debugger(args.debug || false);
	debug.info('Initializing Trailrun');
	const logger = new Logger(debug, {
		projectKey: args.projectKey,
		ignoredHostnames: args.ignore,
	});
	const latencyMap = new LatencyMap();
	const batchManager = new BatchManager(logger, debug);
	const requestMonitor = new RequestMonitor(latencyMap, batchManager, debug, {
		environment: process.env.NODE_ENV,
	});

	requestMonitor.instrumentHTTPTraffic();
	debug.ready('Trailrun is initialized');
};

export { trailrun };
