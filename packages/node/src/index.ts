import { AgentState } from './agent/AgentState';
import { RequestMonitor } from './agent/RequestMonitor';
import { Logger } from './logger';

const trailrun = (args: {
	projectKey: string;
	ignore?: string[];
	debug?: boolean;
	trailrunApiBaseUrl?: string;
}): void => {
	console.log('- Attempting to initialize Trailrun Agent');
	const logger = new Logger({ ...args });
	const agentState = new AgentState();
	const requestMonitor = new RequestMonitor(agentState, logger);

	requestMonitor.instrumentHTTPTraffic();
	console.log('- Successfully initialized Trailrun Agent');
};

export { trailrun };
