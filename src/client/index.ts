import fetch from "isomorphic-unfetch";
import { LoggedCallPayload } from "./types";

class TrailrunClient {
  loggedCallPayload: LoggedCallPayload = {};
  developerToken: string | null = null;

  constructor(developerToken: string) {
    this.developerToken = developerToken;
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
        Authorization: `Bearer ${this.developerToken}`,
      },
      body: postData,
    });
  }
}

export default TrailrunClient;
