import { post } from "../utils/post";
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

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": postData.length,
        Authorization: `Bearer ${this.developerToken}`,
      },
      timeout: 1000, // in ms
    };

    await post("", options, {
      // use ngrok to test
      loggedCallPayload: this.loggedCallPayload,
      developerToken: this.developerToken,
    });
  }
}

export default TrailrunClient;
