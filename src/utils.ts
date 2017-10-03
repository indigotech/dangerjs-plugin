// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import {DangerDSLType} from '../node_modules/danger/distribution/dsl/DangerDSL';
declare const danger: DangerDSLType;

export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;
// adapted from https://stackoverflow.com/a/37324915/429521
const intersect = <T>(xs: T[], ys: T[]): T[] => xs.filter(x => ys.some(y => y === x));

export type FilesType = string; // TODO: | RegExp;

export async function warnIfFilesChanged(filesToCheck: FilesType[] ): Promise<void | null> {
  const files = ([] as string[]).concat(
    danger.git.deleted_files  || [],
    danger.git.modified_files || [],
  );

  const toWarn = intersect(filesToCheck, files);

  if (toWarn.length > 0) {
    warn(`The following files are rarely modified but were commited: ${toWarn.map(f => `'${f}'`).join(', ')}`);
  }
}
