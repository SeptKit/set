# 4. Use Plugin Architecture

Date: 2025-07-07

## Status

Accepted

## Context

We create a substation designer application. On the application multiple developers and multiple companies could work together. This could lead to bottlenecks and dependencies between teams and individuals.

## Decision

We will use a plugin architecture to enabled parallel work.

## Consequences

Each team can develop their own plugins independently. This allows teams to focus on their own features without waiting for others to finish their work.
Furthermore, the application will be more robust because a failure in a plugin does not affect the rest of the application.
Also we can replace parts of the system (plugins) easier and faster.
