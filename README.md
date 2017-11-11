# taqtile-dangerjs-plugin

[![Build Status](https://travis-ci.org/indigotech/dangerjs-plugin.svg?branch=master)](https://travis-ci.org/indigotech/dangerjs-plugin)
[![npm version](https://badge.fury.io/js/taqtile-dangerjs-plugin.svg)](https://badge.fury.io/js/taqtile-dangerjs-plugin)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Code Climate](https://codeclimate.com/github/indigotech/dangerjs-plugin/badges/gpa.svg)](https://codeclimate.com/github/indigotech/dangerjs-plugin)

> Taqtile Danger-js Plugin

## Environment

- Use correct node version (from `.nvmrc file`)

```bash
$ nvm use
```

(If any error is found, install correct node versio via `$ nvm install`)

- Install correct yarn version

```bash
$ npm install -g yarn@`node -pe "require('./package.json').engines.yarn"`
```
Install dependencies

```bash
$ yarn install
```

## Adding new rules

Add your rules to `src/rules` folder and its respective tests.

When adding new rules, please follow current scope files for `pr`, `nodejs`, `android`, etc or create a new one in case your rule does not fit in any of the existing ones.

Also, check [Danger's guide on Phrasing](http://danger.systems/js/usage/culture.html#phrasing) to understand how to better use error messages to provide an impartial but polite feedback.

## What is currently being checked

### PR

- [x] Fail when no description is provided
- [x] Warns if description provided is too short
- [x] Big PRs

### Platform/Language agnostic

- [x] `>>>` Strings to make sure rebase was successful
- [ ] Warn when Amazon Secret Key is hardcoded
- [x] Warn when `Dangerfile` was modified
- [x] Warn when `http://` is used
- [x] Warn when definition files were changes but their lockfile weren't:
  - `Gemfile` vs `Gemfile.lock`
  - `package.json` vs `yarn.lock`
- [x] Warn if some files/folders were changed/committed:
  - `Dangerfile`
  - `.gitignore`
  - `Gemfile`
  - `Gemfile.lock`
  - `.travis.yml`
  - `coverage`

### Node

- [x] Warn when `npm install -g` is used
- [x] Warn when `console.log` is added
- [ ] Warn when `package.json` was modified and `yarn.lock` or `shrinkwrap` was not
- [x] Warn if node version is different between .travis.yml, .nvmrc, package.json and README (or just warn if node version has change just in one of these locations)
- [x] At packages.json every package should have its version fixed (do not use ^ or ~), or explicitly set the major and minor versions (ie.: 1.2.x)
- [ ] [TypeScript] Warn if using `<any>` as return type.
- [x] Warn if some files/folders were changed/committed:
  - `npm-debug.log`
  - `yarn-error.log`
  - `docker-compose.yml`
  - `tslint.json`
  - `tsconfig.json`
  - `.nvmrc`
  - `Procfile`
  - `npm-shrinkwrap.json`
  - `.env`
  - `.env.test`
  - `.env.sample`
  - `env.coffee`
  - `nodemon.json`

### iOS

- [x] Warn if some files/folders to be changed/committed like `Cakefile`, `settings.yml.erb`, `Fastfile`
- [X] Warn when `Podfile` was modified and `Podfile.lock` was not
- [ ] Warn if changes made in Cakefile may 'break' provisionings and sign certificates configurations
- [ ] Warn when ATS Exception is set in plist
- [ ] Warn when Landscape orientation is set in plist
- [ ] Warn when Facebook ID is hardcoded in plist
- [ ] Warn when pod is being loaded from external git repos
- [ ] Warn when `TODO` is added
- [ ] Warn when `print(“”)` is added
- [ ] Warn when `fatalError` is added
- [ ] Warn if Podfile has pods should not using fixed versions
- [ ] [Swift] Warn if forced unwrapping was found
- [ ] Warn if hardcoded font is used in `.xib`
- [ ] Warn if hardcoded color is used in `.xib`

### Android

- [x] Warn if there are hardcoded dimens different from `0dp` on `.xml` files
- [x] Warn if there are hardcoded colors on `.xml` files
- [ ] Warn if there are hardcoded texts on `.xml` files
- [ ] [Kotlin] Error when `!!` is found (similar to swift forced unwrap when `anything!` is found)
- [ ] [Kotlin] Warn if using `Any` or `Any?` as return type
- [x] [Kotlin] Warn if `ButterKnife` or `findViewById` are found
- [ ] Warn if some files/folders were changed/committed:
  - `Manifest.xml`
  - `.gradle`

### Web

- [x] Warn if CSS files were changed


## Usage


### For danger-js

Install:

```sh
yarn add taqtile-dangerjs-plugin --dev
```

At a glance:

```js
// dangerfile.js
import { schedule } from 'danger'
import taqtileDangerjsPlugin from 'taqtile-dangerjs-plugin'

schedule(async() => {
  await taqtileDangerjsPlugin();
})
```

### For peril

Install:

```sh
yarn add taqtile-dangerjs-plugin --dev
```

Add plugin module to `json` settings:

```json
"settings": {
  "modules": ["taqtile-dangerjs-plugin"]
},
  ```

Use it in any peril dangerfile

```js
// dangerfile.js
import { schedule } from 'danger'
import taqtileDangerjsPlugin from 'taqtile-dangerjs-plugin'

schedule(async() => {
  await taqtileDangerjsPlugin();
})
```
## Changelog

See the GitHub [release history](https://github.com/indigotech/dangerjs-plugin/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
