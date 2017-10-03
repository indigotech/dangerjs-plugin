// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import {DangerDSLType} from '../../node_modules/danger/distribution/dsl/DangerDSL';
declare const danger: DangerDSLType;

export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

import { Scope } from '../rule.type';
import { changedFilesContainsRegex, warnIfFilesChanged } from '../utils';

export const filesToCheck = [
  'yarn.lock',
  'npm-debug.log',
  'yarn-error.log',
  'docker-compose.yml',
  'tslint.json',
  'tsconfig.json',
  '.nvmrc',
  'Procfile',
  'npm-shrinkwrap.json',
  '.env',
  '.env.test',
  '.env.sample',
  'env.coffee',
  `nodemon.json`,
];

/**
 * Node rules
 */
export let node: Scope = {

  /** Warns when key config files have been modified */
  async shouldNotHaveBeenChanged() {
    warnIfFilesChanged(filesToCheck);
  },

  /** Warns when 'console.log' is added to code */
  async consoleLog() {
    if (changedFilesContainsRegex(/console\.log/ig)) {
      warn('This PR adds `console.log` to code.');
    }
  },

  /** Warns when 'npm install -g' is added to code */
  async npmGlobal() {
    if (await changedFilesContainsRegex(/npm install \-g/ig)) {
      // tslint:disable-next-line:max-line-length
      fail(['This PR adds `npm install \-g` instuctions to the project, ',
        'please prefer adding packages as `dependencies` or `devDependencies` to `package.json` instead. ',
        'More info at https://github.com/typeorm/typeorm/pull/599'].join(''));
    }
  },

  /** Warns when node version is changed */
  async nodeVersion() {

    const files = ([] as string[]).concat(
      danger.git.created_files  || [],
      danger.git.modified_files || [],
    );

    const packageJsonNodeVersion = await (async () => {

      const packageJsonFile = await(files
        .filter(name => name.match(/package\.json/gi)) // ['file 1', 'file 2', 'file 3'] or []
        .filter((_, index) => index === 0) // ['file 1'] or []
        .map(name => danger.git.JSONDiffForFile(name)) // [Promise] or []
        .find((_, index) => index === 0) || Promise.resolve(null)); // Promise

      if (packageJsonFile && packageJsonFile.engines && packageJsonFile.engines.after) {
        return packageJsonFile.engines.after.node;
      } else {
        return null;
      }

    })();

    const nvmrcNodeVersion = await (async () => {
      const nvmrcFile = await (files
        .filter(name => name.match(/\.nvmrc/gi)) // ['file 1', 'file 2', 'file 3'] or []
        .filter((_, index) => index === 0) // ['file 1'] or []
        .map(name => danger.git.diffForFile(name)) // [Promise] or []
        .find((_, index) => index === 0) || Promise.resolve(null)); // Promise

      if (nvmrcFile) {
        return nvmrcFile.after;
      } else {
        return null;
      }
    })();

    if (packageJsonNodeVersion && nvmrcNodeVersion && packageJsonNodeVersion !== nvmrcNodeVersion) {
      warn([`The node version is different between ".nvmrc" (${nvmrcNodeVersion})`,
      ` and "package.json" (${packageJsonNodeVersion}), please fix the inconsistency`].join(''));
    } else if (nvmrcNodeVersion && !packageJsonNodeVersion) {
      warn(`The PR changes the node version on ".nvmrc" file. Please remember to update on "package.json" file.`);
    } else if (packageJsonNodeVersion && !nvmrcNodeVersion) {
      warn(`The PR changes the node version on "package.json" file. Please remember to update on ".nvmrc" file.`);
    }
  },

};
