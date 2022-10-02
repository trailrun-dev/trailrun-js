import { BatchInterceptor } from "@mswjs/interceptors";
import { ClientRequestInterceptor } from "@mswjs/interceptors/lib/interceptors/ClientRequest";
import { FetchInterceptor } from "@mswjs/interceptors/lib/interceptors/Fetch";
import { XMLHttpRequestInterceptor } from "@mswjs/interceptors/lib/interceptors/XMLHttpRequest";
import { DateTime } from "luxon";
import TrailrunClient from "./src/client";
import { transformHeaders } from "./src/utils/headers";

var trailrunClient: TrailrunClient;
const interceptor = new BatchInterceptor({
  name: "trailrun-interceptor",
  interceptors: [
    new ClientRequestInterceptor(),
    new XMLHttpRequestInterceptor(),
    new FetchInterceptor(),
  ],
});

let lastCallDateTime: DateTime;

interceptor.on("request", (request) => {
  const { url, method, headers } = request;

  if (request.url.protocol !== "https:") {
    return;
  }

  lastCallDateTime = DateTime.now();
  trailrunClient.loggedCallPayload.callAt = lastCallDateTime.toISO();

  trailrunClient.loggedCallPayload.request = {
    method,
    headers: transformHeaders(headers),
    pathname: url.pathname,
    hostname: url.hostname,
    search: url.search,
  };
});

interceptor.on("response", (request, response) => {
  const { headers, body, status, statusText } = response;
  trailrunClient.loggedCallPayload.response = {
    statusCode: status.toString(),
    headers: transformHeaders(headers),
    message: statusText,
    body: body,
  };

  trailrunClient.loggedCallPayload.latency = (
    DateTime.now().toMillis() - lastCallDateTime.toMillis()
  ).toString();
  // Send fake request
  trailrunClient.send();
});

const initializeTrailrunClient = (privateToken: string) => {
  interceptor.apply();
  trailrunClient = new TrailrunClient(privateToken);
};

export default initializeTrailrunClient;
