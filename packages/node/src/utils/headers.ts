import { Headers } from "node-fetch";

const normalizeOutgoingHeaders = (
  headers: Record<string, string | number | (string | number)[] | undefined>
) => {
  const normalizedHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      normalizedHeaders[key] = value.join(", ");
    } else {
      normalizedHeaders[key] = value?.toString() ?? "";
    }
  }

  return normalizedHeaders;
};

function normalizeOutgoingHeaders1(
  outgoingHeaders: Headers | undefined
): Headers {
  if (!outgoingHeaders) {
    return new Headers();
  }

  const headers = new Headers();
  for (const [headerName, headerValue] of Object.entries(outgoingHeaders)) {
    if (!headerValue) {
      continue;
    }

    headers.set(headerName.toLowerCase(), headerValue.toString());
  }

  return headers;
}

export { normalizeOutgoingHeaders };
