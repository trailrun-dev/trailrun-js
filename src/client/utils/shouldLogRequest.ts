import { hosts } from "../platforms/hosts";

const shouldLogRequest = (input: {
  method: string;
  hostname: string;
  protocol: string;
}): boolean => {
  return (
    hosts.has(input.hostname) &&
    input.protocol === "https:" &&
    input.method === "GET"
  );
};

export { shouldLogRequest };
