declare module 'fuse.js' {
  interface FuseOptions<T> {
    isCaseSensitive?: boolean;
    includeScore?: boolean;
    includeMatches?: boolean;
    minMatchCharLength?: number;
    shouldSort?: boolean;
    findAllMatches?: boolean;
    keys?: (string | { name: string; weight: number })[];
    location?: number;
    threshold?: number;
    distance?: number;
    useExtendedSearch?: boolean;
    ignoreLocation?: boolean;
    ignoreFieldNorm?: boolean;
    fieldNormWeight?: number;
  }

  interface FuseResult<T> {
    item: T;
    refIndex: number;
    score?: number;
    matches?: {
      indices: number[][];
      key?: string;
      value?: string;
    }[];
  }

  class Fuse<T> {
    constructor(list: T[], options?: FuseOptions<T>);
    search(pattern: string): FuseResult<T>[];
    setCollection(list: T[]): T[];
  }

  export default Fuse;
}
