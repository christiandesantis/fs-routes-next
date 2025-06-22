import { vol } from "memfs";
import { beforeEach } from "vitest";

// Setup memfs before each test
beforeEach(() => {
	vol.reset();
});

/**
 * Creates a mock file system structure for testing
 */
export function createMockFileSystem(structure: Record<string, string | null>) {
	vol.reset();
	vol.fromJSON(structure);
}

/**
 * Helper to create route files in the mock file system
 */
export function createRouteFiles(
	baseDir: string,
	files: Record<string, string>,
) {
	const structure: Record<string, string> = {};

	for (const [path, content] of Object.entries(files)) {
		structure[`${baseDir}/${path}`] = content;
	}

	createMockFileSystem(structure);
	return baseDir;
}

/**
 * Mock route file content
 */
export const mockRouteContent = `
import { type LoaderFunctionArgs } from "@react-router/node";

export async function loader({ request }: LoaderFunctionArgs) {
  return { data: "test" };
}

export default function Route() {
  return <div>Test Route</div>;
}
`;

/**
 * Mock layout file content
 */
export const mockLayoutContent = `
import { Outlet } from "@react-router/react";

export default function Layout() {
  return (
    <div>
      <h1>Layout</h1>
      <Outlet />
    </div>
  );
}
`;
