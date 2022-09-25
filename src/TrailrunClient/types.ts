type LoggedCallPayload = {
  request?: {
    method: string;
    headers: string;
    pathname: string;
    hostname: string;
    search: string | undefined;
  };
  response?: {
    statusCode: string;
    headers: string;
    message: string;
    body: string;
  };
  callAt?: string;
  latency?: string;
};

export type { LoggedCallPayload };
