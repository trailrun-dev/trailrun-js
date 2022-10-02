import { HeaderType } from "../utils/headers";

type LoggedCallPayload = {
  request?: {
    method: string;
    headers: HeaderType;
    pathname: string;
    hostname: string;
    search: string | undefined;
  };
  response?: {
    statusCode: string;
    headers: HeaderType;
    message: string;
    body: string | undefined;
  };
  callAt?: string;
  latency?: string;
};

export type { LoggedCallPayload };
