import pr from './pr';

declare const global: any;

describe('PR info', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.message = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();
  });

  afterEach(() => {
    global.warn = undefined;
    global.message = undefined;
    global.fail = undefined;
    global.markdown = undefined;
  });

  it('Checks if PR has a body', () => {
    global.danger = {
      github: { pr: { body: '' } },
    };

    pr.body();

    expect(global.fail).toHaveBeenCalledWith(
      'Please add a description to your PR.',
    );
  });

  it('Checks if PR has a lengthy body', () => {
    global.danger = {
      github: { pr: { body: 'Short txt' } },
    };

    pr.body();

    expect(global.warn).toHaveBeenCalledWith(
      'Your PR description is too short, please elaborate more.',
    );
  });

});
