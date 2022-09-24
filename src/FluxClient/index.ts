import https from "https";
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
    https
      .get("https://jsonplaceholder.typicode.com/todos/1", (res) => {
        res.on("data", (d) => {
          process.stdout.write(d);
        });
      })
      .on("error", (e) => {
        console.error(e);
      });
  }
}

export { FluxClient };
