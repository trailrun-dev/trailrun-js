import https from "https";
import shimmer from "shimmer";
import { FluxClient } from "./src";
const has = require("has-value");

var fluxClient: FluxClient;

shimmer.wrap(https, "request", function (original) {
  return function (this: any) {
    var req = original.apply(this, arguments as any);
    const { method, headers, hostname, pathname } = arguments[0];
    fluxClient.set("request", {
      method,
      headers,
      pathname,
      hostname,
    });

    let emit = req.emit;
    req.emit = function (this: any, eventName: any, response: any) {
      switch (eventName) {
        case "response": {
          response.on("end", () => {
            const { statusCode, headers, message } = response;
            fluxClient.set("response", {
              statusCode,
              headers,
              message,
            });
            fluxClient.set("responseTime", Date().toString());

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
