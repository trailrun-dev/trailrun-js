import { LogPayload } from "../types";
import { getApiBaseUrl } from "./apiBaseUrl";

async function sendLogPayload(
  logPayload: LogPayload,
  args: {
    environment: string;
    clientSecret: string;
  }
) {
  const postData = JSON.stringify(logPayload);
  const baseUrl = getApiBaseUrl(args.environment);

  return await fetch(`${baseUrl}/ingest`, {
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
