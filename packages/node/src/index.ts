import { BatchInterceptor } from "@mswjs/interceptors";
import nodeInterceptors from "@mswjs/interceptors/lib/presets/node";
import { InteractiveRequest } from "@mswjs/interceptors/lib/utils/toInteractiveRequest";
import { DateTime } from "luxon";
import { Logger } from "./logger";
import { LogPayload } from "./types";
import { normalizeOutgoingHeaders } from "./utils/headers";

var logger: Logger;

// RequestID -> callAt timestamp
const requestResponseMap = new Map<
  string,
  {
    callAt: string;
  }
>();

function instrumentHTTPTraffic() {
  const interceptor = new BatchInterceptor({
    name: "trailrun-interceptor",
    interceptors: nodeInterceptors,
  });

  interceptor.on("request", _handleHttpRequest);

  interceptor.on("response", _handleHttpResponse);

  interceptor.apply();
}

async function _handleHttpRequest(
  request: InteractiveRequest,
  requestId: string
): Promise<void> {
  const urlInterface = new URL(request.url);
  if (urlInterface.hostname === "localhost") {
    return;
  }

  requestResponseMap.set(requestId, {
    callAt: DateTime.now().toISO(),
  });
  return;
}

async function _handleHttpResponse(
  response: Response,
  request: Request,
  requestId: string
): Promise<void> {
  const urlInterface = new URL(request.url);
  if (urlInterface.hostname === "localhost") {
    return;
  }

  let responseBody = "";
  if (response.body && response.bodyUsed) {
    responseBody = await streamToString(response.body.getReader());
  }

  const payloadResponse: LogPayload["response"] = {
    message: response.statusText,
    body: responseBody,
    headers: response.headers,
    statusCode: response.status,
  };

  let requestBody = "";
  if (request.body && request.bodyUsed) {
    requestBody = await streamToString(request.body.getReader());
  }

  const payloadRequest: LogPayload["request"] = {
    method: request.method.toString() as LogPayload["request"]["method"],
    hostname: urlInterface.hostname,
    headers: normalizeOutgoingHeaders(request.headers as globalThis.Headers),
    body: requestBody,
    search: urlInterface.search,
    pathname: urlInterface.pathname,
  };

  const requestObject = requestResponseMap.get(requestId);

  if (!requestObject) {
    return;
  }

  const { callAt } = requestObject;

  const logPayload: LogPayload = {
    request: payloadRequest,
    response: payloadResponse,
    callAt,
    latencyInMilliseconds:
      DateTime.now().toMillis() - DateTime.fromISO(callAt).toMillis(),
    environment: logger.environment ?? "development",
  };

  console.log("📦 Sending log payload: ", logPayload);

  const { shouldSkipLog, reason } = logger.shouldSkipLog(logPayload);
  if (shouldSkipLog) {
    if (logger.debug) {
      console.log("!! Skipping log: ", reason);
    }
  } else {
    try {
      await logger.sendLogPayload(logPayload);
      console.log(
        `✅ [${callAt}] - Successfully sent log payload for req to hostname ${payloadRequest.hostname}`
      );
    } catch {
      console.log(
        `✅ [${callAt}] - Failed to send log payload for req to hostname ${payloadRequest.hostname}`
      );
    }
  }
}

const trailrun = (args: {
  projectKey: string;
  ignore?: string[];
  debug?: boolean;
  trailrunApiBaseUrl?: string;
}): void => {
  console.log("⛰️ Initializing trailrun");
  logger = new Logger({ ...args });
  instrumentHTTPTraffic();
  console.log("✅ Initialized trailrun");
};

export { LogPayload, trailrun };
