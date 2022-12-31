import https from "https";
import { DateTime } from "luxon";
import shimmer from "shimmer";
import TrailrunClient from "./client";
import { LogPayload } from "./types";
import { transformHeaders } from "./utils/headers";

var trailrunClient: TrailrunClient;
shimmer.wrap(https, "request", function (original) {
  return function (this: any) {
    var req = original.apply(this, arguments as any);
    try {
      const { method, headers, hostname, pathname, search, protocol } =
        arguments[0];

      let callAt = DateTime.now();
      trailrunClient.logPayload.request = {
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
                trailrunClient.logPayload.response = {
                  statusCode,
                  headers: transformHeaders(headers),
                  message,
                  body,
                };

                trailrunClient.logPayload.callAt = callAt.toISO();
                trailrunClient.logPayload.latency =
                  DateTime.now().toMillis() - callAt.toMillis();

                trailrunClient.send();
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

const initializeTrailrunClient = (args: { clientSecret: string }) => {
  trailrunClient = new TrailrunClient(args.clientSecret);
};

export { LogPayload, initializeTrailrunClient };
