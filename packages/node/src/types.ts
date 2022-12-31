import { number, object, string, z } from "zod";

const headerSchema = object({
  fieldName: string(),
  fieldValue: string(),
}).array();

const logSchema = object({
  version: z.enum(["0"]),
  request: object({
    method: string(),
    headers: headerSchema,
    pathname: string(),
    hostname: string(),
    search: string().optional(),
  }).optional(),
  response: object({
    statusCode: number(),
    headers: headerSchema,
    message: string(),
    body: string().optional(),
  }).optional(),
  callAt: string().optional(),
  latency: number().optional(),
});

type LogPayload = z.infer<typeof logSchema>;
type HeaderObject = z.infer<typeof headerSchema>;

export type { LogPayload, HeaderObject };
export { logSchema };
