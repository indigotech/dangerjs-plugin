// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import {DangerDSLType} from '../node_modules/danger/distribution/dsl/DangerDSL';
declare var danger: DangerDSLType;
export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

// Taqtile rules
import pr from './rules/pr';

export default function taqtileDangerjsPlugin() {
  [pr].forEach((rule: any) => {
    Object
      .keys(rule)
      .filter(property => rule.hasOwnProperty(property))
      .forEach(property => rule[property]());
  });
}
