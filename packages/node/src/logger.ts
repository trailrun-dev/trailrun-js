import { fetch } from "cross-fetch";
import { API_BASE_URL } from "./constants";
import { LogPayload, logSchema } from "./types";

class Logger {
  public projectKey: string | undefined;
  public environment = process.env.NODE_ENV || "development";
  public ignoredHostnames: string[] = [];
  public debug = false;
  public trailrunApiBaseUrl = API_BASE_URL;

  constructor(args: {
    projectKey?: string;
    ignoredHostnames?: string[];
    debug?: boolean;
    trailrunApiBaseUrl?: string;
  }) {
    this.projectKey = args.projectKey;
    this.ignoredHostnames = args.ignoredHostnames || [];
    this.debug = args.debug || false;
    this.trailrunApiBaseUrl = args.trailrunApiBaseUrl || API_BASE_URL;
  }

  public shouldSkipLog(logPayload: LogPayload) {
    // Skip logging if the schema validation fails
    const schemaParseResult = logSchema.safeParse(logPayload);
    if (schemaParseResult.success) {
      return true;
    } else {
      if (this.debug) {
        console.log("Payload schema is invalid", schemaParseResult.error);
      }
    }

    // Skip logging if the project key is undefined
    if (!this.projectKey) {
      if (this.debug) {
        console.log("Project key is undefined");
      }
      return true;
    }

    // Skip logging if the hostname is in the ignored list
    if (
      logPayload.request.hostname &&
      this.ignoredHostnames.includes(logPayload.request.hostname)
    ) {
      if (this.debug) {
        console.log(
          `Hostname ${logPayload.request.hostname} is in the ignored list`
        );
      }
      return true;
    }

    return false;
  }

  /*
    /**
     * Method sends a log payload to the ingestion API
     *
     * @remarks
     * Skips sending the log payload if
     * - the project key is undefined
     * - schema validation fails
     *
     * @param clientEnvironment - Context of the client
     * @param projectKey - The project key for the application
     * @param inDevelopment - Whether the client is being worked on
     * @returns The arithmetic mean of `x` and `y`
  */
  public async sendLogPayload(logPayload: LogPayload) {
    const postData = JSON.stringify(logPayload);

    return fetch(`${this.trailrunApiBaseUrl}/v1/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": postData.length.toString(),
        Authorization: `Bearer ${this.projectKey}`,
      },
      body: postData,
    });
  }
}

export { Logger };
