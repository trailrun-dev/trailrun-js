import { LoggedCallPayload } from "./types";

class TrailrunClient {
  loggedCallPayload: LoggedCallPayload = {};
  clientSecret: string | null = null;

  constructor(developerToken: string) {
    this.clientSecret = developerToken;
  }

  set(field: keyof LoggedCallPayload, value: any) {
    this.loggedCallPayload[field] = value;
  }

  async send() {
    const postData = JSON.stringify(this.loggedCallPayload);
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
