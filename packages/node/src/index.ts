import { BatchManager } from './agent/BatchManager';
import { Debugger } from './agent/Debugger';
import { LatencyMap } from './agent/LatencyMap';
import { Logger } from './agent/Logger';
import { RequestMonitor } from './agent/RequestMonitor';
import { TrailrunConfig } from './types';

const trailrun = (args: TrailrunConfig): void => {
  const debug = new Debugger(args.debug || false);
  debug.info('Initializing Trailrun');
  const logger = new Logger({
    projectKey: args.projectKey,
    ignore: args.ignore,
    trailrunApiBaseUrl: args.trailrunApiBaseUrl,
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
