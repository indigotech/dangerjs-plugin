import * as Faker from 'faker';
import { platformAgnostic } from './platform-agnostic';

declare const global: any;

describe('Platform Agnostic', () => {
  beforeEach(async () => {
    global.warn = jest.fn();
    global.message = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();
  });

  afterEach(async () => {
    global.warn = undefined;
    global.message = undefined;
    global.fail = undefined;
    global.markdown = undefined;
  });

  describe('Lockfiles', () => {

    it('Doest not warn if just lockfiles are modified', async () => {
      global.danger = {
        git: { modified_files: ['Gemfile.lock', 'yarn.lock'] },
      };
      await platformAgnostic.lockfiles();
      expect(global.warn).toHaveBeenCalledTimes(0);
    });

    it('Doest not warn if package.json and Gemfile did not change', async () => {
      global.danger = {
        git: { modified_files: ['native/', 'yarn.lock'] },
      };
      await platformAgnostic.lockfiles();
      expect(global.warn).toHaveBeenCalledTimes(0);
    });

    it('Warns if Gemfile is modified and Gemfile.lock don\'t', async () => {
      global.danger = {
        git: { modified_files: ['Gemfile'] },
      };
      await platformAgnostic.lockfiles();
      expect(global.warn).toHaveBeenCalledWith(
        `Changes were made to Gemfile, but not to Gemfile.lock - <i>Perhaps you need to run \`bundle install\`?</i>`);
    });

    it('Doest not warn if Gemfile and Gemfile.lock are modified', async () => {
      global.danger = {
        git: { modified_files: ['Gemfile', 'Gemfile.lock'] },
      };
      await platformAgnostic.lockfiles();
      expect(global.warn).toHaveBeenCalledTimes(0);
    });

    it('Warns if package.json is modified and yarn.lock don\'t', async () => {
      global.danger = {
        git: { modified_files: ['package.json'] },
      };
      await platformAgnostic.lockfiles();
      expect(global.warn).toHaveBeenCalledWith(
        `Changes were made to package.json, but not to yarn.lock - <i>Perhaps you need to run \`yarn install\`?</i>`);
    });

    it('Doest not warn if package.json and yarn.lock are modified', async () => {
      global.danger = {
        git: { modified_files: ['package.json', 'yarn.lock'] },
      };
      await platformAgnostic.lockfiles();
      expect(global.warn).toHaveBeenCalledTimes(0);
    });

    it('Check for lockfiles outside the root directory', async () => {
      global.danger = {
        git: { modified_files: ['native/package.json'] },
      };
      await platformAgnostic.lockfiles();
      expect(global.warn).toHaveBeenCalledWith(
        `Changes were made to package.json, but not to yarn.lock - <i>Perhaps you need to run \`yarn install\`?</i>`);
    });

    it('Doest not warn if package.json and yarn.lock are modified outside the root directory', async () => {
      global.danger = {
        git: { modified_files: ['native/package.json', 'native/yarn.lock'] },
      };
      await platformAgnostic.lockfiles();
      expect(global.warn).toHaveBeenCalledTimes(0);
    });

  });

  describe('http', () => {

    it('Should warn when http is used instead of https', async () => {
      global.danger = {
        git: {
          modified_files: ['any'],
          created_files: ['any'],
          diffForFile: jest.fn(() => ({
            added: `
            any text;
            http://google.com;
            more text;`,
          })),
        },
      };

      await platformAgnostic.http();
      // tslint:disable-next-line:max-line-length
      expect(global.warn).toBeCalledWith('This PR has `http://` (instead of `https://`), may be a review is needed for security reasons');
    });

    it('Should not warn about http when it was not used', async () => {
      global.danger = {
        git: {
          modified_files: ['any'],
          created_files: ['any'],
          diffForFile: jest.fn(() => ({
            added: `
            any text;
            https://google.com
            more text;`,
          })),
        },
      };

      await platformAgnostic.http();
      expect(global.fail).not.toBeCalled();
    });

    it('Should not warn about http when false positives were used', async () => {
      global.danger = {
        git: {
          modified_files: ['any'],
          created_files: ['any'],
          diffForFile: jest.fn(() => ({
            added: `
            any text;
            https://google.com
            okHttpClient
            httpClient
            this is a http on a comment
            more text;`,
          })),
        },
      };

      await platformAgnostic.http();
      expect(global.fail).not.toBeCalled();
    });

  });

});
