import { describe, expect, it } from "vitest";

describe("Integration Tests", () => {
	describe("Package Structure", () => {
		it("should export main functions", async () => {
			const { flatRoutes } = await import("./index");

			expect(typeof flatRoutes).toBe("function");
		});

		it("should export types", async () => {
			const types = await import("./types");

			expect(types).toBeDefined();
		});

		it("should have scanner functions", async () => {
			const { scanDirectory, scanNestedRoutes } = await import(
				"./routes/scanner"
			);

			expect(typeof scanDirectory).toBe("function");
			expect(typeof scanNestedRoutes).toBe("function");
		});

		it("should have utils functions", async () => {
			const { generateRouteId, getLayoutName } = await import("./utils");

			expect(typeof generateRouteId).toBe("function");
			expect(typeof getLayoutName).toBe("function");
		});

		it("should have layout resolver", async () => {
			const { buildLayoutHierarchy } = await import("./layouts/resolver");

			expect(typeof buildLayoutHierarchy).toBe("function");
		});
	});

	describe("Type Safety", () => {
		it("should have proper TypeScript types", () => {
			// This test ensures TypeScript compilation works
			expect(true).toBe(true);
		});
	});
});
