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

export { normalizeOutgoingHeaders };
