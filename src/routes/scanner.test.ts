import { describe, expect, it } from "vitest";
import { scanDirectory, scanNestedRoutes } from "./scanner";

describe("Scanner", () => {
	describe("scanDirectory", () => {
		it("should handle non-existent directory gracefully", () => {
			const routes = scanDirectory("/non/existent/path");
			expect(Array.isArray(routes)).toBe(true);
			expect(routes.length).toBe(0);
		});

		it("should handle empty relative path", () => {
			const routes = scanDirectory("/non/existent/path", "");
			expect(Array.isArray(routes)).toBe(true);
		});

		it("should handle nested relative path", () => {
			const routes = scanDirectory("/non/existent/path", "nested/path");
			expect(Array.isArray(routes)).toBe(true);
		});
	});

	describe("scanNestedRoutes", () => {
		it("should handle non-existent routes directory gracefully", () => {
			const result = scanNestedRoutes("/non/existent/routes");

			expect(result).toBeDefined();
			expect(result.nestedRoutesByLayout).toBeInstanceOf(Map);
			expect(result.layoutsByPath).toBeInstanceOf(Map);
			expect(result.nestedRoutesByLayout.size).toBe(0);
			expect(result.layoutsByPath.size).toBe(0);
		});

		it("should return proper structure", () => {
			const result = scanNestedRoutes("/non/existent/routes");

			expect(result).toHaveProperty("nestedRoutesByLayout");
			expect(result).toHaveProperty("layoutsByPath");
			expect(result.nestedRoutesByLayout instanceof Map).toBe(true);
			expect(result.layoutsByPath instanceof Map).toBe(true);
		});
	});
});
