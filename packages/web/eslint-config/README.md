# Vue ESLint Config

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]() [![npm version](https://img.shields.io/npm/v/@appwise/eslint-config-vue.svg?style=flat)](https://www.npmjs.com/package/@appwise/eslint-config-vue) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request)

Every project uses the same eslint config, so we can easily maintain the same code style.
This also ensures that all our projects are consistent and that we don't lose time on code style.
Uses the new Flat Config - [Read more about it](https://eslint.org/docs/latest/use/configure/configuration-files-new)

## Table of Contents

- [Vue ESLint Config](#vue-eslint-config)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Important ESLint rules](#important-eslint-rules)
  - [Want to contribute?](#want-to-contribute)
    - [How to contribute](#how-to-contribute)
    - [Rules of Pull Requests](#rules-of-pull-requests)
    - [Have a issue or a feature request?](#have-a-issue-or-a-feature-request)
  - [Deployment \& Publishing](#deployment--publishing)
  - [Making changes locally](#making-changes-locally)

## Installation

1. Install the package:
```bash
npm i -D @wisemen/eslint-config-vue
```

2. Add the config to your `.eslint.config.js` file:
```ts
import WisemenEslintConfig from '@wisemen/eslint-config-vue'

export default [
  ...(await WisemenEslintConfig),
  {
    settings: {
      'vue-i18n': {
        localeDir: './src/locales/*.json',
        messageSyntaxVersion: '^9.0.0',
      },
    },
  },
]
```

3. Add the following to your `package.json` file:
```json
{
  "scripts": {
    "lint": "eslint --ext .vue,.ts src --fix"
  }
}
```

4. Enable Flatconfig in VSCode
```json
"eslint.experimental.useFlatConfig": true
```

## Important ESLint rules

- [Single quotes](https://eslint.org/docs/rules/quotes): We use single quotes for strings.
- [no-console](https://eslint.org/docs/rules/no-console): We don't want to have any `console.log` statements in our code.
- [no-semicolons](https://eslint.org/docs/rules/semi): We don't use semicolons at the end of a line.
- [no-trailing-commas](https://eslint.org/docs/rules/no-comma-dangle): We don't use trailing commas.

## Want to contribute?

Want to file a bug, contribute some code, or improve documentation? Excellent! Read this chapter to get started.

### How to contribute

1. Fork the project & clone locally.
2. Create an upstream remote and sync your local copy before you branch.
3. Branch for each separate piece of work.
4. Do the work, write good commit messages.
5. Push to your origin repository.
6. Create a new PR in GitHub.
7. Respond to any code review feedback.
8. Repeat until clean.
9. Wait for a maintainer to merge your PR.
10. Celebrate!

### Rules of Pull Requests

When you want to contribute and send us a pull request, please keep the following rules in mind:

- Make sure that you test your changes before sending a pull request.
- When you make a pull request, tag one or multiple maintainers, so they can review your code.
- Place a message in the `Front-end circle` channel on Slack, so everyone is aware of the changes.
- Once you merge your changes, make sure to increase the version number in the `package.json` file for example `0.0.1 -> 0.0.2`.

`⚠️ Please make sure you also update the documenation if needed. ⚠️`

### Have a issue or a feature request?

If you have found a bug or if you have a feature request, please report them at this repository issues section.

## Deployment & Publishing

This package is automatically published to npm when a new version is pushed to the `master` branch.

## Making changes locally

If you want to make changes to this package locally, you can use `npm link` to link the package to your project.

1. Run `npm link @wisemen/eslint-config-vue` in the root of your project.
2. Run `npm run lint` to lint your project with the local version of this package.
3. Run `npm unlink @wisemen/eslint-config-vue` in the root of your project to unlink the package.
