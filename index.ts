import http from "http";
import https from "https";

const initializeFluxClient = (privateToken: string) => {
  console.log(privateToken);
};

function fluxWrapper(httpModule: typeof https) {
  var original = httpModule.request as any;

  httpModule.request = function (options, callback): http.ClientRequest {
    console.log(options);
    return original(options, callback);
  };
}

fluxWrapper(https);

export default initializeFluxClient;
