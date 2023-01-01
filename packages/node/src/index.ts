import https from "https";
import { DateTime } from "luxon";
import shimmer from "shimmer";
import { LogPayload } from "./types";
import { transformHeaders } from "./utils/headers";
import { sendLogPayload } from "./utils/sendLogPayload";

let clientSecret = "production";

shimmer.wrap(https, "request", function (original) {
  let logPayload = {} as LogPayload;

  return function (this: any) {
    var req = original.apply(this, arguments as any);
    try {
      const { method, headers, hostname, pathname, search } = arguments[0];

      let callAt = DateTime.now();
      logPayload.request = {
        method,
        headers: transformHeaders(headers),
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
                  headers: transformHeaders(headers),
                  message,
                  body,
                };

                logPayload.callAt = callAt.toISO();
                logPayload.latencyInMilliseconds =
                  DateTime.now().toMillis() - callAt.toMillis();

                sendLogPayload(logPayload, {
                  environment: "production",
                  clientSecret: clientSecret,
                });
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

const initializeTrailrun = (args: { clientSecret: string }) => {
  clientSecret = args.clientSecret;
  return true;
};

export { LogPayload, initializeTrailrun };
