type HeaderType = {
  fieldName: string;
  value: string;
}[];

type LogPayload = {
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

export type { LogPayload, HeaderType };
