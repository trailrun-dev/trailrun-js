import { BatchInterceptor } from '@mswjs/interceptors';
import { ClientRequestInterceptor } from '@mswjs/interceptors/ClientRequest';
import { XMLHttpRequestInterceptor } from '@mswjs/interceptors/XMLHttpRequest';
import { InteractiveRequest } from '@mswjs/interceptors/src/utils/toInteractiveRequest';
import { DateTime } from 'luxon';
import { Logger } from '../logger';
import { LogPayload } from '../types';
import { isTrailrunRequest, normalizeOutgoingHeaders } from '../utils/headers';
import { AgentState } from './AgentState';

export class RequestMonitor {
	agentState: AgentState;
	logger: Logger;

	constructor(agentState: AgentState, logger: Logger) {
		this.agentState = agentState;
		this.logger = logger;
	}

	async handleHttpRequest(args: {
		request: InteractiveRequest;
		requestId: string;
	}): Promise<void> {
		if (isTrailrunRequest(args.request)) {
			return;
		}

		this.agentState.setRequestResponse(args.requestId, DateTime.now().toISO());
	}

	async handleHttpResponse(args: {
		response: Response;
		isMockedResponse: boolean;
		request: Request;
		requestId: string;
	}): Promise<void> {
		const { response, request, requestId } = args;
		if (isTrailrunRequest(request)) {
			return;
		}

		let responseBody = '';
		if (response.body && response.bodyUsed) {
			responseBody = await streamToString(response.body.getReader());
		}

		const payloadResponse: LogPayload['response'] = {
			message: response.statusText,
			body: responseBody,
			headers: response.headers,
			statusCode: response.status,
		};

		let requestBody = '';
		if (request.body && request.bodyUsed) {
			requestBody = await streamToString(request.body.getReader());
		}

		const urlInterface = new URL(request.url);

		const payloadRequest: LogPayload['request'] = {
			method: request.method.toString() as LogPayload['request']['method'],
			hostname: urlInterface.hostname,
			headers: normalizeOutgoingHeaders(request.headers as globalThis.Headers),
			body: requestBody,
			search: urlInterface.search,
			pathname: urlInterface.pathname,
		};

		const requestObject = this.agentState.getRequestResponse(requestId);

		if (!requestObject) {
			return;
		}

		const { callAt } = requestObject;

		const logPayload: LogPayload = {
			request: payloadRequest,
			response: payloadResponse,
			callAt,
			latencyInMilliseconds: DateTime.now().toMillis() - DateTime.fromISO(callAt).toMillis(),
			environment: this.logger.environment ?? 'development',
		};

		if (this.logger.debug) {
			console.log('📦 Sending log payload');
		}

		await this.logger.sendLogPayload(logPayload);
	}

	instrumentHTTPTraffic() {
		const interceptor = new BatchInterceptor({
			name: 'trailrun-interceptor',
			interceptors: [new ClientRequestInterceptor(), new XMLHttpRequestInterceptor()],
		});

		interceptor.on('request', this.handleHttpRequest.bind(this));

		interceptor.on('response', this.handleHttpResponse.bind(this));

		interceptor.apply();
	}
}
