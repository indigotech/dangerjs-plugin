import {DangerDSLType} from '../../node_modules/danger/distribution/dsl/DangerDSL';
declare const danger: DangerDSLType;

export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

/**
 * ios rules
 */
export let ios = {
    
    /** Warn if some files/folders to be changed/committed like `Cakefile`, `settings.yml.erb`, `Fastfile` */
    async modifiedGradleOrManifest() {
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

    };