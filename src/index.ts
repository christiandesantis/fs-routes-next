import type { RouteConfig, RouteConfigEntry } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";
import { join } from "path";

import { buildLayoutHierarchy } from "./layouts/resolver";
import { scanNestedRoutes } from "./routes/scanner";

/**
 * Enhanced file-based routing for React Router with support for:
 * - Nested directories and files
 * - Automatic layout inheritance
 * - Layout overrides at any nesting level
 * - Pathless layouts for root-level overrides
 *
 * @returns Promise<RouteConfig> - Enhanced route configuration
 */
const enhancedFlatRoutes = async (): Promise<RouteConfig> => {
	const standardRoutes = await flatRoutes();
	const routesDir = join(process.cwd(), "app/routes");

	// Scan for nested routes and layouts
	const { nestedRoutesByLayout, layoutsByPath } = scanNestedRoutes(routesDir);

	// Function to recursively find and enhance layout routes
	const enhanceRoutes = (routes: RouteConfigEntry[]): RouteConfigEntry[] => {
		return routes.map((routeConfig) => {
			// Check if this route has children (process them recursively)
			if (routeConfig.children) {
				routeConfig.children = enhanceRoutes(routeConfig.children);
			}

			// Check if this is a layout route that should get additional nested routes
			if (routeConfig.file) {
				const layoutMatch = routeConfig.file.match(/^routes\/(_[^.]+)\.tsx?$/);
				if (layoutMatch) {
					const layoutPrefix = layoutMatch[1];
					const additionalRoutes = nestedRoutesByLayout.get(layoutPrefix) || [];

					if (additionalRoutes.length > 0) {
						// Build hierarchy with layout overrides
						const hierarchicalRoutes = buildLayoutHierarchy(
							additionalRoutes,
							standardRoutes,
							layoutsByPath,
						);

						// Add our nested routes as children of this layout
						routeConfig.children = [
							...(routeConfig.children || []),
							...hierarchicalRoutes,
						];

						// Remove from map so we don't create duplicates
						nestedRoutesByLayout.delete(layoutPrefix);
					}
				}
			}

			return routeConfig;
		});
	};

	// Enhance existing routes instead of creating new ones
	const enhancedRoutes = enhanceRoutes(standardRoutes);
	return enhancedRoutes;
};

export { enhancedFlatRoutes as flatRoutes };
export type { LayoutInfo, ProcessedRoute, RouteInfo } from "./types";
