import https from "https";
import shimmer from "shimmer";

shimmer.wrap(https, "request", (original) => {
  return () => {
    console.log("Starting request!");
    var returned = original.apply(this, original.arguments);
    console.log("Done setting up request -- OH YEAH!");
    return returned;
  };
});

const initializeFluxClient = (privateToken: string) => {
  console.log(privateToken);
};

export default initializeFluxClient;
