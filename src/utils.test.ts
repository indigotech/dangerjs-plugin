import * as Faker from 'faker';
import { changedFilesContainsRegex, warnIfFilesChanged } from './utils';

declare const global: any;

describe('Utils', () => {

  let warnMock: jest.Mock<any>;

  beforeEach(() => {
    warnMock = jest.fn();
    global.warn = jest.fn(warnMock);
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

  const file = 'file.txt';
  const regExpFile = /[\s\S].txt/;

  describe('warnIfFilesChanged', () => {

    it(`Checks if warns when a file is modified`, async () => {

      global.danger = {
        git: { modified_files: ['a random file', file, 'another random file'] },
      };
      await warnIfFilesChanged([file]);

      expect(global.warn).toBeCalled();

      const expected = [
        expect.stringMatching('The following files are rarely modified but were commited'),
        expect.stringMatching(file),
      ];
      expect(warnMock.mock.calls[0]).toEqual(expect.arrayContaining(expected));
    });

    it(`Checks if warns when a file is deleted`, async () => {
      global.danger = {
        git: { deleted_files: ['a random file', file, 'another random file'] },
      };
      await await warnIfFilesChanged([file]);

      expect(global.warn).toBeCalled();

      const expected = [
        expect.stringMatching('The following files are rarely modified but were commited'),
        expect.stringMatching(file),
      ];
      expect(warnMock.mock.calls[0]).toEqual(expect.arrayContaining(expected));
    });

    it(`Checks if warns when file is RegExp`, async () => {
      global.danger = {
        git: { modified_files: ['a random file', file, 'another random file'] },
      };
      await await warnIfFilesChanged([file]);

      expect(global.warn).toBeCalled();

      const expected = [
        expect.stringMatching('The following files are rarely modified but were commited'),
        expect.stringMatching(regExpFile),
      ];
      expect(warnMock.mock.calls[0]).toEqual(expect.arrayContaining(expected));
    });

  });

  describe('changedFilesContainsRegex', () => {

    it('Should return true if any file contain regex', async () => {
      global.danger = {
        git: {
          modified_files: ['a random file', 'another random file'],
          diffForFile: jest.fn(() => ({
            added: `
              any text ...
              code
              mote text ...
            `,
          })),
        },
      };

      const containRegexp = await await changedFilesContainsRegex(/code/g);

      expect(containRegexp).toBeTruthy();
    });

    it('Should return true if an specific file contains a regex', async () => {
      global.danger = {
        git: {
          modified_files: ['a random file', file, 'another random file'],
          diffForFile: jest.fn((fileName: string) => {
            if (fileName === file) {
              return {
                added: `
                  any text ...
                  code
                  mote text ...
                `,
              };
            } else {
              return {
                added: `
                  any text ...
                  mote text ...
                `,
              };
            }
          }),
        },
      };

      const containRegexp = await await changedFilesContainsRegex(/code/g, [file]);

      expect(containRegexp).toBeTruthy();
    });

    it('Should return false if any file do not contain a regex', async () => {
      global.danger = {
        git: {
          modified_files: ['a random file', 'another random file'],
          diffForFile: jest.fn(() => ({
            added: `
              any text ...
              code
              mote text ...
            `,
          })),
        },
      };

      const containRegexp = await await changedFilesContainsRegex(/code2/g, [file]);

      expect(containRegexp).toBeFalsy();
    });
  });

});
