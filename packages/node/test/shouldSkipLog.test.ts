import { describe, expect, it } from "vitest";
import { Logger } from "../src/logger";

describe("shouldSkipLog", () => {
  it("should ignore a hostname if specified", () => {
    const logger = new Logger({
      projectKey: "test",
      ignoredHostnames: ["api.stripe.com"],
    });

    const logPayload = {
      request: {
        hostname: "api.stripe.com",
      },
    } as any;

    expect(logger.shouldSkipLog(logPayload)).toBe(true);
  });

  it("should not ignore a hostname unless specified", () => {
    const logger = new Logger({
      projectKey: "test",
      ignoredHostnames: ["api.stripe.com"],
    });

    const logPayload = {
      request: {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "User-Agent": "axios/0.27.2",
        },
        pathname: "/",
        hostname: "api.github.com",
      },
      response: {
        statusCode: 200,
        headers: {
          server: "GitHub.com",
          date: "Mon, 02 Jan 2023 04:15:04 GMT",
          "content-type": "application/json; charset=utf-8",
          "cache-control": "public, max-age=60, s-maxage=60",
        },
        body: '{"current_user_url":"https://api.github.com/user","user_search_url":"https://api.github.com/search/users?q={query}{&page,per_page,sort,order}"}',
      },
      callAt: "2023-01-01T23:15:08.784-05:00",
      latencyInMilliseconds: 123,
      environment: "development",
    } as any;

    expect(logger.shouldSkipLog(logPayload)).toBe(false);
  });
});
