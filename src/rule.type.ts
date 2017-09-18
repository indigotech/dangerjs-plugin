export type Rule = () => Promise<void>;

export interface Scope {
  [key: string]: Rule;
}
