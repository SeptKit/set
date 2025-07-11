# 2. Use changelog for each package

Date: 2025-07-07

## Status

Accepted

## Context

We want to look up what what the latest changes in a package so we can keep track of what did we do.

## Decision

We will use the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format for each package's `CHANGELOG.md` file.
We will not generate the changelogs from commit messages, because we are writing them for humans.

## Consequences

We need to manage the changelogs manually, instead of generating them from commit messages.
