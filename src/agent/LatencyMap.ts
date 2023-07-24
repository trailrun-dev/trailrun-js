export class LatencyMap {
	requestResponseMap: Map<string, { callAt: string }> = new Map();

	getRequestResponse(requestId: string) {
		return this.requestResponseMap.get(requestId);
	}

	setRequestResponse(requestId: string, callAt: string) {
		this.requestResponseMap.set(requestId, { callAt });
	}

	clearRequestResponse(requestId: string) {
		this.requestResponseMap.delete(requestId);
	}

	contains(requestId: string) {
		return this.requestResponseMap.has(requestId);
	}
}
