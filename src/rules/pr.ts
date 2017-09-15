// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import {DangerDSLType} from '../../node_modules/danger/distribution/dsl/DangerDSL';
declare const danger: DangerDSLType;

export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

/**
 * PR rules
 */
export let pr = {
  /** Checks presence of PR description */
  async body() {
    const body = danger.github.pr.body;
    if (!body) {
      fail('This PR does not have a description.');
    } else if (body.length < 10) {
      warn('This PR description seems too short.');
    }
  },

  /** Warns if a PR is too big */
  async size() {
    const github = danger.github.pr;
    if (github.deletions - github.additions > 200) {
      message('🎉 Yay! Cheers for some code refactoring!');
    } else if (github.additions + github.deletions > 500) {
      warn('Big PR!');
    }
  },

  /**
   * Warns a Gemfile or package.json is changed and its lockfiles not
   */
  lockfiles() {
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

};
