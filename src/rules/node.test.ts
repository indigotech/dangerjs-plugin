import * as Faker from 'faker';

import { filesToCheck, node } from './node';

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

  describe('Modified files', () => {

    it('Should not warn when modified files are not on the to watch list', async () => {
      global.danger = {
        git: { modified_files: ['a random file', 'another random file'] },
      };
      await node.shouldNotHaveBeenChanged();

      expect(global.warn).not.toBeCalled();

    });

    it('Should not warn when deleted files are not on the to watch list', async () => {
      global.danger = {
        git: { deleted_files: ['a random file', 'another random file'] },
      };
      await node.shouldNotHaveBeenChanged();

      expect(global.warn).not.toBeCalled();

    });

    filesToCheck.forEach(file => {
      it(`Checks if warns when ${file} is modified`, async () => {
        global.danger = {
          git: { modified_files: ['a random file', file, 'another random file'] },
        };
        await node.shouldNotHaveBeenChanged();

        expect(global.warn).toBeCalled();

        const expected = [
          expect.stringMatching('The following files are rarely modified but were commited'),
          expect.stringMatching(file),
        ];
        expect(warnMock.mock.calls[0]).toEqual(expect.arrayContaining(expected));
      });

      it(`Checks if warns when ${file} is deleted`, async () => {
        global.danger = {
          git: { deleted_files: ['a random file', file, 'another random file'] },
        };
        await node.shouldNotHaveBeenChanged();

        expect(global.warn).toBeCalled();

        const expected = [
          expect.stringMatching('The following files are rarely modified but were commited'),
          expect.stringMatching(file),
        ];
        expect(warnMock.mock.calls[0]).toEqual(expect.arrayContaining(expected));
      });

    });

  });

  describe('console.log', () => {

    it('Should warn when console.log is added to code', async () => {
      global.danger = {
        git: {
          modified_files: ['any'],
          created_files: ['any'],
          diffForFile: jest.fn(() => ({
            added: `
            any text;
            console.log(variable);
            more text;`,
          })),
        },
      };
      await node.consoleLog();

      expect(global.warn).toBeCalledWith('This PR adds `console.log` to code.');

    });

    it('Should not warn about `console.log` when it was not added to code', async () => {
      global.danger = {
        git: {
          modified_files: ['any'],
          created_files: ['any'],
          diffForFile: jest.fn(() => ({
            added: `
            any text;
            more text;`,
          })),
        },
      };

      await node.consoleLog();

      expect(global.fail).not.toBeCalled();

    });
  });
  describe('npm install -g', () => {

    it('Should warn about `npm install -g` when it was added to code', async () => {
      global.danger = {
        git: {
          modified_files: ['any'],
          created_files: ['any'],
          diffForFile: jest.fn(() => ({
            added: `
            any text;
            npm install -g any-package
            more text;`,
          })),
        },
      };

      await node.npmGlobal();

      expect(global.fail).toBeCalled();

    });

    it('Should not warn about `npm install -g` when it was not added to code', async () => {
      global.danger = {
        git: {
          modified_files: ['any'],
          created_files: ['any'],
          diffForFile: jest.fn(() => ({
            added: `
            any text;
            more text;`,
          })),
        },
      };

      await node.npmGlobal();

      expect(global.fail).not.toBeCalled();

    });

  });

  describe('node version', () => {

    it('Should warn about node version probably inconsistency on `.nvmrc` file', async () => {
      global.danger = {
        git: {
          modified_files: ['package.json'],
          created_files: ['any'],
          JSONDiffForFile: jest.fn(() => ({
            engines: {
              after: {
                node: `8.4.0`,
              },
            },
          })),
        },
      };

      await node.nodeVersion();

      expect(global.warn).toBeCalled();
    });

    it('Should warn about node version probably inconsistency on `package.json` file', async () => {
      global.danger = {
        git: {
          modified_files: ['package.json', '.nvmrc'],
          created_files: ['any'],
          diffForFile: jest.fn(() => ({
            after: `8.4.0`,
          })),
          JSONDiffForFile: jest.fn(() => ({})),
        },
      };

      await node.nodeVersion();

      expect(global.warn).toBeCalled();
    });

    it('Should warn about different node version in files', async () => {
      global.danger = {
        git: {
          modified_files: ['package.json'],
          created_files: ['.nvmrc'],
          diffForFile: jest.fn(() => ({
            after: `8.4.0`,
          })),
          JSONDiffForFile: jest.fn(() => ({
            engines: {
              after: {
                node: `8.1.0`,
              },
            },
          })),
        },
      };

      await node.nodeVersion();

      expect(global.warn).toBeCalled();
    });

    it('Should not warn about node version inconsistency', async () => {
      global.danger = {
        git: {
          modified_files: ['package.json'],
          created_files: ['.nvmrc'],
          diffForFile: jest.fn(() => ({
            after: `8.4.0`,
          })),
          JSONDiffForFile: jest.fn(() => ({
            engines: {
              after: {
                node: `8.4.0`,
              },
            },
          })),
        },
      };

      await node.nodeVersion();

      expect(global.warn).not.toBeCalled();
    });

  });

});
