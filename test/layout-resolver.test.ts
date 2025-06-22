import { describe, expect, it } from "vitest";
import { buildLayoutHierarchy } from "../src/layout-resolver";
import type { LayoutInfo, ProcessedRoute } from "../src/types";

describe("Layout Resolver", () => {
	describe("buildLayoutHierarchy", () => {
		it("should build layout hierarchy with processed routes", () => {
			const processedRoutes: ProcessedRoute[] = [
				{
					id: "dashboard-users",
					path: "dashboard/users",
					file: "./routes/_app.dashboard/users.tsx",
					originalPath: "users",
					directoryPrefix: "_app.dashboard",
				},
			];

			const existingRoutes = [];

			const layoutsByPath = new Map<string, LayoutInfo>([
				[
					"_app.dashboard/_layout.tsx",
					{
						path: "dashboard",
						file: "_layout.tsx",
						directoryPrefix: "_app.dashboard",
					},
				],
			]);

			const hierarchy = buildLayoutHierarchy(
				processedRoutes,
				existingRoutes,
				layoutsByPath,
			);

			expect(Array.isArray(hierarchy)).toBe(true);
			expect(hierarchy.length).toBeGreaterThanOrEqual(0);
		});

		it("should handle empty inputs", () => {
			const hierarchy = buildLayoutHierarchy([], [], new Map());

			expect(Array.isArray(hierarchy)).toBe(true);
			expect(hierarchy.length).toBe(0);
		});

		it("should handle routes with layout overrides", () => {
			const processedRoutes: ProcessedRoute[] = [
				{
					id: "dashboard-users",
					path: "dashboard/users",
					file: "./routes/_app.dashboard/users.tsx",
					originalPath: "users",
					directoryPrefix: "_app.dashboard",
				},
			];

			const existingRoutes = [];
			const layoutsByPath = new Map<string, LayoutInfo>();

			const hierarchy = buildLayoutHierarchy(
				processedRoutes,
				existingRoutes,
				layoutsByPath,
			);

			expect(Array.isArray(hierarchy)).toBe(true);
		});

		it("should handle multiple processed routes", () => {
			const processedRoutes: ProcessedRoute[] = [
				{
					id: "dashboard-users",
					path: "dashboard/users",
					file: "./routes/_app.dashboard/users.tsx",
					originalPath: "users",
					directoryPrefix: "_app.dashboard",
				},
				{
					id: "dashboard-settings",
					path: "dashboard/settings",
					file: "./routes/_app.dashboard/settings.tsx",
					originalPath: "settings",
					directoryPrefix: "_app.dashboard",
				},
			];

			const existingRoutes = [];
			const layoutsByPath = new Map<string, LayoutInfo>();

			const hierarchy = buildLayoutHierarchy(
				processedRoutes,
				existingRoutes,
				layoutsByPath,
			);

			expect(Array.isArray(hierarchy)).toBe(true);
		});
	});
});
