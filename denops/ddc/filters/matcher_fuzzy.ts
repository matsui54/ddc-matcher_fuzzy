import {
  BaseFilter,
  Candidate,
  Context,
  DdcOptions,
  FilterOptions,
  SourceOptions,
} from "./deps.ts";
import { Denops } from "./deps.ts";

export function fuzzy_escape(str: string, camelcase: boolean): string {
  // escape special letters
  let p = str.replaceAll(/[.*+?^=!:${}()|[\]\/\\]/g, "\\$&");
  p = p.replaceAll(/([a-zA-Z0-9])/g, "$1.*");
  if (camelcase && str.search(/[A-Z]/) != -1) {
    p = p.replaceAll(
      /([a-z])/g,
      ((pat) => `[${pat.concat(pat.toUpperCase())}]`),
    );
  }
  p = p.replaceAll(/([a-zA-Z0-9_])\.\*/g, "$1[^$1]*");
  return p;
}

type Params = {
  camelcase: boolean;
};

export class Filter extends BaseFilter {
  filter(
    _denops: Denops,
    _context: Context,
    _options: DdcOptions,
    sourceOptions: SourceOptions,
    _filterOptions: FilterOptions,
    filterParams: Record<string, unknown>,
    completeStr: string,
    candidates: Candidate[],
  ): Promise<Candidate[]> {
    if (!completeStr) {
      return Promise.resolve(candidates);
    }
    let pattern: RegExp;
    if (sourceOptions.ignoreCase) {
      completeStr = completeStr.toLowerCase();
    }
    pattern = new RegExp(
      "^" + fuzzy_escape(completeStr, filterParams.camelcase as boolean),
    );

    if (sourceOptions.ignoreCase) {
      return Promise.resolve(candidates.filter(
        (candidate) => candidate.word.toLowerCase().search(pattern) != -1,
      ));
    } else {
      return Promise.resolve(candidates.filter(
        (candidate) => candidate.word.search(pattern) != -1,
      ));
    }
  }

  params(): Record<string, unknown> {
    const params: Params = {
      camelcase: false,
    };
    return params as unknown as Record<string, unknown>;
  }
}
