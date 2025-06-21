import { readdirSync, statSync } from "fs";
import { join } from "path";
import type { RouteInfo } from "./types";

/**
 * Recursively scan directories for route files
 * @param dirPath - The directory path to scan
 * @param relativePath - The relative path from the routes directory
 * @returns Array of RouteInfo objects
 */
export const scanDirectory = (
	dirPath: string,
	relativePath = "",
): RouteInfo[] => {
	const routes: RouteInfo[] = [];

	try {
		const items = readdirSync(dirPath);

		for (const item of items) {
			const itemPath = join(dirPath, item);
			const stat = statSync(itemPath);

			if (stat.isFile() && (item.endsWith(".tsx") || item.endsWith(".ts"))) {
				const routeName = item.replace(/\.(tsx?|jsx?)$/, "");
				const isLayout = routeName.startsWith("_");

				// Skip root index files (handled by flatRoutes)
				if (routeName === "index" && !relativePath) continue;

				if (isLayout) {
					routes.push({
						path: relativePath,
						file: join(relativePath, item).replace(/\\/g, "/"),
						isLayout: true,
					});
				} else if (routeName === "index") {
					routes.push({
						path: relativePath,
						file: join(relativePath, item).replace(/\\/g, "/"),
						isLayout: false,
					});
				} else {
					// Handle parameter routes (files starting with $)
					let routePath: string;
					if (routeName.startsWith("$")) {
						// Convert $param to :param for React Router
						const paramName = routeName.slice(1); // Remove the $
						const paramRoute = `:${paramName}`;
						routePath = relativePath
							? `${relativePath}/${paramRoute}`
							: paramRoute;
					} else {
						routePath = relativePath
							? `${relativePath}/${routeName}`
							: routeName;
					}

					routes.push({
						path: routePath,
						file: join(relativePath, item).replace(/\\/g, "/"),
						isLayout: false,
					});
				}
			} else if (stat.isDirectory()) {
				const subPath = relativePath ? `${relativePath}/${item}` : item;
				routes.push(...scanDirectory(itemPath, subPath));
			}
		}
	} catch (error) {
		// Can't read directory, skip silently
	}

	return routes;
};

/**
 * Scan the routes directory for nested directory structures
 * @param routesDir - The absolute path to the routes directory
 * @returns Object containing nested routes by layout and layouts by path
 */
export const scanNestedRoutes = (routesDir: string) => {
	const nestedRoutesByLayout = new Map();
	const layoutsByPath = new Map();

	try {
		const items = readdirSync(routesDir);

		for (const item of items) {
			const itemPath = join(routesDir, item);
			const stat = statSync(itemPath);

			if (stat.isDirectory() && item.startsWith("_")) {
				// Extract layout prefix (e.g., "_app" from "_app.example")
				const layoutPrefix = item.split(".")[0];

				// Scan the directory recursively
				const routes = scanDirectory(itemPath);

				// Separate layouts from regular routes
				const layoutRoutes = routes.filter((r) => r.isLayout);
				const regularRoutes = routes.filter((r) => !r.isLayout);

				// Store layout files for hierarchy building
				for (const layoutRoute of layoutRoutes) {
					const layoutPath = `${item}/${layoutRoute.file}`;
					layoutsByPath.set(layoutPath, {
						path: layoutRoute.path,
						file: layoutRoute.file,
						directoryPrefix: item,
					});
				}

				// Process regular routes
				for (const routeInfo of regularRoutes) {
					// Create the route pattern
					const routePattern = item
						.replace(/^_app\./, "") // Remove _app prefix
						.replace(/\./g, "/"); // Convert dots to slashes
					const fullRoutePattern = `${routePattern}/${routeInfo.path}`;

					// Group by layout prefix
					if (!nestedRoutesByLayout.has(layoutPrefix)) {
						nestedRoutesByLayout.set(layoutPrefix, []);
					}

					nestedRoutesByLayout.get(layoutPrefix).push({
						path: fullRoutePattern,
						file: `./routes/${item}/${routeInfo.file}`,
						originalPath: routeInfo.path,
						directoryPrefix: item,
					});
				}
			}
		}
	} catch (error) {
		console.warn("Could not scan routes directory:", error);
	}

	return { nestedRoutesByLayout, layoutsByPath };
};
