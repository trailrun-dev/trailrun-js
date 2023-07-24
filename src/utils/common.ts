import { normalizeHeaders } from './headers';
import { readStream, shouldStreamBody } from './stream';

export async function extractBodyAndHeaders(httpMessage: Request | Response) {
	const messageHeaders = normalizeHeaders(httpMessage.headers);
	let messageBody = '';
	const shouldStreamHttpMessage = shouldStreamBody(messageHeaders['content-type']);
	if (httpMessage.body && shouldStreamHttpMessage) {
		messageBody = await readStream(
			httpMessage.body.getReader(),
			messageHeaders['content-encoding'],
		);
	}

	return {
		body: messageBody,
		headers: messageHeaders,
	};
}
