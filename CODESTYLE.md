# Codestyle

In this file we define conventions that we use in the project and we have not got
automated checks for them yet.


1. file naming: use kebab-case instead of camelCase for file names because changing lower case letters to capital ones have caused problems in every one of my projects.
2. file naming: start file names with small letters
3. tests are always next to their implementation, in the same directory
4. test files are called `<component-name>.test.ts`
5. e2e tests are separated from unit tests, in the `e2e` directory, and they are called `<feature>.test.ts`
6. we use a domain driven structure (`user`, `product`), instead of feature driven (e.g.: `views`, `stores`, etc..)
7. prefer functional style coding
8. prefer `function` to create functions instead of variables and arrow functions