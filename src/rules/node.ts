// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import {DangerDSLType} from '../../node_modules/danger/distribution/dsl/DangerDSL';
declare const danger: DangerDSLType;

export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

import { Scope } from '../rule.type';
/**
 * Return true if there is any match with pattern on any file created or modified.
 * Return false otherwise.
 * @param pattern Regex pattern
 */
const changedFilesContainsRegex = async (pattern: RegExp): Promise<boolean> => {
  const files = ([] as string[]).concat(
    danger.git.created_files  || [],
    danger.git.modified_files || [],
  );

  for (const fileName of files) {
    const file = await danger.git.diffForFile(fileName);
    if (file && file.added.match(pattern)) {
      // return to avoid reading all files when we already know that there is an issue
      return true;
    }
  }
  return false;
};

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
      const packageJsonIndex = files.findIndex(fileName => fileName.match(/package\.json/gi) !== null);
      let packageJsonNodeVersionValue;
      if (packageJsonIndex > -1) {
        const packageJsonFile = await danger.git.JSONDiffForFile(files[packageJsonIndex]);
        if (packageJsonFile.engines && packageJsonFile.engines.after) {
          packageJsonNodeVersionValue = packageJsonFile.engines.after.node;
        }
      }
      return packageJsonNodeVersionValue;
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
