import { API_BASE_URL } from "../constants";

function getApiBaseUrl(args: { environment: string; inDevelopment: boolean }) {
  const DEV_API_BASEURL = "http://localhost:4000";
  if (args.inDevelopment) {
    return DEV_API_BASEURL;
  }

  return args.environment === "production" ? API_BASE_URL : DEV_API_BASEURL;
}

export { getApiBaseUrl };
