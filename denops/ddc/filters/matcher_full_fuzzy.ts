import {
  BaseFilter,
  Candidate,
  Context,
  DdcOptions,
  FilterOptions,
  SourceOptions,
} from "./deps.ts";
import { Denops } from "./deps.ts";
import { fuzzy_escape } from "./matcher_fuzzy.ts";

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
    if (sourceOptions.ignoreCase) {
      completeStr = completeStr.toLowerCase();
    }
    const pattern = new RegExp(
      fuzzy_escape(completeStr, filterParams.camelcase as boolean),
    );
    if (sourceOptions.ignoreCase) {
      return Promise.resolve(candidates.filter(
        (candidate) => candidate.word.toLowerCase().match(pattern),
      ));
    } else {
      return Promise.resolve(candidates.filter(
        (candidate) => candidate.word.match(pattern),
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
