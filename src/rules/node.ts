// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import {DangerDSLType} from '../../node_modules/danger/distribution/dsl/DangerDSL';
declare const danger: DangerDSLType;

export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

// adapted from https://stackoverflow.com/a/37324915/429521
const intersect = <T>(xs: T[], ys: T[]): T[] => xs.filter(x => ys.some(y => y === x));

export const filesToCheck = [
  'yarn.lock',
  'npm-shrinkwrap.json',
  'docker-compose.yml',
  'Procfile',
  'node_modules',
  'tasks/options/env.coffee',
  'tslint.json',
  'tsconfig.json',
  '.nvmrc',
  '.env',
  '.env.test',
  '.env.sample',
  'nodemon.json',
  'Dangerfile',
];

/**
 * PR rules
 */
export let node = {
  /** Warns when ckey config files have been modified */
  async shouldNotHaveBeenChanged() {

    const files = ([] as string[]).concat(
      danger.git.deleted_files  || [],
      danger.git.modified_files || [],
    );

    const toWarn = intersect(filesToCheck, files);

    if (toWarn.length > 0) {
      warn(`The following files are rarely modified but were commited: ${toWarn.map(f => `'${f}'`).join(', ')}`);
    }
  },

  /** Warns when 'console.log' is added to code */
  async consoleLog() {
    const files = ([] as string[]).concat(
      danger.git.created_files  || [],
      danger.git.modified_files || [],
    );

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < files.length; i++) {
      const file = await danger.git.diffForFile(files[i]);
      if (file && file.added.match(/console\.log/ig)) {
        warn('This PR adds `console.log` to code.');
        // breaks to avoid reading all files when we already know that there is an issue
        break;
      }
    }
  },

  /** Warns when 'npm install -g' is added to code */
  async npmGlobal() {
    const files = ([] as string[]).concat(
      danger.git.created_files  || [],
      danger.git.modified_files || [],
    );

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < files.length; i++) {
      const file = await danger.git.diffForFile(files[i]);
      if (file && file.added.match(/npm install \-g/ig)) {
        // tslint:disable-next-line:max-line-length
        fail(['This PR adds `npm install \-g` instuctions to the project, ',
          'please prefer adding packages as `dependencies` or `devDependencies` to `package.json` instead. ',
          'More info at https://github.com/typeorm/typeorm/pull/599'].join(''));
        // breaks to avoid reading all files when we already know that there is an issue
        break;
      }
    }
  },
};
