import { BatchInterceptor } from "@mswjs/interceptors";
import nodeInterceptors from "@mswjs/interceptors/lib/presets/node";
import { InteractiveRequest } from "@mswjs/interceptors/lib/utils/toInteractiveRequest";
import { DateTime } from "luxon";
import { Headers } from "node-fetch";
import { Logger } from "./logger";
import { LogPayload } from "./types";
import { normalizeOutgoingHeaders } from "./utils/headers";

var logger: Logger;

// RequestID -> LogPayload
const requestResponseMap = new Map<string, LogPayload["request"]>();

function instrumentHTTPTraffic() {
  const interceptor = new BatchInterceptor({
    name: "trailrun-interceptor",
    interceptors: nodeInterceptors,
  });

  interceptor.on("request", _handleHttpRequest);

  interceptor.on("response", _handleHttpResponse);

  interceptor.apply();
}

// const { shouldSkipLog, reason } =
//   logger.shouldSkipLog(logPayload);
// if (shouldSkipLog) {
//   if (logger.debug) {
//     console.log("‼️ Skipping log: ", reason);
//   }
// } else {
//   logger
//     .sendLogPayload(logPayload)
//     .then(() => {
//       console.log(
//         `✅ [${callAt}] Sent log payload for req to hostname ${hostname}}`
//       );
//     })
//     .catch(() => {
//       console.log(
//         `✅ [${callAt}] Failed to send log payload for req to hostname ${hostname}}`
//       );
//     });
// }

async function _handleHttpRequest(
  request: InteractiveRequest,
  requestId: string
): Promise<void> {
  try {
    let requestBody = "";
    if (request.body && request.bodyUsed) {
      requestBody = await streamToString(request.body.getReader());
    }

    const urlInterface = new URL(request.url);

    const payloadRequest: LogPayload["request"] = {
      method: request.method.toString() as LogPayload["request"]["method"],
      hostname: urlInterface.hostname,
      headers: normalizeOutgoingHeaders(request.headers as Headers),
      body: requestBody,
      callAt: DateTime.now().toISO(),
      search: urlInterface.search,
      pathname: urlInterface.pathname,
    };

    requestResponseMap.set(requestId, payloadRequest);
  } catch (e) {
    if (logger.debug) {
      console.log(e);
    }
  }
}

async function _handleHttpResponse(
  response: Response,
  request: Request,
  requestId: string
): Promise<void> {
  let responseBody = "";
  if (response.body && response.bodyUsed) {
    responseBody = await streamToString(response.body.getReader());
  }

  const responseEvent: LogPayload["response"] = {
    message: response.statusText,
    body: responseBody,
    headers: response.headers,
    statusCode: response.status,
  };

  const requestObject: LogPayload["request"] | undefined =
    requestResponseMap.get(requestId);

  if (!requestObject) {
    return;
  }

  const logPayload: LogPayload = {
    request: requestObject,
    response: responseEvent,
    callAt: callAt.toISO(),
    latencyInMilliseconds: DateTime.now().toMillis() - callAt.toMillis(),
    environment: logger.environment ?? "development",
  };

  if (logger.shouldSkipLog(logPayload)) {
    logger
      .sendLogPayload(logPayload)
      .then((r) => {
        if (logger.debug) {
          console.log(r);
        }
      })
      .catch((e) => {
        if (logger.debug) {
          console.log(e);
        }
      });
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
  console.log("✅ Initialized trailrun");
};

export { LogPayload, trailrun };
