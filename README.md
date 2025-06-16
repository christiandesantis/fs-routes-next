# fs-routes-next

[![npm version](https://badge.fury.io/js/fs-routes-next.svg)](https://badge.fury.io/js/fs-routes-next)
[![npm downloads](https://img.shields.io/npm/dm/fs-routes-next.svg)](https://www.npmjs.com/package/fs-routes-next)

Enhanced file-based routing library for React Router 7+ with support for nested directories, automatic layout inheritance, and layout overrides at any nesting level.

## Features

- ✅ **Nested Directory Support**: Scan and generate routes from deeply nested folder structures
- ✅ **Automatic Layout Inheritance**: Routes automatically inherit layouts based on directory prefixes
- ✅ **Layout Overrides**: Support for layout overrides at any nesting level (e.g., `_another.tsx` only applies to specific routes)
- ✅ **Pathless Layouts**: Root-level layouts that don't add route segments
- ✅ **Conflict Resolution**: Intelligent handling of path conflicts and unique route ID generation
- ✅ **TypeScript Support**: Fully typed with proper interfaces and type safety
- ✅ **Modular Architecture**: Clean separation of concerns across multiple modules

## Installation

```bash
npm install fs-routes-next
```

or

```bash
yarn add fs-routes-next
```

or

```bash
pnpm add fs-routes-next
```

## Module Structure

```
fs-routes-next/
├── index.ts           # Main orchestrator and public API
├── types.ts           # TypeScript interfaces and types
├── utils.ts           # Utility functions for route/layout processing
├── scanner.ts         # Directory scanning and route discovery
└── layout-resolver.ts # Layout hierarchy and resolution logic
```

## Usage

```typescript
// app/routes.ts
import type { RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "fs-routes-next";

export default (await flatRoutes()) satisfies RouteConfig;
```

## Supported File Structure

```
routes/
├── _app.tsx                    # Main app layout
├── _app.example/               # Nested example routes
│   ├── _another.tsx           # Layout override (only for another.tsx)
│   ├── another.tsx            # Uses _another.tsx layout
│   ├── index.tsx              # Uses default app layout
│   ├── other.tsx              # Uses default app layout
│   └── other/
│       ├── _final.tsx         # Nested layout override
│       ├── index.tsx          # Uses default app layout
│       └── final/
│           └── index.tsx      # Uses _final.tsx layout
```

## Route Generation

- `routes/_app.example/another.tsx` → `/example/another` (with `_another.tsx` layout)
- `routes/_app.example/other.tsx` → `/example/other` (with default app layout)
- `routes/_app.example/other/final/index.tsx` → `/example/other/final` (with `_final.tsx` layout)

## Key Benefits

1. **Maintainable**: Modular architecture makes it easy to extend and modify
2. **Type Safe**: Full TypeScript support with proper interfaces
3. **Flexible**: Supports complex nesting and layout override scenarios
4. **Performant**: Efficient scanning and route generation
5. **Minimal Setup**: Simple import/export in `routes.ts`

## Testing

The library has been thoroughly tested with:
- Deep nesting scenarios (3+ levels)
- Layout overrides at multiple levels
- Path conflict resolution
- Route inheritance patterns
- Index vs non-index route handling
