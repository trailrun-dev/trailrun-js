import { fetch } from "cross-fetch";
import { LogPayload } from "./types";

class TrailrunClient {
  logPayload: LogPayload = {} as LogPayload;
  clientSecret: string | null = null;

  constructor(developerToken: string) {
    this.clientSecret = developerToken;
  }

  async send() {
    const postData = JSON.stringify(this.logPayload);
    return await fetch("http://localhost:3000/ingest", {
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
