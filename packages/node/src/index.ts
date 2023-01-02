import https from "https";
import { DateTime } from "luxon";
import shimmer from "shimmer";
import { LogPayload } from "./types";
import { shouldSkipLog } from "./utils/ignore";
import { sendLogPayload } from "./utils/sendLogPayload";

let projectKey: string | undefined;
let environment = process.env.NODE_ENV || "development";
let ignoredHostnames: string[] = [];
let debug = false;

shimmer.wrap(https, "request", function (original) {
  let logPayload = {} as LogPayload;

  return function (this: any) {
    var req = original.apply(this, arguments as any);
    try {
      const { method, headers, hostname, pathname, search } = arguments[0];

      let callAt = DateTime.now();
      logPayload.request = {
        method,
        headers,
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
                  headers,
                  message,
                  body,
                };

                logPayload.callAt = callAt.toISO();
                logPayload.latencyInMilliseconds =
                  DateTime.now().toMillis() - callAt.toMillis();
                logPayload.environment = environment;

                if (!shouldSkipLog(logPayload, ignoredHostnames)) {
                  sendLogPayload(logPayload, {
                    environment,
                    projectKey,
                    debug,
                  })
                    .then((r) => {
                      if (debug) {
                        console.log(r);
                      }
                    })
                    .catch((e) => {
                      if (debug) {
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

const initializeTrailrun = (args: {
  projectKey: string;
  ignore?: string[];
  debug?: boolean;
  inDevelopment?: boolean;
}): void => {
  projectKey = args.projectKey;
  ignoredHostnames = args.ignore || [];
  debug = args.debug || false;
};

export { LogPayload, initializeTrailrun };
