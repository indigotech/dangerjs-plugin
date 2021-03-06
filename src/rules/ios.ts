import { DangerDSLType } from '../../node_modules/danger/distribution/dsl/DangerDSL';
import { changedFilesContainsRegex, warnIfFilesChanged } from '../utils';
declare const danger: DangerDSLType;

export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

const plistFile = /\S.plist/;
const podfile = /Podfile/;

/**
 * ios rules
 */
export let ios = {

    /** Warn if some files/folders to be changed/committed like `Cakefile`, `settings.yml.erb`, `Fastfile` */
    async modifiedCakefileOrSettingsYmlOrFastlane() {
        const hasFileWithPattern = (array: string[], pattern: RegExp): boolean => {
            const fileChanged = array.findIndex(file => pattern.test(file)) > -1;
            return fileChanged;
        };

        if (hasFileWithPattern(danger.git.modified_files, /Cakefile/)) {
            warn('This PR changes the "Cakefile" file.');
        }

        if (hasFileWithPattern(danger.git.modified_files, /settings.yml.erb/)) {
            warn('This PR changes the "settings.yml.erb" file.');
        }

        if (hasFileWithPattern(danger.git.modified_files, /Fastfile/)) {
            warn('This PR changes the "Fastfile" file.');
        }
    },

    /** Warn when `Podfile` was modified and `Podfile.lock` was not */
    async modifiedPodfileAndNotModifiedPodfileLock() {
        const hasFileWithPattern = (array: string[], pattern: RegExp): boolean => {
            const fileChanged = array.findIndex(file => pattern.test(file)) > -1;
            return fileChanged;
        };

        if (hasFileWithPattern(danger.git.modified_files, /Podfile/)
            && !hasFileWithPattern(danger.git.modified_files, /Podfile.lock/)) {
            warn('This PR changes the "Podfile" file and did not changed "Podfile.lock".');
        }
    },

    /** Warn when ATS exception is found */
    async atsException() {
        if (await changedFilesContainsRegex(/.*NSAppTransportSecurity/g), [plistFile]) {
            warn('ATS Exception found in plist file.');
        }
    },

    /** Warn when landscape orientation is set */
    async landscapeOrientation() {
        if (await changedFilesContainsRegex(/.*UIInterfaceOrientationLandscape/g), [plistFile]) {
            warn('Landscape orientation is set in plist file.');
        }
    },

    /** Warn when pods are loaded from external git repos */
    async podFromExternalRepo() {
        if (await changedFilesContainsRegex(/.*:git/g), [podfile]) {
            warn('"Podfile" has pods being loaded from external git repos.');
        }
    },

    /** Warn when pods don't have version specified */
    async podWithoutFixedVersion() {
        if (await changedFilesContainsRegex(/'(?:((~>|>|>=|<|<=) (\d+\.\d+)(\.\d+)?))'/g), [podfile]) {
            warn('"Podfile" has one or more pods with no version specified.');
        }
    },
};
