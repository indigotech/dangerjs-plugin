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
export let android = {

  /**  Warn when .gradle or Manifest.xml files are modified */
  async modifiedGradleOrManifest() {
    const hasFileWithPattern = (array: string[], pattern: string): boolean => {
      const patternRegex = new RegExp(`.*${pattern}`, 'gi');
      const fileChanged = array.findIndex(file => patternRegex.test(file)) > -1;
      return fileChanged;
    };

    if (hasFileWithPattern(danger.git.modified_files, 'Manifest.xml')) {
      warn('This PR changes the "Manifest.xml" file.');
    }

    if (hasFileWithPattern(danger.git.modified_files, '.gradle')) {
      warn('This PR changes the ".gradle" file.');
    }
  },

};
