function getApiUrl(env: string) {
  if (env === "production") {
    return "https://api.trailrun.dev";
  }

  return "http://localhost:3000";
}

export { getApiUrl };
