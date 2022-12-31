import { expect, test } from "vitest";
import { transformHeaders } from "../src/utils/headers";

// Edit an assertion and save to see HMR in action

test("transformHeaders", () => {
  const headerOutput = transformHeaders({
    "content-type": "application/json",
    "content-length": "123",
  } as any);

  expect(headerOutput).toBe([
    { fieldName: "content-type", value: "application/json" },
    { fieldName: "content-length", value: "123" },
  ]);
});
