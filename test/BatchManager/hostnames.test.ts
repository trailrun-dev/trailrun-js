import { describe, expect, test } from 'vitest';
import { shouldIgnoreHostname } from '../../src/utils/hostnames';

describe('shouldIgnoreHostname works correctly', () => {
	const ignoredHostnames = ['^test.*', '.*\\.com$', '^foo\\.'];

	test('should ignore hostname starting with test', () => {
		const hostname = 'test.example.org';
		const result = shouldIgnoreHostname(hostname, ignoredHostnames);
		expect(result).toBe(true);
	});

	test('should ignore hostname ending with .com', () => {
		const hostname = 'example.com';
		const result = shouldIgnoreHostname(hostname, ignoredHostnames);
		expect(result).toBe(true);
	});

	test('should ignore hostname starting with foo.', () => {
		const hostname = 'foo.example.org';
		const result = shouldIgnoreHostname(hostname, ignoredHostnames);
		expect(result).toBe(true);
	});

	test('should ignore hostname with full hostname matching pattern', () => {
		const hostname = 'test.example.com';
		const result = shouldIgnoreHostname(hostname, ['test.example.com']);
		expect(result).toBe(true);
	});

	test('should not ignore hostname that does not match any pattern', () => {
		const hostname = 'example.org';
		const result = shouldIgnoreHostname(hostname, ignoredHostnames);
		expect(result).toBe(false);
	});
});
