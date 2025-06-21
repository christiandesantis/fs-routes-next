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
├── _app.tsx                   # Main app layout → "/"
├── _app.dashboard/            # Dashboard routes
│   ├── _users.tsx             # Layout override (only for users.tsx)
│   ├── users.tsx              # Uses _users.tsx layout → "/dashboard/users"
│   ├── index.tsx              # Uses default app layout → "/dashboard"
│   ├── settings.tsx           # Uses default app layout → "/dashboard/settings"
│   └── reports/
│       ├── _analytics.tsx     # Nested layout override → "/dashboard/reports"
│       ├── index.tsx          # Uses default app layout → "/dashboard/reports"
│       └── analytics/
│           └── index.tsx      # Uses _analytics.tsx layout → "/dashboard/reports/analytics"
│           └── $id.tsx        # Parameter route → "/dashboard/reports/:id"
```

## Route Generation

- `routes/_app.dashboard/users.tsx` → `/dashboard/users` (with `_users.tsx` layout)
- `routes/_app.dashboard/settings.tsx` → `/dashboard/settings` (with default app layout)
- `routes/_app.dashboard/reports/analytics/index.tsx` → `/dashboard/reports/analytics` (with `_analytics.tsx` layout)
- `routes/_app.dashboard/reports/$id.tsx` → `/dashboard/reports/:id` (parameter route)

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

## Development & Publishing

This package uses automated publishing via GitHub Actions. When changes are pushed to the `main` branch, the package is automatically:

1. **Version bumped** based on commit message conventions:
   - `feat:` or `[minor]` → Minor version bump (new features)
   - `BREAKING CHANGE` or `[major]` → Major version bump (breaking changes)
   - Everything else → Patch version bump (bug fixes, docs, etc.)

2. **Built and published** to npm with the new version

3. **Tagged** in git with the new version number

### Commit Message Examples

```bash
# Patch version (1.0.0 → 1.0.1)
git commit -m "fix: resolve layout inheritance issue"

# Minor version (1.0.0 → 1.1.0)
git commit -m "feat: add support for wildcard routes"
# or
git commit -m "fix: improve performance of route scanning [minor]"

# Major version (1.0.0 → 2.0.0)
git commit -m "feat: redesign API with BREAKING CHANGE"
# or
git commit -m "refactor: simplify API [major]"
```

### Setup for Contributors

To enable automated publishing, the repository needs:

1. **NPM_TOKEN** secret in GitHub repository settings
   - Generate at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
   - Add as repository secret at `Settings > Secrets and variables > Actions`

2. **Repository permissions**
   - Ensure Actions have write permissions to push version commits and tags
   - Go to `Settings > Actions > General > Workflow permissions`

### Manual Publishing

If you need to publish manually:

```bash
npm run build
npm version patch  # or minor/major
npm publish
git push --follow-tags
```
