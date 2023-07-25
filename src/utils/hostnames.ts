export const shouldIgnoreHostname = (hostname: string, ignoredHostnames: string[]): boolean => {
	return ignoredHostnames.some((pattern) => {
		const regex = new RegExp(pattern);
		return regex.test(hostname);
	});
};
