import { API_BASE_URL } from "../constants";

function getApiBaseUrl(env: string) {
  return env === "production" ? API_BASE_URL : "http://localhost:3000";
}

export { getApiBaseUrl };
