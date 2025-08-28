# 7. Do not use link workspace packages

Date: 2025-08-29

## Status

Accepted

## Context

We have a monorepo with multiple packages that use each other as dependencies.

## Decision

We will not use linkWorkspacePackages because the CI/CD pipeline should be easy and not care about these dependencies and just resolve to published versions only.
For this reason we will also not use linkWorkspacePackages locally for development as it can cause unpredictable dependency resolution and non-reproducible builds and tests if local and CI/CD environments differ.

For rare cases when you need to test local changes of a package, which are not published yet, across other dependent packages, you can temporarily link the packages manually (see [here](../how-to/how-to-test-unpublished-package.md))

## Consequences

Simpler CI/CD pipelines and more predictable dependency resolution.
Packages will always use published versions of their dependencies avoiding version conflicts and environment drift.

## Alternatives Considered

- Using linkWorkspacePackages locally and disabling in CI/CD: Rejected due to risk of environment drift and hidden version conflicts.
- Using a private npm registry for pre-release testing: Adds complexity and overhead. Manual linking is simpler for rare cases.
