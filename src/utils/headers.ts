export function normalizeHeaders(headers: Headers) {
	let headersObject: any = {};

	for (let pair of headers.entries()) {
		headersObject[pair[0]] = pair[1];
	}

	return headersObject;
}

export function isTrailrunRequest(request: Request) {
	return request.headers.get('X-Trailrun-Client') != null;
}
