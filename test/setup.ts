import { vol } from "memfs";
import { beforeEach, vi } from "vitest";

// Mock fs modules with memfs
vi.mock("fs", () => {
	const memfs = vi.importActual("memfs");
	return memfs;
});

vi.mock("fs/promises", () => {
	const memfs = vi.importActual("memfs");
	// biome-ignore lint/suspicious/noExplicitAny: memfs does not have a proper type definition for promises
	return (memfs as any).promises;
});

// Reset the virtual file system before each test
beforeEach(() => {
	vol.reset();
});
