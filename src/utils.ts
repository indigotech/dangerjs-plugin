// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import {DangerDSLType} from '../node_modules/danger/distribution/dsl/DangerDSL';
declare const danger: DangerDSLType;

export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;
// adapted from https://stackoverflow.com/a/37324915/429521
const intersect = (xs: FilesType[], ys: string[]): string[] =>
  ys.filter(
    y => xs.some(
      x => (typeof x === 'string') ? y === x : (y.match(x as RegExp) != null)),
);

export type FilesType = string | RegExp;

/**
 * Warn if any file on the list has changed or deleted.
 * @param filesToCheck List of files to be match with. The file can be a <RegExp> or a <string>.
 */
export async function warnIfFilesChanged(filesToCheck: FilesType[]): Promise<void | null> {
  const files = ([] as string[]).concat(
    danger.git.deleted_files  || [],
    danger.git.modified_files || [],
  );

  const toWarn = intersect(filesToCheck, files);

  if (toWarn.length > 0) {
    warn(`The following files are rarely modified but were commited: ${toWarn.map(f => `'${f}'`).join(', ')}`);
  }
}

/**
 * Return true if there is any match with pattern on specified files created or modified.
 * Return false otherwise.
 * @param pattern Regex pattern
 * @param filesToCheck (Optional) List of FilesType (string|pattern) to match with.
 * If empty, will check in any file created or modified.
 */
export const changedFilesContainsRegex = async (pattern: RegExp, filesToCheck: FilesType[] = []): Promise<boolean> => {
  let files = ([] as string[]).concat(
    danger.git.created_files  || [],
    danger.git.modified_files || [],
  );

  if (filesToCheck.length > 0) {
    files = intersect(filesToCheck, files);
  }

  for (const fileName of files) {
    const file = await danger.git.diffForFile(fileName);
    if (file && file.added.match(pattern)) {
      // return to avoid reading all files when we already know that there is an issue
      return true;
    }
  }
  return false;
};
