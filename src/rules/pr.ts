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
export default {
  /** Checks presence of PR description */
  body() {
    const body = danger.github.pr.body;
    if (!body) {
      fail('Please add a description to your PR.');
    } else if (body.length < 10) {
      warn('Your PR description is too short, please elaborate more.');
    }
  },

  /** Warns if a PR is too big */
  size() {
    const pr = danger.github.pr;
    if (pr.additions + pr.deletions > 500) {
      warn('Big PR!');
    }
  },
};
