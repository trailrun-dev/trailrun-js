import { API_BASE_URL } from "./constants";
import { LogPayload, logSchema } from "./types";

class Logger {
  public projectKey: string | undefined;
  public environment = process.env.NODE_ENV || "development";
  public ignoredHostnames: string[] = [];
  public debug = false;

  constructor(args: {
    projectKey?: string;
    ignoredHostnames?: string[];
    debug?: boolean;
  }) {
    this.projectKey = args.projectKey;
    this.ignoredHostnames = args.ignoredHostnames || [];
    this.debug = args.debug || false;
  }

  public shouldSkipLog(logPayload: LogPayload) {
    // Skip logging if the schema validation fails
    if (logSchema.safeParse(logPayload).success) {
      return true;
    }

    // Skip logging if the project key is undefined
    if (!this.projectKey) {
      return true;
    }

    // Skip logging if the hostname is in the ignored list
    if (
      logPayload.request.hostname &&
      this.ignoredHostnames.includes(logPayload.request.hostname)
    ) {
      return true;
    }

    return false;
  }

  private getApiBaseUrl() {
    const DEV_API_BASEURL = "http://localhost:4000";
    if (this.debug) {
      return DEV_API_BASEURL;
    }

    return this.environment === "production" ? API_BASE_URL : DEV_API_BASEURL;
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
    const baseUrl = this.getApiBaseUrl();

    return fetch(`${baseUrl}/v1/ingest`, {
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
