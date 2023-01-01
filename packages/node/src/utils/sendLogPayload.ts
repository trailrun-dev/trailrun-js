import { LogPayload, logSchema } from "../types";
import { getApiBaseUrl } from "./apiBaseUrl";

async function sendLogPayload(
  logPayload: LogPayload,
  args: {
    environment: string;
    clientSecret: string;
  }
) {
  if (logSchema.safeParse(logPayload).success) {
    return Promise.resolve();
  }

  const postData = JSON.stringify(logPayload);
  const baseUrl = getApiBaseUrl(args.environment);

  return fetch(`${baseUrl}/ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": postData.length.toString(),
      Authorization: `Bearer ${args.clientSecret}`,
    },
    body: postData,
  });
}

export { sendLogPayload };
