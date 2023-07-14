import { any, number, object, string, z } from 'zod';

const headerSchema = z.record(any());
const bodySchema = z.record(any());

const logPayloadSchema = object({
	request: object({
		method: z.enum(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE', 'TRACE']),
		headers: headerSchema,
		pathname: string(),
		hostname: string(),
		search: string().optional(),
		body: any().optional(),
	}),
	response: object({
		statusCode: number(),
		headers: headerSchema,
		message: string().optional(),
		body: string().optional(),
	}),
	callAt: string(),
	latencyInMilliseconds: number(),
	environment: string(),
});

type LogPayload = z.infer<typeof logPayloadSchema>;
type HeaderObject = z.infer<typeof headerSchema>;

export { logPayloadSchema };
export type { HeaderObject, LogPayload };
