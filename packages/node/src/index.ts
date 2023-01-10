import https from "https";
import { DateTime } from "luxon";
import shimmer from "shimmer";
import { Logger } from "./logger";
import { LogPayload } from "./types";

var logger: Logger;

shimmer.wrap(https, "request", function (original) {
  let logPayload = {} as LogPayload;

  return function (this: any) {
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

                if (!logger.shouldSkipLog(logPayload)) {
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
  logger = new Logger({
    projectKey: args.projectKey,
    ignoredHostnames: args.ignore,
    debug: args.debug,
    trailrunApiBaseUrl: args.trailrunApiBaseUrl,
  });
};

export { LogPayload, trailrun };
