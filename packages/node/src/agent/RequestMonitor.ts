import { BatchInterceptor } from '@mswjs/interceptors';
import { ClientRequestInterceptor } from '@mswjs/interceptors/ClientRequest';
import { XMLHttpRequestInterceptor } from '@mswjs/interceptors/XMLHttpRequest';
import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { InteractiveRequest } from '@mswjs/interceptors/src/utils/toInteractiveRequest';
import { DateTime } from 'luxon';
import { LogPayload } from '../types';
import { isTrailrunRequest, normalizeOutgoingHeaders } from '../utils/headers';
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

  async handleHttpRequest(args: { request: InteractiveRequest; requestId: string }): Promise<void> {
    if (isTrailrunRequest(args.request)) {
      return;
    }
    this.latencyMap.setRequestResponse(args.requestId, DateTime.now().toISO());
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
      headers: normalizeOutgoingHeaders(request.headers),
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
      latencyInMilliseconds: DateTime.now().toMillis() - DateTime.fromISO(callAt).toMillis(),
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
