import https from "https";
import { DateTime } from "luxon";
import shimmer from "shimmer";
import { FluxClient } from "./src";
const has = require("has-value");

var fluxClient: FluxClient;

shimmer.wrap(https, "request", function (original) {
  return function (this: any) {
    var req = original.apply(this, arguments as any);
    const { method, headers, hostname, pathname, search } = arguments[0];

    let callAt = DateTime.now();
    fluxClient.set("request", {
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
            fluxClient.set("response", {
              statusCode,
              headers,
              message,
              body,
            });

            fluxClient.set("callAt", callAt.toISO());
            fluxClient.set(
              "latency",
              (DateTime.now().toMillis() - callAt.toMillis()).toString()
            );

            // Send fake request
            fluxClient.send();
          });
        }
      }
      return emit.apply(this, arguments as any);
    } as any;

    return req;
  };
});

const initializeFluxClient = (privateToken: string) => {
  fluxClient = new FluxClient(privateToken);
};

export default initializeFluxClient;
