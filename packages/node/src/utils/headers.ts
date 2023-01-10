const normalizeOutgoingHeaders = (
  headers: Record<string, string | string[] | undefined>
) => {
  const normalizedHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      normalizedHeaders[key] = value.join(", ");
    } else {
      normalizedHeaders[key] = value ?? "";
    }
  }

  return normalizedHeaders;
};
