# 6. Use Following Coding Conventions

Date: 2025-07-08

## Status

Accepted

## Context

We want to have consistent code in the project.

## Decision

We will automate the coding conventions as much as we can.
We will document the rest in the [CODESTYLE.md](../../CODESTYLE.md) file.

We will follow the following coding conventions:

- file naming: use kebab-case instead of camelCase for file names because changing lower case letters to capital ones have caused problems in every one of my projects.
- file naming: start file names with small letters
- tests are always next to their implementation, in the same directory
- test files are called `<component-name>.test.ts`
- we use a domain driven structure (`user`, `product`), instead of feature driven (e.g.: `views`, `stores`, etc..)


## Consequences

It will be easier to read and find code in the project.
