import type { LayoutInfo } from "./types";

/**
 * Generate unique route IDs for React Router
 */
export const generateRouteId = (filePath: string): string => {
	const cleanPath = filePath
		.replace("./routes/", "")
		.replace(/\.(tsx?|jsx?)$/, "");
	return `routes.${cleanPath}`.replace(/\//g, ".");
};

/**
 * Extract layout name from filename (removes leading underscore)
 */
export const getLayoutName = (fileName: string): string | null => {
	if (!fileName.startsWith("_")) return null;
	return fileName.slice(1); // Remove leading underscore
};

/**
 * Check if a layout should apply to a specific route
 */
export const shouldLayoutApplyToRoute = (
	routePath: string,
	layoutInfo: LayoutInfo,
): boolean => {
	const layoutFileName =
		layoutInfo.file
			.split("/")
			.pop()
			?.replace(/\.tsx?$/, "") || "";
	const layoutName = getLayoutName(layoutFileName);
	if (!layoutName) return false;

	const routeSegments = routePath.split("/").filter(Boolean);

	if (layoutInfo.path === "") {
		// Root-level layout: only apply to routes matching the layout name
		const firstSegment = routeSegments[0] || "";
		return (
			firstSegment === layoutName || routePath.startsWith(`${layoutName}/`)
		);
	}

	// Nested layout: apply to routes deeper than the layout's path
	const layoutSegments = layoutInfo.path.split("/").filter(Boolean);
	const isDeeper = routeSegments.length > layoutSegments.length;
	return isDeeper && routePath.startsWith(`${layoutInfo.path}/`);
};

/**
 * Find the most specific layout for a given route
 */
export const findLayoutForRoute = (
	routePath: string,
	directoryPrefix: string,
	layoutsByPath: Map<string, LayoutInfo>,
): LayoutInfo | null => {
	let mostSpecificLayout: LayoutInfo | null = null;

	for (const [layoutPath, layoutInfo] of layoutsByPath.entries()) {
		if (!layoutPath.startsWith(`${directoryPrefix}/`)) continue;

		if (shouldLayoutApplyToRoute(routePath, layoutInfo)) {
			// Choose the most specific layout (deepest path)
			if (
				!mostSpecificLayout ||
				layoutInfo.path.split("/").length >
					mostSpecificLayout.path.split("/").length
			) {
				mostSpecificLayout = layoutInfo;
			}
		}
	}

	return mostSpecificLayout;
};
