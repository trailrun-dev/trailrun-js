export class AgentState {
	requestResponseMap: Map<string, { callAt: string }> = new Map();

	getRequestResponse(requestId: string) {
		return this.requestResponseMap.get(requestId);
	}

	setRequestResponse(requestId: string, callAt: string) {
		this.requestResponseMap.set(requestId, { callAt });
	}
}
