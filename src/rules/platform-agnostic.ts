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
export let platformAgnostic = {
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

};
