// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import {DangerDSLType} from '../../node_modules/danger/distribution/dsl/DangerDSL';
import { changedFilesContainsRegex, warnIfFilesChanged } from '../utils';
declare const danger: DangerDSLType;

export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

/**
 * PR rules
 */
export let android = {

  /**  Warn when .gradle or Manifest.xml files are modified */
  async modifiedGradleOrManifest() {
    const hasFileWithPattern = (array: string[], pattern: RegExp): boolean => {
      const fileChanged = array.findIndex(file => pattern.test(file)) > -1;
      return fileChanged;
    };

    if (hasFileWithPattern(danger.git.modified_files, /Manifest.xml/ig)) {
      warn('This PR changes the "Manifest.xml" file.');
    }

    if (hasFileWithPattern(danger.git.modified_files, /\.gradle/)) {
      warn('This PR changes the ".gradle" file.');
    }
  },

  /** Warn when hardcoded dimens are found */
  async hardcodedDimens() {
    if (await changedFilesContainsRegex(/(["'])[1-9]+\d*(dp|sp|pt|px|in|mm)\s*\1/ig)) {
      warn(['This PR has a hardcoded dimens. ',
      'Please prefer adding all dimens in a dimens.xml file'].join(''));
    }
  },

  /** Warn when hardcoded colors are found */
  async hardcodedColors() {
    if (await changedFilesContainsRegex(/(["'])#[0-9a-fA-F]{6,8}\s*\1/ig)) {
      warn(['This PR has a hardcoded colors. ',
      'Please prefer adding all colors in a colors.xml file'].join(''));
    }
  },

};
