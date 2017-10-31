import * as Faker from 'faker';

import { ios } from './ios';

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

    describe('Cakefile or settings.yml.erb or Fastfile', () => {

        it('Should warn when Cakefile is modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['Cakefile', 'any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedGradleOrManifest();

            expect(global.warn).toBeCalled();
        });

        it('Should warn when settings.yml.erb is modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['settings.yml.erb', 'any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedGradleOrManifest();

            expect(global.warn).toBeCalled();
        });

        it('Should warn when Fastfile is modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['Fastfile', 'any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedGradleOrManifest();

            expect(global.warn).toBeCalled();
        });

        it('Should warn when Cakefile and settings.yml.erb and Fastfile are modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['Cakefile', 'settings.yml.erb', 'Fastfile', 'any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedGradleOrManifest();

            expect(global.warn).toHaveBeenCalledTimes(3);
        });

        it('Should not warn when Cakefile or settings.yml.erb or Fastfile are not modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedGradleOrManifest();

            expect(global.warn).not.toBeCalled();
        });
    });
});
