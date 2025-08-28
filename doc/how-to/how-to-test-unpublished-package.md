# How to test unpublished package changes in a monorepo without linkWorkspacePackages

In a monorepo setup, you might have multiple packages that depend on each other. When you make changes to one package that is not yet published, you may want to test those changes in another package that depends on it.

Here is the recommended way how to do this without using `linkWorkspacePackages`:

1. **Build the Unpublished Package**: First, navigate to the directory of the package you have modified and run its build script to generate the latest version of the package with `pnpm build`, e.g. in `/packages/ui`.

2. **Manually Link the Package**: Next, navigate to the package that depends on the unpublished package. Use the link script defined in the `package.json` of the dependent package (e.g. `pnpm link:ui`) to create a symlink to the built version of the unpublished package. This allows the dependent package to use the local version of the unpublished package instead of looking for it in the npm registry.

3. **Build the Dependent Package**: Build the dependent package to ensure it picks up the changes from the unpublished package.

4. **Start Development Server**: If the dependent package has a development server, start it to see the changes in action.

5. **Run Tests**: If you have tests in the dependent package which rely on the unpublished package, you can run them to verify that the changes in the unpublished package work as expected.

6. **Unlink the Package**: Once you are done testing, navigate back to the dependent package and run the unlink script defined in its `package.json` (e.g. `pnpm link:ui:restore`) to remove the symlink and revert to using the published version of the package.

_Note_: You can keep on making changes to the unpublished package without the need to rebuild the dependent package and relink every time. Just make sure to rebuild the unpublished package with the newest changes but the symlink will remain valid until you unlink it.
