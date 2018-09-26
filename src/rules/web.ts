// Provides dev-time type structures for  `danger` - doesn't affect runtime.
// import {DangerDSLType} from '../../node_modules/danger/distribution/dsl/DangerDSL';
// declare const danger: DangerDSLType;

// export declare function message(message: string): void;
// export declare function warn(message: string): void;
// export declare function fail(message: string): void;
// export declare function markdown(message: string): void;

import { danger, message, warn, markdown } from "danger"

import { Scope } from '../rule.type';
import { warnIfFilesChanged } from '../utils';

/**
 * Web rules
 */
export let web: Scope = {

  /** Message if css files were changed */
  async css() {
    const files = ([] as string[]).concat(
      danger.git.created_files  || [],
      danger.git.deleted_files  || [],
      danger.git.modified_files || [],
    );

    for (const file of files) {
      if (file.match(/\.styl|\.css|\.less|\.sass/ig)) {
        message('CSS modifications files were included in this PR');
        // breaks to avoid reading all files when we already know that there is an issue
        break;
      }
    }
  },
};
