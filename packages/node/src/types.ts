import { number, object, string, z } from "zod";

const headerSchema = object({
  fieldName: string(),
  fieldValue: string(),
}).array();

const logSchema = object({
  request: object({
    method: string(),
    headers: headerSchema,
    pathname: string(),
    hostname: string(),
    search: string().optional(),
  }),
  response: object({
    statusCode: number(),
    headers: headerSchema,
    message: string(),
    body: string().optional(),
  }),
  callAt: string(),
  latencyInMilliseconds: number(),
});

type LogPayload = z.infer<typeof logSchema>;
type HeaderObject = z.infer<typeof headerSchema>;

export type { LogPayload, HeaderObject };
export { logSchema };
