const normalizeOutgoingHeaders = (headers: globalThis.Headers) => {
  const normalizedHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      normalizedHeaders[key] = value.join(";");
    } else {
      normalizedHeaders[key] = value?.toString() ?? "";
    }
  }

  return normalizedHeaders;
};

function isTrailrunRequest(request: Request) {
  return request.headers.get("X-Trailrun-Client") != null;
}

export { normalizeOutgoingHeaders, isTrailrunRequest };
