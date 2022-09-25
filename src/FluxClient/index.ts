import { LoggedCallPayload } from "./types";

class FluxClient {
  loggedCallPayload: LoggedCallPayload = {};
  developerToken: string | null = null;

  constructor(developerToken: string) {
    this.developerToken = developerToken;
  }

  set(field: keyof LoggedCallPayload, value: any) {
    this.loggedCallPayload[field] = value;
  }

  send() {
    console.log("Sending payload to flux");
    console.log(this.loggedCallPayload);
  }
}

export { FluxClient };
