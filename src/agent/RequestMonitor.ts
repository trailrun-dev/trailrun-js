import { BatchInterceptor } from '@mswjs/interceptors';
import { ClientRequestInterceptor } from '@mswjs/interceptors/ClientRequest';
import { XMLHttpRequestInterceptor } from '@mswjs/interceptors/XMLHttpRequest';
import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { InteractiveRequest } from '@mswjs/interceptors/src/utils/toInteractiveRequest';
import { DateTime } from 'luxon';
import { LogPayload } from '../types';
import { isTrailrunRequest, normalizeHeaders } from '../utils/headers';
import { readStream } from '../utils/stream';
import { BatchManager } from './BatchManager';
import { Debugger } from './Debugger';
import { LatencyMap } from './LatencyMap';

export class RequestMonitor {
	latencyMap: LatencyMap;
	batchManager: BatchManager;
	environment: string;
	debug: Debugger;

	constructor(
		latencyMap: LatencyMap,
		batchManager: BatchManager,
		debug: Debugger,
		runtime: {
			environment?: string;
		},
	) {
		this.latencyMap = latencyMap;
		this.batchManager = batchManager;
		this.environment = runtime.environment ?? 'development';
		this.debug = debug;
	}

	async handleHttpRequest(args: {
		request: InteractiveRequest;
		requestId: string;
	}): Promise<void> {
		if (isTrailrunRequest(args.request)) {
			return;
		}
		this.latencyMap.setRequestResponse(args.requestId, DateTime.utc().toISO());
	}

	async handleHttpResponse(args: {
		response: Response;
		isMockedResponse: boolean;
		request: Request;
		requestId: string;
	}): Promise<void> {
		const { response, request, requestId } = args;
		if (!this.latencyMap.contains(requestId)) {
			return;
		}
		const responseHeaders = normalizeHeaders(response.headers);
		let responseBody = '';
		if (response.body) {
			responseBody = await readStream(
				response.body.getReader(),
				responseHeaders['content-encoding'],
			);
		}

		const payloadResponse: LogPayload['response'] = {
			message: response.statusText,
			body: responseBody,
			headers: responseHeaders,
			statusCode: response.status,
		};

		const requestHeaders = normalizeHeaders(request.headers);
		let requestBody = '';
		if (request.body) {
			requestBody = await readStream(
				request.body.getReader(),
				requestHeaders['content-encoding'],
			);
		}

		const urlInterface = new URL(request.url);

		const payloadRequest: LogPayload['request'] = {
			method: request.method as LogPayload['request']['method'],
			hostname: urlInterface.hostname,
			headers: requestHeaders,
			body: requestBody,
			search: urlInterface.search,
			pathname: urlInterface.pathname,
		};

		const requestObject = this.latencyMap.getRequestResponse(requestId);

		if (!requestObject) {
			return;
		}

		const { callAt } = requestObject;

		const logPayload: LogPayload = {
			request: payloadRequest,
			response: payloadResponse,
			callAt,
			latencyInMilliseconds: DateTime.utc().toMillis() - DateTime.fromISO(callAt).toMillis(),
			environment: this.environment,
		};

		this.latencyMap.clearRequestResponse(requestId);

		if (this.batchManager.shouldAddToBatch(logPayload)) {
			this.batchManager.addToBatch(logPayload);
		} else {
			this.debug.warn('Skipping log payload');
		}
	}

	instrumentHTTPTraffic() {
		const interceptor = new BatchInterceptor({
			name: 'trailrun-interceptor',
			interceptors: [
				new ClientRequestInterceptor(),
				new XMLHttpRequestInterceptor(),
				new FetchInterceptor(),
			],
		});

		interceptor.on('request', this.handleHttpRequest.bind(this));

		interceptor.on('response', this.handleHttpResponse.bind(this));

		interceptor.apply();
	}
}
