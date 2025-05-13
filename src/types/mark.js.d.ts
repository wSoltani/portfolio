declare module 'mark.js' {
  export default class Mark {
    constructor(context: HTMLElement | HTMLElement[] | NodeList | string);
    mark(
      keyword: string | string[],
      options?: {
        element?: string;
        className?: string;
        separateWordSearch?: boolean;
        acrossElements?: boolean;
        caseSensitive?: boolean;
        exclude?: string[];
        accuracy?: string | { value: string; limiters: string[] };
        diacritics?: boolean;
        synonyms?: Record<string, string>;
        iframes?: boolean;
        iframesTimeout?: number;
        each?: (element: HTMLElement) => void;
        done?: (count: number) => void;
        debug?: boolean;
        log?: Console;
      }
    ): void;
    markRegExp(
      regexp: RegExp,
      options?: {
        element?: string;
        className?: string;
        exclude?: string[];
        iframes?: boolean;
        iframesTimeout?: number;
        each?: (element: HTMLElement) => void;
        done?: (count: number) => void;
        debug?: boolean;
        log?: Console;
      }
    ): void;
    unmark(options?: {
      element?: string;
      className?: string;
      exclude?: string[];
      iframes?: boolean;
      iframesTimeout?: number;
      done?: () => void;
      debug?: boolean;
      log?: Console;
    }): void;
  }
}
