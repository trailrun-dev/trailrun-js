import { number, object, string, z } from "zod";

const headerSchema = z.record(string());
const bodySchema = z.record(string());

const logSchema = object({
  request: object({
    method: z.enum([
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "PATCH",
      "OPTIONS",
      "DELETE",
      "TRACE",
    ]),
    headers: headerSchema,
    pathname: string(),
    hostname: string(),
    search: string().optional(),
    body: bodySchema.optional(),
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
