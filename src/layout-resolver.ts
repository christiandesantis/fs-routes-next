import { route } from "@react-router/dev/routes";
import type { RouteConfigEntry } from "@react-router/dev/routes";
import type { LayoutInfo, ProcessedRoute } from "./types";
import { findLayoutForRoute, generateRouteId } from "./utils";

/**
 * Build layout hierarchy for nested routes with override support
 */
export const buildLayoutHierarchy = (
	routes: ProcessedRoute[],
	existingRoutes: RouteConfigEntry[],
	layoutsByPath: Map<string, LayoutInfo>,
): RouteConfigEntry[] => {
	const layoutRoutes = new Map();

	// Get existing route paths to avoid conflicts
	const existingPaths = new Set<string>();
	const addExistingPaths = (routeList: RouteConfigEntry[]) => {
		for (const route of routeList) {
			if (route.path) {
				existingPaths.add(route.path);
			}
			if (route.children) {
				addExistingPaths(route.children);
			}
		}
	};
	addExistingPaths(existingRoutes);

	// Create layout route configs
	for (const [layoutPath, layoutInfo] of layoutsByPath.entries()) {
		const layoutPattern = layoutInfo.directoryPrefix
			.replace(/^_app\./, "")
			.replace(/\./g, "/");
		const fullLayoutPattern = layoutInfo.path
			? `${layoutPattern}/${layoutInfo.path}`
			: layoutPattern;

		// Root-level layouts (path === '') should be pathless to avoid conflicts
		const isRootLayoutInDirectory = layoutInfo.path === "";

		// Skip layouts that conflict with existing routes (unless they're pathless)
		if (!isRootLayoutInDirectory && existingPaths.has(fullLayoutPattern)) {
			continue;
		}

		// Generate a unique ID for the layout route
		const layoutId = `routes/${layoutPath.replace(/\//g, ".")}`.replace(
			/\.tsx$/,
			"",
		);

		let layoutRoute: RouteConfigEntry;
		if (isRootLayoutInDirectory) {
			// Root layouts are pathless - they don't add a route segment
			layoutRoute = {
				id: layoutId,
				file: `./routes/${layoutPath}`,
				children: [],
			};
		} else {
			const routeConfig = route(fullLayoutPattern, `./routes/${layoutPath}`);
			layoutRoute = {
				...routeConfig,
				id: layoutId,
				children: [],
			};
		}

		layoutRoutes.set(layoutPath, layoutRoute);
	}

	// Assign routes to their most specific layouts
	const rootRoutes: RouteConfigEntry[] = [];

	for (const routeConfig of routes) {
		const layout = findLayoutForRoute(
			routeConfig.originalPath || "",
			routeConfig.directoryPrefix || "",
			layoutsByPath,
		);

		if (layout) {
			const layoutPath = `${routeConfig.directoryPrefix}/${layout.file}`;
			const layoutRoute = layoutRoutes.get(layoutPath);
			if (layoutRoute) {
				// Generate a unique ID for the route if it doesn't have one
				if (!routeConfig.id) {
					routeConfig.id = generateRouteId(routeConfig.file);
				}

				// Adjust the route path to be relative to the layout
				const layoutBasePath = layout.path;
				const routeOriginalPath = routeConfig.originalPath || "";

				// Remove the layout path prefix from the route path
				if (
					layoutBasePath &&
					routeOriginalPath.startsWith(`${layoutBasePath}/`)
				) {
					routeConfig.path = routeOriginalPath.slice(layoutBasePath.length + 1);
				} else if (layoutBasePath && routeOriginalPath === layoutBasePath) {
					// If the route path equals the layout path, make it an index route
					routeConfig.path = undefined;
					routeConfig.index = true;
				} else if (layoutBasePath) {
					// Route is under this layout but not a direct match
					routeConfig.path = routeOriginalPath.startsWith(`${layoutBasePath}/`)
						? routeOriginalPath.slice(layoutBasePath.length + 1)
						: routeOriginalPath;
				}

				if (!layoutRoute.children) layoutRoute.children = [];
				layoutRoute.children.push(routeConfig);
			} else {
				// Layout was skipped due to conflict, add route directly
				if (!routeConfig.id) {
					routeConfig.id = generateRouteId(routeConfig.file);
				}
				rootRoutes.push(routeConfig);
			}
		} else {
			// Generate a unique ID for the route if it doesn't have one
			if (!routeConfig.id) {
				routeConfig.id = generateRouteId(routeConfig.file);
			}
			rootRoutes.push(routeConfig);
		}
	}

	// Add layout routes that have children
	for (const [, layoutRoute] of layoutRoutes.entries()) {
		if (layoutRoute.children && layoutRoute.children.length > 0) {
			rootRoutes.push(layoutRoute);
		}
	}

	return rootRoutes;
};
