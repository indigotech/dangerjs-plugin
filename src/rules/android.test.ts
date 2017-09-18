import * as Faker from 'faker';

import { android } from './android';

declare const global: any;

describe('Node info', () => {

  let warnMock: jest.Mock<any>;

  beforeEach(() => {
    warnMock = jest.fn();
    global.warn = jest.fn(warnMock);
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

  describe('.gradle or manifest.xml', () => {
    it('Should warn when .gradle is modified', async () => {
      global.danger = {
        git: {
          modified_files: ['.gradle', 'any'],
          created_files: ['any'],
        },
      };

      await android.modifiedGradleOrManifest();

      expect(global.warn).toBeCalled();
    });

    it('Should warn when manifest.xml is modified', async () => {
      global.danger = {
        git: {
          modified_files: ['manifest.xml', 'any'],
          created_files: ['any'],
        },
      };

      await android.modifiedGradleOrManifest();

      expect(global.warn).toBeCalled();
    });

    it('Should warn when manifest.xml and .gradle are modified', async () => {
      global.danger = {
        git: {
          modified_files: ['manifest.xml', '.gradle', 'any'],
          created_files: ['any'],
        },
      };

      await android.modifiedGradleOrManifest();

      expect(global.warn).toHaveBeenCalledTimes(2);
    });

    it('Should not warn when .gradle or manifest.xml are not modified', async () => {
      global.danger = {
        git: {
          modified_files: ['any'],
          created_files: ['any'],
        },
      };

      await android.modifiedGradleOrManifest();

      expect(global.warn).not.toBeCalled();
    });
  });

});
