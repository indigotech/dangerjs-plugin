// Provides dev-time type structures for  `danger` - doesn't affect runtime.
// import {DangerDSLType} from '../../node_modules/danger/distribution/dsl/DangerDSL';
// declare const danger: DangerDSLType;

// export declare function message(message: string): void;
// export declare function warn(message: string): void;
// export declare function fail(message: string): void;
// export declare function markdown(message: string): void;

import { danger, message, warn, markdown } from "danger"

import { Scope } from '../rule.type';

/**
 * PR rules
 */
export let pr: Scope = {
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

};
