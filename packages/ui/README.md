# SET ui library

## Package name

> [!IMPORTANT]
> If you rename this package from `@septkit/ui`, you must update CSS imports in all consuming packages.
>
> Currently, packages using this library need the following directive in their CSS files (path depends on its own context to get to node_modules): `@source "../../../node_modules/@septkit/ui";`
>
> This directive points to the relative path from the consuming package to this UI package in the node_modules directory. The @source directive is essential for externalizing Tailwind CSS and DaisyUI dependencies, allowing all projects to share the same Tailwind configuration.
