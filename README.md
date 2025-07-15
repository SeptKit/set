# SET Monorepo

This repository is the monorepo for the **SET project**. It contains all core applications, shared libraries, plugins, business logic, and documentation for the project.

## Monorepo Structure

- **shell/**: The main application shell. This is the entry point for the user interface and orchestrates the integration of plugins and UI components.
- **ui/**: Shared UI component library. Contains reusable Vue 3 components, styles, and design tokens used across the project.
- **plugins/**: Collection of plugins that extend the shell's functionality. Each plugin is isolated and can be developed and maintained independently.
- **fileio/**: Handles file import features and provides utilities for translating XML data to IndexedDB storage.
- **scdlsdk/**: Business logic packages. These modules manage the interaction between plugins and the database, encapsulating core domain logic.
- **doc/**: Contains architectural decision records (ADR), SCL structure files, and other project documentation.

## Root Scripts

The root `package.json` provides scripts to manage and build the monorepo:

- `shell:build` / `shell:dev`: Build or start the shell application (UI entry point).
- `ui:build` / `ui:dev`: Build or start the shared UI component library.
- `dependencies:build`: Build all dependencies (currently runs `ui:build`).
- `postinstall`: Automatically builds dependencies after installing packages.

All scripts use [pnpm](https://pnpm.io/) and the `--filter` flag to target specific packages.

## Code Style

Code style rules are defined at the root of the repository (see `.editorconfig` and other config files). These rules ensure consistent formatting and linting across all packages and projects in the monorepo.
