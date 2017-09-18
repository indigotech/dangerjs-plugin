import * as Faker from 'faker';
import { pr } from './pr';

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

  describe('Body', () => {

    it('Checks if PR has a body', async () => {
      global.danger = {
        github: { pr: { body: '' } },
      };
      await pr.body();
      expect(global.fail).toHaveBeenCalledWith('This PR does not have a description.');
    });

    it('Checks if PR has a lengthy body', async () => {
      global.danger = {
        github: { pr: { body: Faker.random.alphaNumeric(9) } },
      };
      await pr.body();
      expect(global.warn).toHaveBeenCalledWith('This PR description seems too short.');
    });

    it('Does not warn or fails when PR has a valid description', async () => {
      global.danger = {
        github: { pr: { body: Faker.lorem.paragraphs() } },
      };
      await pr.body();
      expect(global.warn).toHaveBeenCalledTimes(0);
      expect(global.fail).toHaveBeenCalledTimes(0);
    });

  });

  describe('Size', () => {

    it('Checks if PR is too big', async () => {
      global.danger = {
        github: { pr: { additions: 450, deletions: 150 } },
      };
      await pr.size();
      expect(global.warn).toHaveBeenCalledWith('Big PR!');
    });

    it('Congratulates when way more deletions than addition', async () => {
      global.danger = {
        github: { pr: { additions: 100, deletions: 320 } },
      };
      await pr.size();
      expect(global.message).toHaveBeenCalledWith('🎉 Yay! Cheers for some code refactoring!');
    });

    it('Does not warn if PR size is ok', async () => {
      global.danger = {
        github: { pr: { additions: 100, deletions: 100 } },
      };
      await pr.size();
      expect(global.warn).toHaveBeenCalledTimes(0);
      expect(global.message).toHaveBeenCalledTimes(0);
    });

  });

});
