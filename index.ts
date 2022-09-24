import https from "https";
import shimmer from "shimmer";
const has = require("has-value");

shimmer.wrap(https, "request", function (original) {
  return function (this: any) {
    var req = original.apply(this, arguments as any);

    const { method, headers, hostname, pathname } = arguments[0];
    let fluxPayload = {
      request: {
        method,
        headers,
        pathname,
        hostname,
      },
      response: {},
    };

    let emit = req.emit;
    req.emit = function (this: any, eventName: any, response: any) {
      switch (eventName) {
        case "response": {
          response.on("end", () => {
            const { statusCode, headers, message } = response;

            fluxPayload.response = {
              statusCode,
              headers,
              message,
            };

            console.log("fluxPayload", fluxPayload);
          });
        }
      }
      return emit.apply(this, arguments as any);
    } as any;

    return req;
  };
});

const initializeFluxClient = (privateToken: string) => {
  console.log(privateToken);
};

export default initializeFluxClient;
