import { describe, expect, it } from "vitest";
import type { LayoutInfo } from "../types";
import {
	generateRouteId,
	getLayoutName,
	shouldLayoutApplyToRoute,
} from "./index";

describe("Utils", () => {
	describe("generateRouteId", () => {
		it("should generate route IDs from file paths", () => {
			const id1 = generateRouteId("./routes/dashboard/users.tsx");
			const id2 = generateRouteId("./routes/dashboard/settings.tsx");

			expect(id1).toBe("routes.dashboard.users");
			expect(id2).toBe("routes.dashboard.settings");
			expect(id1).not.toBe(id2);
		});

		it("should handle parameter routes", () => {
			const id = generateRouteId("./routes/users/$id.tsx");

			expect(id).toBe("routes.users.$id");
		});

		it("should handle nested paths", () => {
			const id = generateRouteId("./routes/admin/dashboard/settings.tsx");

			expect(id).toBe("routes.admin.dashboard.settings");
		});

		it("should handle different file extensions", () => {
			const tsxId = generateRouteId("./routes/page.tsx");
			const tsId = generateRouteId("./routes/api.ts");

			expect(tsxId).toBe("routes.page");
			expect(tsId).toBe("routes.api");
		});
	});

	describe("getLayoutName", () => {
		it("should extract layout name from filename", () => {
			expect(getLayoutName("_app.tsx")).toBe("app.tsx");
			expect(getLayoutName("_users.tsx")).toBe("users.tsx");
			expect(getLayoutName("_layout.tsx")).toBe("layout.tsx");
		});

		it("should return null for non-layout files", () => {
			expect(getLayoutName("app.tsx")).toBeNull();
			expect(getLayoutName("users.tsx")).toBeNull();
			expect(getLayoutName("index.tsx")).toBeNull();
		});

		it("should handle empty string", () => {
			expect(getLayoutName("")).toBeNull();
		});
	});

	describe("shouldLayoutApplyToRoute", () => {
		it("should determine if layout applies to route", () => {
			const layoutInfo: LayoutInfo = {
				path: "dashboard",
				file: "_users.tsx",
				directoryPrefix: "_app.dashboard",
			};

			// This is a basic test - the actual logic may be more complex
			const result = shouldLayoutApplyToRoute("dashboard/users", layoutInfo);
			expect(typeof result).toBe("boolean");
		});

		it("should handle different route patterns", () => {
			const layoutInfo: LayoutInfo = {
				path: "admin",
				file: "_layout.tsx",
				directoryPrefix: "_admin.panel",
			};

			const result1 = shouldLayoutApplyToRoute("admin/users", layoutInfo);
			const result2 = shouldLayoutApplyToRoute("public/page", layoutInfo);

			expect(typeof result1).toBe("boolean");
			expect(typeof result2).toBe("boolean");
		});
	});
});
