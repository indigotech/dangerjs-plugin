import taqtileDangerjsPlugin from './index';
import pr from './rules/pr';

declare const global: any;

describe('taqtileDangerjsPlugin()', () => {

  const rules = [pr];

  beforeEach(() => {
    global.warn = jest.fn();
    global.message = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();

    rules.forEach((rule: any) => {
      Object
        .keys(rule)
        .filter(property => rule.hasOwnProperty(property))
        .forEach(property => rule[property] = jest.fn());
    });
  });

  afterEach(() => {
    global.warn = undefined;
    global.message = undefined;
    global.fail = undefined;
    global.markdown = undefined;
  });

  it('Checks if all rules have been called', () => {

    taqtileDangerjsPlugin();

    rules.forEach((rule: any) => {
      Object
        .keys(rule)
        .filter(property => rule.hasOwnProperty(property))
        .forEach(property => expect(rule[property]).toHaveBeenCalledTimes(1));
    });

  });
});
