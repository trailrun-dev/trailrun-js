function getApiBaseUrl(env: string) {
  return env === "production"
    ? "https://api.trailrun.dev"
    : "http://localhost:3000";
}

export { getApiBaseUrl };
