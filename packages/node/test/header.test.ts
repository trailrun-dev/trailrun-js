import { it } from "node:test";
import { expect, test } from "vitest";
import { transformHeaders } from "../src/utils/headers";

// Edit an assertion and save to see HMR in action

test("transformHeaders", () => {
  it("should transform headers", () => {
    const headerOutput = transformHeaders({
      "content-type": "application/json",
      "content-length": "123",
    } as any);

    expect(headerOutput).toStrictEqual([
      { fieldName: "content-type", fieldValue: "application/json" },
      { fieldName: "content-length", fieldValue: "123" },
    ]);
  });
});
