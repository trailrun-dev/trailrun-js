import { fetch } from "cross-fetch";
import { LogPayload } from "./types";
import { getApiUrl } from "./utils/logUrl";

class TrailrunClient {
  logPayload: LogPayload = {} as LogPayload;
  clientSecret: string | null = null;
  env: string = "production";

  constructor(args: { developerToken: string; env: string }) {
    this.clientSecret = args.developerToken;
    this.env = args.env;
  }

  async send() {
    const postData = JSON.stringify(this.logPayload);
    const baseUrl = getApiUrl(this.env);
    return await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": postData.length.toString(),
        Authorization: `Bearer ${this.clientSecret}`,
      },
      body: postData,
    });
  }
}

export default TrailrunClient;
