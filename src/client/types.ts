type HeaderType = {
  fieldName: string;
  value: string;
}[];

type LoggedCallPayload = {
  request?: {
    method: string;
    headers: HeaderType;
    pathname: string;
    hostname: string;
    search: string | undefined;
  };
  response?: {
    statusCode: number;
    headers: HeaderType;
    message: string;
    body: string | undefined;
  };
  callAt?: string;
  latency?: number;
};

export type { LoggedCallPayload, HeaderType };
