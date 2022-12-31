import { HeaderObject } from "../types";

const transformHeaders = (headers: { [key: string]: string }) => {
  let headersArray: HeaderObject = [];
  for (const [key, value] of Object.entries(headers)) {
    headersArray.push({ fieldName: key, fieldValue: value });
  }
  return headersArray;
};

export { transformHeaders };
