import https from "https";
import shimmer from "shimmer";

shimmer.wrap(https, "request", function (original: typeof https.request) {
  return function (this: any) {
    console.log("Starting request!");
    var returned = original.apply(this, arguments as any) as any;
    console.log("Done setting up request -- OH YEAH!");
    return returned;
  };
});

const initializeFluxClient = (privateToken: string) => {
  console.log(privateToken);
};

export default initializeFluxClient;
