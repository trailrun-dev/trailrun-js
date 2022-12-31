const shouldLogRequest = (input: {
  method: string;
  hostname: string;
  protocol: string;
}): boolean => {
  return true;
};

export { shouldLogRequest };
