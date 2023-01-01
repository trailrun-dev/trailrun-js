import { expect, it, test } from "vitest";
import { shouldSkipLog } from "../src/utils/ignore";

test("shouldSkipLog", () => {
  it("should ignore certain hostnames", () => {
    const logPayload = {
      hostname: "api.stripe.com",
    } as any;

    const ignoredHostnames = ["api.stripe.com"];

    expect(shouldSkipLog(logPayload, ignoredHostnames)).toBe(true);
  });

  it("should not ignore certain hostnames", () => {
    const logPayload = {
      hostname: "api.openai.com",
    } as any;

    const ignoredHostnames = ["api.stripe.com"];

    expect(shouldSkipLog(logPayload, ignoredHostnames)).toBe(false);
  });
});
