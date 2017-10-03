import * as Faker from 'faker';
import { warnIfFilesChanged } from './utils';

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

  describe('warnIfFilesChanged', () => {
    const file = 'file.txt';

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

  });

});
