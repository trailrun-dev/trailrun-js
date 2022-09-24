type LoggedCallPayload = {
  request?: {
    method: string;
    headers: string;
    pathname: string;
    hostname: string;
  };
  response?: {
    statusCode: string;
    headers: string;
    message: string;
  };
  responseTime?: string;
};

export type { LoggedCallPayload };
