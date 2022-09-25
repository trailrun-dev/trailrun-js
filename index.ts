import https from "https";
import { DateTime } from "luxon";
import shimmer from "shimmer";
import TrailrunClient from "./src/client";
const has = require("has-value");

var trailrunClient: TrailrunClient;

shimmer.wrap(https, "request", function (original) {
  return function (this: any) {
    var req = original.apply(this, arguments as any);
    const { method, headers, hostname, pathname, search } = arguments[0];

    let callAt = DateTime.now();
    trailrunClient.set("request", {
      method,
      headers,
      pathname,
      hostname,
      search,
    });

    let body = "";

    let emit = req.emit;
    req.emit = function (this: any, eventName: any, response: any) {
      switch (eventName) {
        case "response": {
          response.on("data", (d: any) => {
            body += d;
          });

          response.on("end", () => {
            const { statusCode, headers, message } = response;
            trailrunClient.set("response", {
              statusCode,
              headers,
              message,
              body,
            });

            trailrunClient.set("callAt", callAt.toISO());
            trailrunClient.set(
              "latency",
              (DateTime.now().toMillis() - callAt.toMillis()).toString()
            );

            // Send fake request
            trailrunClient.send();
          });
        }
      }
      return emit.apply(this, arguments as any);
    } as any;

    return req;
  };
});

const initializeTrailrunClient = (privateToken: string) => {
  trailrunClient = new TrailrunClient(privateToken);
};

export default initializeTrailrunClient;
