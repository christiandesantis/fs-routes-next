import type { RouteConfigEntry } from "@react-router/dev/routes";

export interface RouteInfo {
	path: string;
	file: string;
	isLayout: boolean;
}

export interface LayoutInfo {
	path: string;
	file: string;
	directoryPrefix: string;
}

export interface ProcessedRoute extends RouteConfigEntry {
	originalPath?: string;
	directoryPrefix?: string;
}
