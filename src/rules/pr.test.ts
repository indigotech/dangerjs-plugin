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

  describe('Lockfiles', () => {

    it('Doest not warn if just lockfiles are modified', () => {
      global.danger = {
        git: { modified_files: ['Gemfile.lock', 'yarn.lock'] },
      };
      pr.lockfiles();
      expect(global.warn).toHaveBeenCalledTimes(0);
    });

    it('Doest not warn if package.json and Gemfile did not change', () => {
      global.danger = {
        git: { modified_files: ['native/', 'yarn.lock'] },
      };
      pr.lockfiles();
      expect(global.warn).toHaveBeenCalledTimes(0);
    });

    it('Warns if Gemfile is modified and Gemfile.lock don\'t', () => {
      global.danger = {
        git: { modified_files: ['Gemfile'] },
      };
      pr.lockfiles();
      expect(global.warn).toHaveBeenCalledWith(
        `Changes were made to Gemfile, but not to Gemfile.lock - <i>Perhaps you need to run \`bundle install\`?</i>`);
    });

    it('Doest not warn if Gemfile and Gemfile.lock are modified', () => {
      global.danger = {
        git: { modified_files: ['Gemfile', 'Gemfile.lock'] },
      };
      pr.lockfiles();
      expect(global.warn).toHaveBeenCalledTimes(0);
    });

    it('Warns if package.json is modified and yarn.lock don\'t', () => {
      global.danger = {
        git: { modified_files: ['package.json'] },
      };
      pr.lockfiles();
      expect(global.warn).toHaveBeenCalledWith(
        `Changes were made to package.json, but not to yarn.lock - <i>Perhaps you need to run \`yarn install\`?</i>`);
    });

    it('Doest not warn if package.json and yarn.lock are modified', () => {
      global.danger = {
        git: { modified_files: ['package.json', 'yarn.lock'] },
      };
      pr.lockfiles();
      expect(global.warn).toHaveBeenCalledTimes(0);
    });

    it('Check for lockfiles outside the root directory', () => {
      global.danger = {
        git: { modified_files: ['native/package.json'] },
      };
      pr.lockfiles();
      expect(global.warn).toHaveBeenCalledWith(
        `Changes were made to package.json, but not to yarn.lock - <i>Perhaps you need to run \`yarn install\`?</i>`);
    });

    it('Doest not warn if package.json and yarn.lock are modified outside the root directory', () => {
      global.danger = {
        git: { modified_files: ['native/package.json', 'native/yarn.lock'] },
      };
      pr.lockfiles();
      expect(global.warn).toHaveBeenCalledTimes(0);
    });

  });

});
