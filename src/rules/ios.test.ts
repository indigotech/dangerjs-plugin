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

    const plistFile = 'file.plist';

    describe('Cakefile or settings.yml.erb or Fastfile', () => {

        it('Should warn when Cakefile is modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['Cakefile', 'any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedCakefileOrSettingsYmlOrFastlane();

            expect(global.warn).toBeCalled();
        });

        it('Should warn when settings.yml.erb is modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['settings.yml.erb', 'any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedCakefileOrSettingsYmlOrFastlane();

            expect(global.warn).toBeCalled();
        });

        it('Should warn when Fastfile is modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['Fastfile', 'any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedCakefileOrSettingsYmlOrFastlane();

            expect(global.warn).toBeCalled();
        });

        it('Should warn when Cakefile and settings.yml.erb and Fastfile are modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['Cakefile', 'settings.yml.erb', 'Fastfile', 'any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedCakefileOrSettingsYmlOrFastlane();

            expect(global.warn).toHaveBeenCalledTimes(3);
        });

        it('Should not warn when Cakefile or settings.yml.erb or Fastfile are not modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedCakefileOrSettingsYmlOrFastlane();

            expect(global.warn).not.toBeCalled();
        });
    });

    describe('Podfile was modified and Podfile.lock was not', () => {

        it('Should warn when Podfile is modified and Podfile.lock is not', async () => {
            global.danger = {
                git: {
                    modified_files: ['Podfile', 'any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedPodfileAndNotModifiedPodfileLock();

            expect(global.warn).toBeCalled();
        });

        it('Should not warn when Podfile is not modified and Podfile.lock is modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['Podfile.lock', 'any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedPodfileAndNotModifiedPodfileLock();

            expect(global.warn).not.toBeCalled();
        });

        it('Should not warn when Podfile and Podfile.lock are modified', async () => {
            global.danger = {
                git: {
                    modified_files: ['Podfile', 'Podfile.lock', 'any'],
                    created_files: ['any'],
                },
            };

            await ios.modifiedPodfileAndNotModifiedPodfileLock();

            expect(global.warn).not.toBeCalled();
        });
    });

    describe('plist checks', () => {

        it('Should warn if a plist file has ATS exception', async () => {
            global.danger = {
                git: {
                    modified_files: plistFile,
                    created_files: [],
                    diffForFile: jest.fn(() => ({
                        added: `
                            some text
                            <key>NSAppTransportSecurity</key>
                            more text
                        `,
                    })),
                },
            };

            await ios.atsException();

            expect(global.warn).toBeCalled();
        });

        it('Should warn if landscape orientation is set in plist', async () => {
            global.danger = {
                git: {
                    modified_files: plistFile,
                    created_files: [],
                    diffForFile: jest.fn(() => ({
                        added: `
                            some text
                            <string>UIInterfaceOrientationLandscape</string>
                            more text
                        `,
                    })),
                },
            };

            await ios.landscapeOrientation();

            expect(global.warn).toBeCalled();
        });

    });

    describe('podfile checks', () => {

        it('Should warn when pods are loaded from external git repos', async () => {
            global.danger = {
                git: {
                    modified_files: ['Podfile'],
                    created_files: [],
                    diffForFile: jest.fn(() => ({
                        added: `
                            pod 'GoogleAnalytics',      '3.14.0'
                            pod 'TQ1SDK',               :git => 'https://github.com/tq1/taqtile-sdk-ios.git'
                            pod 'Firebase/Core',        '4.0.0'
                        `,
                    })),
                },
            };

            await ios.podFromExternalRepo();

            expect(global.warn).toBeCalled();
        });

        it('Should warn when pods do not have version specified', async () => {
            global.danger = {
                git: {
                    modified_files: ['Podfile'],
                    created_files: [],
                    diffForFile: jest.fn(() => ({
                        added: `
                            pod 'HCSStarRatingView',        '~> 1.5'
                            pod 'Alamofire',                '4.6.0'
                            pod 'AlamofireImage',           '3.3.0'
                        `,
                    })),
                },
            };

            await ios.podWithoutFixedVersion();

            expect(global.warn).toBeCalled();
        });

    });
});
