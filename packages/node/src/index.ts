import https from "https";
import { DateTime } from "luxon";
import shimmer from "shimmer";
import { Logger } from "./logger";
import { LogPayload } from "./types";
import { normalizeOutgoingHeaders } from "./utils/headers";

var logger: Logger;

shimmer.wrap(https, "request", function (original) {
  let logPayload = {} as LogPayload;

  return function (this: typeof original) {
    var req = original.apply(this, arguments as any);
    try {
      const { method, headers, hostname, pathname, search } = arguments[0];

      let callAt = DateTime.now();
      logPayload.request = {
        method,
        headers: normalizeOutgoingHeaders(headers),
        pathname,
        hostname,
        search,
      };

      let body = "";

      const emit = req.emit;
      req.emit = function (this: any, eventName: any, response: any) {
        try {
          switch (eventName) {
            case "response": {
              response.on("data", (d: any) => {
                body += d;
              });

              response.on("end", () => {
                const { statusCode, headers, message } = response;
                logPayload.response = {
                  statusCode,
                  headers: headers,
                  message,
                  body,
                };

                logPayload.callAt = callAt.toISO();
                logPayload.latencyInMilliseconds =
                  DateTime.now().toMillis() - callAt.toMillis();
                logPayload.environment = this.environment ?? "development";

                const { shouldSkipLog, reason } =
                  logger.shouldSkipLog(logPayload);
                if (shouldSkipLog) {
                  if (logger.debug) {
                    console.log("‼️ Skipping log: ", reason);
                  }
                } else {
                  logger
                    .sendLogPayload(logPayload)
                    .then(() => {
                      console.log(
                        `✅ [${callAt}] Sent log payload for req to hostname ${hostname}}`
                      );
                    })
                    .catch(() => {
                      console.log(
                        `✅ [${callAt}] Failed to send log payload for req to hostname ${hostname}}`
                      );
                    });
                }
              });
            }
          }
        } catch {} // silently fail
        return emit.apply(this, arguments as any);
      } as any;
      return req;
    } catch {
      return req;
    }
  };
});

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
