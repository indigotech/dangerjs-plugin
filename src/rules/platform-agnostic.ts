// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import {DangerDSLType} from '../../node_modules/danger/distribution/dsl/DangerDSL';
declare const danger: DangerDSLType;

export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

import { Scope } from '../rule.type';
import { warnIfFilesChanged } from '../utils';

export const filesToCheck = [
  'Dangerfile',
  '.gitignore',
  'Gemfile',
  'Gemfile.lock',
  '.travis.yml',
  'coverage',
];

/**
 * Platform Agnostic rules
 */
export let platformAgnostic: Scope = {

  /** Warns when key config files have been modified */
  async shouldNotHaveBeenChanged() {
    warnIfFilesChanged(filesToCheck);
  },

  /**
   * Warns a Gemfile or package.json is changed and its lockfiles not
   */
  async lockfiles() {
    const includesFileWithPattern = (array: string[], pattern: string): boolean => {
      const patternRegex = new RegExp(`.*${pattern}`, 'g');
      const fileChanged = array.findIndex(file => patternRegex.test(file)) > -1;
      return fileChanged;
    };

    const checkModifiedFileInconsistency = (source: string, target: string, ideaMessage: string) => {
      const sourceFileChanged = includesFileWithPattern(danger.git.modified_files, source);
      const targetFileChanged = includesFileWithPattern(danger.git.modified_files, target);
      const inconsistencyInFiles = sourceFileChanged && !targetFileChanged;
      if (inconsistencyInFiles) {
        const errorMessage = `Changes were made to ${source}, but not to ${target}`;
        warn(`${errorMessage} - <i>${ideaMessage}</i>`);
      }
    };

    checkModifiedFileInconsistency('package.json', 'yarn.lock', 'Perhaps you need to run `yarn install`?');
    checkModifiedFileInconsistency('Gemfile', 'Gemfile.lock', 'Perhaps you need to run `bundle install`?');
  },

  /** Warns if http:// was used instead of https:// */
  async http() {
    const files = ([] as string[]).concat(
      danger.git.created_files  || [],
      danger.git.modified_files || [],
    );

    for (const file of files) {
      const diff = await danger.git.diffForFile(file);

      if (diff && diff.added.match(/http:\/\//ig)) {
        warn('This PR has `http://` (instead of `https://`), may be a review is needed for security reasons');
        break;
      }
    }
  },

  /** Warns when Dangerfile was modified */
  async dangerfile() {
    const files = ([] as string[]).concat(
      danger.git.modified_files || [],
    );

    for (const file of files) {
      if (file.match('Dangerfile')) {
        warn('Dangerfile was modified.');
        break;
      }
    }
  },

  /** Warns if >>>>>> is found, may be a rebase was not properly executed and some files are corrupt */
  async rebase() {
    const files = ([] as string[]).concat(
      danger.git.created_files  || [],
      danger.git.modified_files || [],
    );

    for (const file of files) {
      const diff = await danger.git.diffForFile(file);

      if (diff && diff.added.match(/^>>>>>>>/gm)) {
        warn('This PR has lines starting with `>>>>>>>`, may be there was a rebase issue and some files are corrupt');
        break;
      }
    }
  },

};
