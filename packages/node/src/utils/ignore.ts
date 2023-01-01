import { LogPayload } from "../types";

function shouldSkipLog(logPayload: LogPayload, ignoredHostnames: string[]) {
  return (
    logPayload.request.hostname &&
    ignoredHostnames.includes(logPayload.request.hostname)
  );
}

export { shouldSkipLog };
