import { HeaderType } from "../types";

const transformHeaders = (headers: { [key: string]: string }) => {
  let headersArray: HeaderType = [];
  for (const [key, value] of Object.entries(headers)) {
    headersArray.push({ fieldName: key, value: value });
  }
  return headersArray;
};

export { transformHeaders };
