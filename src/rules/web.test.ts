import * as Faker from 'faker';
import { web } from './web';

declare const global: any;

describe('Web', () => {

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

  describe('CSS', () => {

    it('Does not message if no style files were included in the PR', async () => {
      global.danger = {
        git: {
          created_files: ['any'],
          modified_files: ['any'],
          deleted_files: ['any'],
        },
      };
      await web.css();
      expect(global.message).not.toBeCalled();
    });

    it('Does message if style files were added', async () => {
      global.danger = {
        git: {
          created_files: ['any', 'file.styl'],
          modified_files: ['any'],
          deleted_files: ['any'],
        },
      };
      await web.css();
      expect(global.message).toBeCalled();
    });

    it('Does message if style files were modified', async () => {
      global.danger = {
        git: {
          created_files: ['any'],
          modified_files: ['any', 'file.styl'],
          deleted_files: ['any'],
        },
      };
      await web.css();
      expect(global.message).toBeCalled();
    });

    it('Does message if style files were removed', async () => {
      global.danger = {
        git: {
          created_files: ['any'],
          modified_files: ['any'],
          deleted_files: ['any', 'file.styl'],
        },
      };
      await web.css();
      expect(global.message).toBeCalled();
    });

  });

});
