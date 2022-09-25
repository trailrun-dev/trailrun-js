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

  send() {
    // post request to TrailRun
  }
}

export default TrailrunClient;
