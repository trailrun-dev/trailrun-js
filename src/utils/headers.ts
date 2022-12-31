import { InteractiveIsomorphicRequest } from "@mswjs/interceptors/src";
import { HeaderType } from "../client/types";

const transformHeaders = (headers: InteractiveIsomorphicRequest["headers"]) => {
  let headersArray: HeaderType = [];
  headers.forEach((value, key) => {
    headersArray.push({ fieldName: key, value: value });
  });
  return headersArray;
};

export { transformHeaders };
