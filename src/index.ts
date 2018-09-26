// Provides dev-time type structures for  `danger` - doesn't affect runtime.
// import {DangerDSLType} from '../node_modules/danger/distribution/dsl/DangerDSL';

// declare const danger: DangerDSLType;
// export declare function message(message: string): void;
// export declare function warn(message: string): void;
// export declare function fail(message: string): void;
// export declare function markdown(message: string): void;

import { danger, warn, markdown } from "danger"

// Taqtile rules
import { Rule, Scope } from './rule.type';
import * as rules from './rules';

/**
 * Taqtile Danger-js Plugin
 */
export default async function taqtileDangerjsPlugin() {

  await Object
    .keys(rules)
    .filter(property => rules.hasOwnProperty(property))
    .map(property => rules[property] as Scope)
    .map(scope => Object.keys(scope).map(rule => scope[rule] as Rule))
    .reduce((p, c) => p.concat(c), [])
    .map(rule => rule());

}
