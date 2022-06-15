# Play

> A repo template for modern Node.js packages

This repo is a template for modern Node.js package development. It is modules by default and uses the
[built-in Node.js test runner to execute tests](https://nodejs.org/api/test.html).

The source is published "as is" without any transpilation or bundling, but type checking (and optional generation) is
still enabled via TypeScript thanks to
[JSDoc comments](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html).

## Scripts

### Build

```bash
$ npm run build
```

`build` will generate the types for your source code. The types are generated next to the source, but ignored via
`.gitignore`. _Use file nesting in VSCode to "hide" the generated dts files:_

```jsonc
{
  // VSCode settings.json
  "explorer.fileNesting.patterns": {
    // This setting will group `.mjs` files with their tests and generated types (and maps)
    "*.mjs": "${capture}.test.mjs, ${capture}.mjs.map, {capture}.d.mts, ${capture}.d.mts.map"
  }
}
```

### Test

```bash
$ npm run test
$ npm run test:coverage
```

`test` will run tests using Node.js' built-in test runner. The output is in `tap` format and still not very readable. I
hope to fix this as the test runner matures.

`test:coverage` will check for test coverage on all files in the `lib` folder.

### Source validation

```bash
$ npm run lint
$ npm run type-check
```

`lint` and `type-check` will run ESLint and TypeScript type checking on your source files.

### Source formatting

```bash
$ npm run format
```

`format` will format all source files with Prettier, according to the configuration in `.prettierrc`.

## Enabling TypeScript source

This template uses JSDoc comments and has configured TypeScript to check JavaScript files as well. This makes it
possible to have type checking enabled for the source files, while also publishing the source files to npm as is,
without any transpilation or bundling.

But it is possible to enable TypeScript source files. See the branch `typescript` for ways of doing that.
