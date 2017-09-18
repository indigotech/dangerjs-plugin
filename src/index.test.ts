import taqtileDangerjsPlugin from './index';

import { Rule, Scope } from './rule.type';
import * as rules from './rules';

declare const global: any;

describe('taqtileDangerjsPlugin()', () => {

  beforeEach(() => {
    global.warn = jest.fn();
    global.message = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();

    // mocks all rules from all ≠ scopes
    Object
    .keys(rules)
    .filter(property => rules.hasOwnProperty(property))
    .map(property => rules[property] as Scope)
    .map(scope => Object.keys(scope).forEach(rule => scope[rule] = jest.fn(() => Promise.resolve())));
  });

  afterEach(() => {
    global.warn = undefined;
    global.message = undefined;
    global.fail = undefined;
    global.markdown = undefined;
  });

  it('Checks if all rules have been called', async () => {

    await taqtileDangerjsPlugin();

    Object
      .keys(rules)
      .filter(property => rules.hasOwnProperty(property))
      .map(property => rules[property] as Scope)
      .map(scope => Object.keys(scope).forEach(rule => expect(scope[rule]).toHaveBeenCalled()));

  });

});
