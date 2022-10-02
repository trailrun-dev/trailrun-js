import { InteractiveIsomorphicRequest } from "@mswjs/interceptors/src";

type HeaderType = {
  [key: string]: string;
};

const transformHeaders = (headers: InteractiveIsomorphicRequest["headers"]) => {
  let headersObj: { [key: string]: string } = {};
  headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  return headersObj;
};

export type { HeaderType };
export { transformHeaders };
