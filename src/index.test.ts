import taqtileDangerjsPlugin from './index';

import * as rules from './rules';

declare const global: any;

describe('taqtileDangerjsPlugin()', () => {

  beforeEach(() => {
    global.warn = jest.fn();
    global.message = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();

    Object
      .keys(rules)
      .filter(property => rules.hasOwnProperty(property))
      .forEach(property => rules[property] = jest.fn());
  });

  afterEach(() => {
    global.warn = undefined;
    global.message = undefined;
    global.fail = undefined;
    global.markdown = undefined;
  });

  it('Checks if all rules have been called', () => {

    taqtileDangerjsPlugin();

    Object
    .keys(rules)
    .filter(property => rules.hasOwnProperty(property))
    .forEach(property => expect(rules[property]).toHaveBeenCalledTimes(1));

  });
});
